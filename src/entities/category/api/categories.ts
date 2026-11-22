import { db } from '../../../shared/db'
import { toNameKey, type Category } from '../model/types'

export class DuplicateCategoryError extends Error {
  constructor(name: string) {
    super(`Category "${name}" already exists`)
  }
}

function cleanName(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Category name is required')
  return trimmed
}

async function ensureUnique(nameKey: string, exceptId?: string): Promise<void> {
  const existing = await db.categories.where('nameKey').equals(nameKey).first()
  if (existing && existing.id !== exceptId) throw new DuplicateCategoryError(existing.name)
}

export function getAllCategories(): Promise<Category[]> {
  return db.categories.orderBy('createdAt').toArray()
}

export function getCategory(id: string): Promise<Category | undefined> {
  return db.categories.get(id)
}

export async function createCategory(name: string): Promise<Category> {
  const clean = cleanName(name)
  const nameKey = toNameKey(clean)
  await ensureUnique(nameKey)
  const category: Category = { id: crypto.randomUUID(), name: clean, nameKey, createdAt: Date.now() }
  await db.categories.add(category)
  return category
}

export async function renameCategory(id: string, name: string): Promise<void> {
  const clean = cleanName(name)
  const nameKey = toNameKey(clean)
  await ensureUnique(nameKey, id)
  const updated = await db.categories.update(id, { name: clean, nameKey })
  if (!updated) throw new Error(`Category ${id} not found`)
}
