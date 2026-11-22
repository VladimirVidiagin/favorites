import { db } from '../../../shared/db'

/** Stores a photo and returns its id for Card.imageId. Compression is not decided yet. */
export async function saveImage(blob: Blob): Promise<string> {
  const id = crypto.randomUUID()
  await db.images.add({ id, blob })
  return id
}

export async function getImage(id: string): Promise<Blob | undefined> {
  return (await db.images.get(id))?.blob
}

export function deleteImage(id: string): Promise<void> {
  return db.images.delete(id)
}
