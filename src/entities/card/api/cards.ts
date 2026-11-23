import { db } from '../../../shared/db'
import type { Card, CardInput, CardPatch } from '../model/types'

function cleanTitle(title: string): string {
  const trimmed = title.trim()
  if (!trimmed) throw new Error('Card title is required')
  return trimmed
}

function cleanBadges(badges: string[] = []): string[] {
  return [...new Set(badges.map((b) => b.trim()).filter(Boolean))]
}

function checkRating(rating: number | undefined): void {
  if (rating === undefined) return
  if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
    throw new Error('Rating must be an integer from 1 to 10')
  }
}

/** Next global order value: puts the card at the end of whatever list it lands in. */
async function nextOrder(): Promise<number> {
  const last = await db.cards.orderBy('order').last()
  return last ? last.order + 1 : 0
}

/** All cards sorted by order. Wall = cards with categoryId === null. */
export function getAllCards(): Promise<Card[]> {
  return db.cards.orderBy('order').toArray()
}

export function getCard(id: string): Promise<Card | undefined> {
  return db.cards.get(id)
}

export async function createCard(input: CardInput): Promise<Card> {
  checkRating(input.rating)
  const card: Card = {
    id: crypto.randomUUID(),
    title: cleanTitle(input.title),
    link: input.link,
    description: input.description,
    imageId: input.imageId,
    categoryId: input.categoryId ?? null,
    badges: cleanBadges(input.badges),
    rating: input.rating,
    order: await nextOrder(),
    createdAt: Date.now(),
  }
  await db.cards.add(card)
  return card
}

export async function updateCard(id: string, patch: CardPatch): Promise<void> {
  checkRating(patch.rating)
  const changes: CardPatch = { ...patch }
  if (patch.title !== undefined) changes.title = cleanTitle(patch.title)
  if (patch.badges !== undefined) changes.badges = cleanBadges(patch.badges)
  const updated = await db.cards.update(id, changes)
  if (!updated) throw new Error(`Card ${id} not found`)
}

/** Moves a card to a category (or to the wall with null). The card goes to the end of the list. */
export async function moveCard(id: string, categoryId: string | null): Promise<void> {
  const updated = await db.cards.update(id, { categoryId, order: await nextOrder() })
  if (!updated) throw new Error(`Card ${id} not found`)
}

/**
 * Sets (blob) or removes (null) the card photo. The old image is deleted in the same
 * transaction, so replaced photos do not pile up in the database.
 */
export async function setCardImage(id: string, blob: Blob | null): Promise<void> {
  await db.transaction('rw', db.cards, db.images, async () => {
    const card = await db.cards.get(id)
    if (!card) throw new Error(`Card ${id} not found`)
    if (card.imageId) await db.images.delete(card.imageId)
    let imageId: string | undefined
    if (blob) {
      imageId = crypto.randomUUID()
      await db.images.add({ id: imageId, blob })
    }
    await db.cards.update(id, { imageId })
  })
}

/** Deletes the card together with its image. */
export async function deleteCard(id: string): Promise<void> {
  await db.transaction('rw', db.cards, db.images, async () => {
    const card = await db.cards.get(id)
    if (!card) return
    if (card.imageId) await db.images.delete(card.imageId)
    await db.cards.delete(id)
  })
}
