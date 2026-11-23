import { db, type ImageRecord } from '../../../shared/db'
import { resizeImage } from '../../../shared/lib'

export type ImageVariant = 'full' | 'thumb'
export type PhotoVersions = Pick<ImageRecord, 'full' | 'thumb'>

/**
 * Turns a gallery file into the two stored versions (D-11).
 * The thumb is made from the already reduced full version: faster, and a smaller
 * downscale step gives a sharper result than going straight from 4000 px.
 */
export async function makePhotoVersions(file: Blob): Promise<PhotoVersions> {
  const full = await resizeImage(file, { max: 1600, side: 'long', quality: 0.82 })
  // Tiles crop to 3:4 with object-fit: cover, so the short side is what must stay sharp:
  // ~170 CSS px at 3x density = ~510 px.
  const thumb = await resizeImage(full, { max: 600, side: 'short', quality: 0.8 })
  return { full, thumb }
}

export async function getImage(id: string, variant: ImageVariant): Promise<Blob | undefined> {
  return (await db.images.get(id))?.[variant]
}
