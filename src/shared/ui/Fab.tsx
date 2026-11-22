import styles from './Fab.module.css'

interface FabProps {
  label: string
  onClick: () => void
}

/** Round "+" button in the bottom right corner, above the tab bar. */
export function Fab({ label, onClick }: FabProps) {
  return (
    <button type="button" className={styles.fab} onClick={onClick} aria-label={label}>
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </button>
  )
}
