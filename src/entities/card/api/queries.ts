import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useObjectUrl } from '../../../shared/lib'
import type { Card, CardInput, CardPatch } from '../model/types'
import { createCard, deleteCard, getAllCards, moveCard, setCardImage, updateCard } from './cards'
import { getImage, makePhotoVersions, type ImageVariant } from './images'

export const cardKeys = {
  all: ['cards'] as const,
  image: (id: string, variant: ImageVariant) => ['images', id, variant] as const,
}

// One query holds all cards (D-4: everything is loaded at start).
// Wall, category page and card detail derive their data from it with `select`.

export function useCards() {
  return useQuery({ queryKey: cardKeys.all, queryFn: getAllCards })
}

/** Cards on the wall (categoryId === null) or in one category. */
export function useCardsIn(categoryId: string | null) {
  return useQuery({
    queryKey: cardKeys.all,
    queryFn: getAllCards,
    select: (cards: Card[]) => cards.filter((c) => c.categoryId === categoryId),
  })
}

export function useCard(id: string) {
  return useQuery({
    queryKey: cardKeys.all,
    queryFn: getAllCards,
    select: (cards: Card[]) => cards.find((c) => c.id === id),
  })
}

function useInvalidateCards() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: cardKeys.all })
}

export function useCreateCard() {
  const onSuccess = useInvalidateCards()
  return useMutation({ mutationFn: (input: CardInput) => createCard(input), onSuccess })
}

export function useUpdateCard() {
  const onSuccess = useInvalidateCards()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: CardPatch }) => updateCard(id, patch),
    onSuccess,
  })
}

export function useMoveCard() {
  const onSuccess = useInvalidateCards()
  return useMutation({
    mutationFn: ({ id, categoryId }: { id: string; categoryId: string | null }) =>
      moveCard(id, categoryId),
    onSuccess,
  })
}

export function useDeleteCard() {
  const onSuccess = useInvalidateCards()
  return useMutation({ mutationFn: (id: string) => deleteCard(id), onSuccess })
}

/**
 * Image as a URL for <img src>. Image blobs never change (a new photo gets a new id),
 * so they are cached by id. Use 'thumb' in grids and 'full' on the card page (D-11).
 */
export function useImageUrl(imageId: string | undefined, variant: ImageVariant): string | undefined {
  const { data } = useQuery({
    queryKey: cardKeys.image(imageId ?? '', variant),
    queryFn: () => getImage(imageId!, variant),
    enabled: !!imageId,
  })
  return useObjectUrl(data)
}

/**
 * Sets or removes (null) the card photo; the old image is deleted.
 * Compression runs inside the mutation, so `isPending` covers it and the UI can show a loader.
 */
export function useSetCardImage() {
  const onSuccess = useInvalidateCards()
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: Blob | null }) =>
      setCardImage(id, file ? await makePhotoVersions(file) : null),
    onSuccess,
  })
}
