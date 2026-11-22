import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Category } from '../model/types'
import { createCategory, getAllCategories, renameCategory } from './categories'

export const categoryKeys = {
  all: ['categories'] as const,
}

export function useCategories() {
  return useQuery({ queryKey: categoryKeys.all, queryFn: getAllCategories })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getAllCategories,
    select: (categories: Category[]) => categories.find((c) => c.id === id),
  })
}

function useInvalidateCategories() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: categoryKeys.all })
}

/** Fails with DuplicateCategoryError if the name already exists (ignoring case and spaces). */
export function useCreateCategory() {
  const onSuccess = useInvalidateCategories()
  return useMutation({ mutationFn: (name: string) => createCategory(name), onSuccess })
}

export function useRenameCategory() {
  const onSuccess = useInvalidateCategories()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameCategory(id, name),
    onSuccess,
  })
}
