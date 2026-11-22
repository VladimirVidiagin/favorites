import type { CategoryRecord } from '../../../shared/db'

export type Category = CategoryRecord

/** Key used for uniqueness: names that differ only by spaces or case are the same category. */
export function toNameKey(name: string): string {
  return name.trim().toLowerCase()
}
