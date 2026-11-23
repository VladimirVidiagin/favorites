// Persistence shapes stored in IndexedDB.
// They live in shared/ because shared/db must not import from entities/ (FSD import rule).
// Entities re-export them as domain types.

export interface CardRecord {
  id: string
  title: string
  link?: string
  /** Markdown text. */
  description?: string
  /** Key in the `images` table. */
  imageId?: string
  /** null = card is on the wall. */
  categoryId: string | null
  badges: string[]
  /** Integer 1..10. */
  rating?: number
  /** Global sort position across all cards; hidden in UI. */
  order: number
  createdAt: number
}

export interface CategoryRecord {
  id: string
  /** Display name as the user typed it. */
  name: string
  /** Normalized name (trim + lower case), unique index. Blocks duplicates that differ only by case. */
  nameKey: string
  createdAt: number
}

/** Two JPEG versions of one photo (D-11). Neither field is indexed, so no schema version bump. */
export interface ImageRecord {
  id: string
  /** Long side up to 1600 px, for the card page. */
  full: Blob
  /** Short side up to 600 px, for grid tiles. */
  thumb: Blob
}
