import { CardTile, useCardsIn } from '../../../entities/card'
import styles from './CardGrid.module.css'

interface CardGridProps {
  /** null = the wall. */
  categoryId: string | null
  emptyText: string
}

export function CardGrid({ categoryId, emptyText }: CardGridProps) {
  const { data: cards, isPending, error } = useCardsIn(categoryId)

  if (isPending) return null
  if (error) return <p className={styles.message}>Не удалось загрузить карточки: {error.message}</p>
  if (cards.length === 0) return <p className={styles.message}>{emptyText}</p>

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <CardTile key={card.id} card={card} />
      ))}
    </div>
  )
}
