import { useRef, type ChangeEvent } from 'react'
import { useImageUrl } from '../../../entities/card'
import styles from './CardPage.module.css'

interface PhotoPickerProps {
  imageId: string | undefined
  onPick: (blob: Blob | null) => void
}

/** Tap the photo (or placeholder) to choose from the gallery. */
export function PhotoPicker({ imageId, onPick }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const imageUrl = useImageUrl(imageId)

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // TODO: compress before saving. Photo compression is an open decision; until then
    // the original file from the gallery is stored as is.
    if (file) onPick(file)
    e.target.value = '' // allow picking the same file again
  }

  return (
    <div className={styles.media}>
      <button type="button" className={styles.mediaButton} onClick={() => inputRef.current?.click()}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className={styles.image} />
        ) : (
          <span className={styles.placeholder}>
            <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
              <path d="M4 7h3l2-2h6l2 2h3v12H4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Добавить фото
          </span>
        )}
      </button>
      {imageId && (
        <button type="button" className={styles.removePhoto} onClick={() => onPick(null)}>
          Убрать фото
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  )
}
