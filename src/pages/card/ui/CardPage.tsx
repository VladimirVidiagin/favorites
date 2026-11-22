import { useParams } from 'react-router'
import { useCard, useImageUrl } from '../../../entities/card'
import { PageHeader } from '../../../shared/ui'
import styles from './CardPage.module.css'

// Read-only for now. Editing waits for the open question
// "autosave per field or a Save button" (lab/open-questions.md).
export function CardPage() {
  const { cardId = '' } = useParams()
  const { data: card, isPending } = useCard(cardId)
  const imageUrl = useImageUrl(card?.imageId)

  if (isPending) return <PageHeader title="" backTo="/" />
  if (!card) return <PageHeader title="Карточка не найдена" backTo="/" />

  return (
    <>
      <PageHeader title="" backTo="/" />
      <div className={styles.media}>
        {imageUrl ? <img src={imageUrl} alt="" className={styles.image} /> : <div className={styles.placeholder}>Нет фото</div>}
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{card.title}</h2>
        {card.rating !== undefined && <p>Оценка: {card.rating} / 10</p>}
        {card.badges.length > 0 && (
          <div className={styles.badges}>
            {card.badges.map((badge) => (
              <span key={badge} className={styles.badge}>
                {badge}
              </span>
            ))}
          </div>
        )}
        {card.link && (
          <a href={card.link} target="_blank" rel="noreferrer" className={styles.link}>
            {card.link}
          </a>
        )}
        {card.description && <p className={styles.description}>{card.description}</p>}
      </div>
    </>
  )
}

export function NewCardPage() {
  return (
    <>
      <PageHeader title="Новая карточка" backTo="/" />
      <p className={styles.todo}>
        Создание карточки появится после решения "автосохранение или кнопка Сохранить".
      </p>
    </>
  )
}
