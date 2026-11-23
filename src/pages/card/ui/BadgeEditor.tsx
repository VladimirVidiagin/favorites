import { useId, useState, type FormEvent } from 'react'
import styles from './CardPage.module.css'

interface BadgeEditorProps {
  badges: string[]
  /** Badges used by other cards in the same place; offered while typing. */
  suggestions: string[]
  onChange: (badges: string[]) => void
}

export function BadgeEditor({ badges, suggestions, onChange }: BadgeEditorProps) {
  const [text, setText] = useState('')
  const listId = useId()
  const offered = suggestions.filter((s) => !badges.includes(s))

  const add = (e: FormEvent) => {
    e.preventDefault()
    const badge = text.trim()
    if (badge && !badges.includes(badge)) onChange([...badges, badge])
    setText('')
  }

  return (
    <div>
      {badges.length > 0 && (
        <div className={styles.badges}>
          {badges.map((badge) => (
            <span key={badge} className={styles.badge}>
              {badge}
              <button
                type="button"
                className={styles.badgeRemove}
                aria-label={`Убрать значок ${badge}`}
                onClick={() => onChange(badges.filter((b) => b !== badge))}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
      <form onSubmit={add} className={styles.badgeForm}>
        <input
          className={styles.badgeInput}
          placeholder="Добавить значок"
          list={listId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          enterKeyHint="done"
        />
        <datalist id={listId}>
          {offered.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <button type="submit" className={styles.badgeAdd} disabled={!text.trim()}>
          +
        </button>
      </form>
    </div>
  )
}
