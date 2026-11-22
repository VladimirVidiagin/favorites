import { Outlet } from 'react-router'
import { TabBar } from '../../widgets/tab-bar'
import styles from './TabsLayout.module.css'

/** Screens with the bottom tab bar: wall, categories, category page. */
export function TabsLayout() {
  return (
    <div className={styles.page}>
      <Outlet />
      <TabBar />
    </div>
  )
}
