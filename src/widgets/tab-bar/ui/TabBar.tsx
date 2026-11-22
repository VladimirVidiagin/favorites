import { NavLink, useLocation } from 'react-router'
import styles from './TabBar.module.css'

export function TabBar() {
  const { pathname } = useLocation()
  // A category page (/categories/:id) belongs to the "Categories" tab.
  const inCategories = pathname.startsWith('/categories')

  return (
    <nav className={styles.bar}>
      <NavLink to="/" className={`${styles.tab} ${!inCategories ? styles.active : ''}`}>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        Стена
      </NavLink>
      <NavLink to="/categories" className={`${styles.tab} ${inCategories ? styles.active : ''}`}>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        Категории
      </NavLink>
    </nav>
  )
}
