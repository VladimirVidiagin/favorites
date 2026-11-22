import { db } from '../../../shared/db'

/**
 * Deletes a category and returns its cards to the wall (see product.md).
 * Lives in features/ because it changes two entities; entities must not import each other.
 * Cards keep their order values, so on the wall they mix with other cards by creation/move time.
 */
export async function deleteCategory(id: string): Promise<void> {
  await db.transaction('rw', db.cards, db.categories, async () => {
    await db.cards.where('categoryId').equals(id).modify({ categoryId: null })
    await db.categories.delete(id)
  })
}
