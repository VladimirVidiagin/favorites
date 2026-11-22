import { Dexie, type EntityTable } from 'dexie'
import type { CardRecord, CategoryRecord, ImageRecord } from './schema'

// The only module that imports Dexie directly (enforced by a lint rule).
class FavoritesDb extends Dexie {
  cards!: EntityTable<CardRecord, 'id'>
  categories!: EntityTable<CategoryRecord, 'id'>
  images!: EntityTable<ImageRecord, 'id'>

  constructor() {
    super('favorites')
    // Schema version 1. To change the schema, add this.version(2).stores(...) with an
    // .upgrade() callback; never edit an existing version.
    // Only indexed fields are listed here; other fields are stored as is.
    this.version(1).stores({
      cards: 'id, categoryId, order, createdAt',
      categories: 'id, &nameKey, createdAt',
      images: 'id',
    })
  }
}

export const db = new FavoritesDb()
