import { Link } from 'react-router'
import { useImageUrl } from '../api/queries'
import type { Card } from '../model/types'
import styles from './CardTile.module.css'

/** How many badges fit on the tile before "..." */
const MAX_BADGES = 2

export function CardTile({ card }: { card: Card }) {
  const imageUrl = useImageUrl(card.imageId)
  const shownBadges = card.badges.slice(0, MAX_BADGES)
  const hasMoreBadges = card.badges.length > MAX_BADGES

  return (
    <Link to={`/cards/${card.id}`} className={styles.tile}>
      <div className={styles.media}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className={styles.image} />
        ) : (
          // Placeholder deliberately looks unfinished: the UI should nudge to add a photo.
          <div className={styles.placeholder} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path d="M4 7h3l2-2h6l2 2h3v12H4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span>Добавить фото</span>
          </div>
        )}
        {card.rating !== undefined && <span className={styles.rating}>{card.rating}</span>}
        {shownBadges.length > 0 && (
          <div className={styles.badges}>
            {shownBadges.map((badge) => (
              <span key={badge} className={styles.badge}>
                {badge}
              </span>
            ))}
            {hasMoreBadges && <span className={`${styles.badge} ${styles.more}`}>...</span>}
          </div>
        )}
      </div>
      <div className={styles.title}>{card.title}</div>
    </Link>
  )
}
