import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  /**
   * Where "back" leads if there is no in-app history (the page was opened directly,
   * e.g. from a home screen launch). Omit on tab root screens: they have no back button.
   */
  backTo?: string
  /** Slot on the right, e.g. the filter button. */
  right?: ReactNode
}

export function PageHeader({ title, backTo, right }: PageHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    // 'default' key = this is the first entry of the app session, history.back() would leave the app.
    if (location.key === 'default') navigate(backTo!, { replace: true })
    else navigate(-1)
  }

  return (
    <header className={styles.header}>
      <div className={styles.side}>
        {backTo !== undefined && (
          <button type="button" className={styles.back} onClick={goBack} aria-label="Назад">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={`${styles.side} ${styles.right}`}>{right}</div>
    </header>
  )
}
