import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cardKeys } from '../../../entities/card'
import { categoryKeys } from '../../../entities/category'
import { deleteCategory } from './deleteCategory'

/** Changes both cards and categories, so both caches are invalidated. */
export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: cardKeys.all }),
        queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
      ]),
  })
}
