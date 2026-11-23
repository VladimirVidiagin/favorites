import { lazy, Suspense } from 'react'
import styles from './Markdown.module.css'

// The markdown parser is heavy (~170 KB), so it is loaded as a separate chunk the first
// time a description is shown. The wall and categories never download it.
const MarkdownImpl = lazy(() => import('./MarkdownImpl'))

export function Markdown({ text }: { text: string }) {
  return (
    <Suspense fallback={<div className={styles.fallback}>{text}</div>}>
      <MarkdownImpl text={text} />
    </Suspense>
  )
}
