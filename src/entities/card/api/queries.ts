import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useObjectUrl } from '../../../shared/lib'
import type { Card, CardInput, CardPatch } from '../model/types'
import { createCard, deleteCard, getAllCards, moveCard, updateCard } from './cards'
import { getImage, saveImage } from './images'

export const cardKeys = {
  all: ['cards'] as const,
  image: (id: string) => ['images', id] as const,
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

/** Image as a URL for <img src>. Image blobs never change, so they are cached by id. */
export function useImageUrl(imageId: string | undefined): string | undefined {
  const { data } = useQuery({
    queryKey: cardKeys.image(imageId ?? ''),
    queryFn: () => getImage(imageId!),
    enabled: !!imageId,
  })
  return useObjectUrl(data)
}

export function useSaveImage() {
  return useMutation({ mutationFn: (blob: Blob) => saveImage(blob) })
}
