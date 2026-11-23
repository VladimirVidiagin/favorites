import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  useCard,
  useCardsIn,
  useDeleteCard,
  useMoveCard,
  useSetCardImage,
  useUpdateCard,
  type Card,
  type CardPatch,
} from '../../../entities/card'
import { EditableText, Markdown, PageHeader } from '../../../shared/ui'
import { BadgeEditor } from './BadgeEditor'
import styles from './CardPage.module.css'
import { CategorySelect } from './CategorySelect'
import { PhotoPicker } from './PhotoPicker'
import { RatingPicker } from './RatingPicker'

/** Card screen (D-9): every field is edited in place and saved right away (D-10). */
export function CardPage() {
  const { cardId = '' } = useParams()
  const { data: card, isPending } = useCard(cardId)

  if (isPending) return <PageHeader title="" backTo="/" />
  if (!card) return <PageHeader title="Карточка не найдена" backTo="/" />
  return <CardEditor card={card} />
}

function CardEditor({ card }: { card: Card }) {
  const navigate = useNavigate()
  const [error, setError] = useState<string>()
  const onError = (e: Error) => setError(`Не удалось сохранить: ${e.message}`)

  const updateCard = useUpdateCard()
  const moveCard = useMoveCard()
  const setCardImage = useSetCardImage()
  const deleteCard = useDeleteCard()
  // Badge suggestions come from cards of the same place (wall or category), see D-4.
  const { data: neighbours = [] } = useCardsIn(card.categoryId)
  const suggestions = [...new Set(neighbours.flatMap((c) => c.badges))]

  const save = (patch: CardPatch) => {
    setError(undefined)
    updateCard.mutate({ id: card.id, patch }, { onError })
  }

  const remove = () => {
    if (!window.confirm('Удалить карточку? Это нельзя отменить.')) return
    deleteCard.mutate(card.id, {
      onSuccess: () => navigate(card.categoryId ? `/categories/${card.categoryId}` : '/', { replace: true }),
      onError,
    })
  }

  return (
    <>
      <PageHeader title="" backTo={card.categoryId ? `/categories/${card.categoryId}` : '/'} />

      <PhotoPicker
        imageId={card.imageId}
        busy={setCardImage.isPending}
        onPick={(file) => {
          setError(undefined)
          setCardImage.mutate({ id: card.id, file }, { onError })
        }}
      />

      <div className={styles.body}>
        {error && <p className={styles.error}>{error}</p>}

        <EditableText
          variant="title"
          value={card.title}
          placeholder="Название"
          required
          onSave={(title) => save({ title })}
        />

        <section className={styles.section}>
          <h3 className={styles.label}>Категория</h3>
          <CategorySelect
            value={card.categoryId}
            onChange={(categoryId) => moveCard.mutate({ id: card.id, categoryId }, { onError })}
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.label}>Оценка</h3>
          <RatingPicker value={card.rating} onChange={(rating) => save({ rating })} />
        </section>

        <section className={styles.section}>
          <h3 className={styles.label}>Значки</h3>
          <BadgeEditor badges={card.badges} suggestions={suggestions} onChange={(badges) => save({ badges })} />
        </section>

        <section className={styles.section}>
          <h3 className={styles.label}>Ссылка</h3>
          <div className={styles.linkRow}>
            <div className={styles.grow}>
              <EditableText
                value={card.link ?? ''}
                placeholder="Вставь ссылку"
                inputMode="url"
                undoable
                onSave={(link) => save({ link: link || undefined })}
              />
            </div>
            {card.link && (
              <a href={card.link} target="_blank" rel="noreferrer" className={styles.open} aria-label="Открыть ссылку">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.label}>Описание</h3>
          <EditableText
            value={card.description ?? ''}
            placeholder="Добавь описание"
            multiline
            undoable
            renderView={(text) => <Markdown text={text} />}
            onSave={(description) => save({ description: description || undefined })}
          />
        </section>

        <button type="button" className={styles.danger} onClick={remove}>
          Удалить карточку
        </button>
      </div>
    </>
  )
}
