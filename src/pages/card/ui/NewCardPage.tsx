import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useCreateCard } from '../../../entities/card'
import { PageHeader } from '../../../shared/ui'
import styles from './CardPage.module.css'
import { CategorySelect } from './CategorySelect'

/**
 * New card form (D-10). Nothing is written to the database until "Создать", so leaving
 * the form never leaves an empty card behind. Photo, rating and badges are added on the
 * card screen right after creation.
 */
export function NewCardPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const createCard = useCreateCard()

  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(params.get('category'))

  const canCreate = title.trim() !== '' && !createCard.isPending

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!canCreate) return
    createCard.mutate(
      {
        title,
        link: link.trim() || undefined,
        description: description.trimEnd() || undefined,
        categoryId,
      },
      // replace: "back" from the new card goes to the grid, not to this empty form.
      { onSuccess: (card) => navigate(`/cards/${card.id}`, { replace: true }) },
    )
  }

  return (
    <>
      <PageHeader title="Новая карточка" backTo={categoryId ? `/categories/${categoryId}` : '/'} />
      <form className={styles.body} onSubmit={submit}>
        <label className={styles.section}>
          <span className={styles.label}>Название *</span>
          <input
            autoFocus
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например, фильм или рецепт"
          />
        </label>

        <label className={styles.section}>
          <span className={styles.label}>Ссылка</span>
          <input
            className={styles.input}
            type="url"
            inputMode="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className={styles.section}>
          <span className={styles.label}>Описание</span>
          <textarea
            className={styles.input}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className={styles.section}>
          <span className={styles.label}>Категория</span>
          <CategorySelect value={categoryId} onChange={setCategoryId} />
        </div>

        {createCard.error && <p className={styles.error}>Не удалось создать: {createCard.error.message}</p>}

        <button type="submit" className={styles.primary} disabled={!canCreate}>
          Создать
        </button>
      </form>
    </>
  )
}
