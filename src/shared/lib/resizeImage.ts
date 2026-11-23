export interface ResizeOptions {
  /** Upper bound for the chosen side in pixels; images are never upscaled. */
  max: number
  /** Which side `max` limits: 'long' fits the whole image, 'short' keeps enough for a cover crop. */
  side: 'long' | 'short'
  /** JPEG quality 0..1. */
  quality: number
}

/**
 * Re-encodes an image as JPEG, scaled down to fit `options`.
 *
 * Drawing to a canvas drops all EXIF metadata (GPS, camera, date), see D-11. Orientation is
 * applied by the browser while decoding, so the result is already upright.
 * JPEG is the only format every browser can both encode from canvas and display
 * (Safari cannot encode WebP and silently returns PNG).
 */
export async function resizeImage(source: Blob, options: ResizeOptions): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(source)
  } catch {
    throw new Error('Не удалось прочитать фото. Возможно, формат не поддерживается браузером.')
  }

  try {
    const { width, height } = bitmap
    const limited = options.side === 'long' ? Math.max(width, height) : Math.min(width, height)
    const scale = Math.min(1, options.max / limited)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D is not available')
    // JPEG has no transparency: without a background, transparent PNG areas turn black.
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Не удалось сжать фото'))),
        'image/jpeg',
        options.quality,
      )
    })
  } finally {
    bitmap.close() // frees the decoded original (tens of MB for a phone photo) right away
  }
}
