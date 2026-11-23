import styles from './CardPage.module.css'

interface RatingPickerProps {
  value: number | undefined
  /** undefined = rating removed. */
  onChange: (rating: number | undefined) => void
}

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/** Tap a number to set the rating, tap the selected number again to remove it. */
export function RatingPicker({ value, onChange }: RatingPickerProps) {
  return (
    <div className={styles.rating} role="radiogroup" aria-label="Оценка">
      {SCALE.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === value}
          className={`${styles.ratingButton} ${n === value ? styles.ratingActive : ''}`}
          onClick={() => onChange(n === value ? undefined : n)}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
