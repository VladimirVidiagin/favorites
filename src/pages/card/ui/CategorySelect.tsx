import { useCategories } from '../../../entities/category'
import styles from './CardPage.module.css'

const WALL = ''

interface CategorySelectProps {
  /** null = the wall. */
  value: string | null
  onChange: (categoryId: string | null) => void
}

/** Native select: on iPhone it opens the system picker. */
export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { data: categories = [] } = useCategories()

  return (
    <select
      className={styles.select}
      value={value ?? WALL}
      onChange={(e) => onChange(e.target.value === WALL ? null : e.target.value)}
    >
      <option value={WALL}>Стена (без категории)</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  )
}
