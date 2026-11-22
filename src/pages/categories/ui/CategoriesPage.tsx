import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useCards } from '../../../entities/card'
import {
  DuplicateCategoryError,
  toNameKey,
  useCategories,
  useCreateCategory,
} from '../../../entities/category'
import { Fab, PageHeader } from '../../../shared/ui'
import styles from './CategoriesPage.module.css'

export function CategoriesPage() {
  const { data: categories = [] } = useCategories()
  const { data: cards = [] } = useCards()
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const card of cards) {
      if (card.categoryId) map.set(card.categoryId, (map.get(card.categoryId) ?? 0) + 1)
    }
    return map
  }, [cards])

  const key = toNameKey(query)
  const visible = key ? categories.filter((c) => c.nameKey.includes(key)) : categories

  return (
    // Lift the "+" button above the search field.
    <div style={{ '--fab-raise': '64px' } as CSSProperties}>
      <PageHeader title="Категории" />

      {creating && <NewCategoryForm onDone={() => setCreating(false)} />}

      {categories.length === 0 && !creating ? (
        <p className={styles.message}>Категорий пока нет. Нажми +, чтобы создать первую.</p>
      ) : visible.length === 0 && key ? (
        <p className={styles.message}>Ничего не найдено</p>
      ) : (
        <ul className={styles.list}>
          {visible.map((category) => (
            <li key={category.id}>
              <Link to={`/categories/${category.id}`} className={styles.item}>
                <span className={styles.name}>{category.name}</span>
                <span className={styles.count}>{counts.get(category.id) ?? 0}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.searchBar}>
        <input
          type="search"
          className={styles.search}
          placeholder="Поиск по категориям"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Fab label="Новая категория" onClick={() => setCreating(true)} />
    </div>
  )
}

function NewCategoryForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('')
  const createCategory = useCreateCategory()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createCategory.mutate(name, { onSuccess: onDone })
  }

  const error = createCategory.error
  const errorText =
    error instanceof DuplicateCategoryError ? 'Такая категория уже есть' : error?.message

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        autoFocus
        className={styles.input}
        placeholder="Название категории"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          createCategory.reset()
        }}
      />
      <div className={styles.formActions}>
        <button type="button" className={styles.secondary} onClick={onDone}>
          Отмена
        </button>
        <button type="submit" className={styles.primary} disabled={!name.trim() || createCategory.isPending}>
          Создать
        </button>
      </div>
      {errorText && <p className={styles.error}>{errorText}</p>}
    </form>
  )
}
