import type { CardRecord } from '../../../shared/db'

export type Card = CardRecord

export interface CardInput {
  title: string
  link?: string
  description?: string
  imageId?: string
  /** Omitted or null = put on the wall. */
  categoryId?: string | null
  badges?: string[]
  rating?: number
}

/** Category changes go through moveCard, not updateCard. */
export type CardPatch = Partial<Omit<CardInput, 'categoryId'>>
