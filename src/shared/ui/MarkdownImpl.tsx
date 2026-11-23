import ReactMarkdown, { type Components } from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import styles from './Markdown.module.css'

// remark-breaks: a single Enter is a line break. Without it plain text typed on a phone
// would be glued into one paragraph (standard markdown needs an empty line).
// remark-gfm: bare URLs become links, plus lists/tables/strikethrough.
// Raw HTML is not rendered (react-markdown default), so stored text cannot inject markup.
const plugins = [remarkGfm, remarkBreaks]

const components: Components = {
  a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
}

export default function MarkdownImpl({ text }: { text: string }) {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={plugins} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  )
}
