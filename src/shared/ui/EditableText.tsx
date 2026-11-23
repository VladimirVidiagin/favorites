import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import styles from './EditableText.module.css'

interface EditableTextProps {
  value: string
  onSave: (next: string) => void
  placeholder: string
  multiline?: boolean
  /** Empty value is not saved: the previous one comes back. */
  required?: boolean
  /** Shows an undo button while editing: returns the value from before this edit. */
  undoable?: boolean
  /** How the value looks when not editing (e.g. rendered markdown). Default: plain text. */
  renderView?: (value: string) => ReactNode
  variant?: 'title' | 'body'
  inputMode?: 'text' | 'url'
}

/**
 * Inline field with autosave (D-10): tap to edit, the value is saved when focus leaves.
 * No Save button. Links inside the view stay clickable and do not start editing.
 */
export function EditableText({
  value,
  onSave,
  placeholder,
  multiline = false,
  required = false,
  undoable = false,
  renderView,
  variant = 'body',
  inputMode = 'text',
}: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  // Refs, not state: blur and unmount handlers must see the latest values synchronously.
  const draftRef = useRef(value)
  const originalRef = useRef(value)
  const editingRef = useRef(false)
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  const onSaveRef = useRef(onSave)
  useEffect(() => {
    onSaveRef.current = onSave
  })

  const startEditing = () => {
    originalRef.current = value
    draftRef.current = value
    setDraft(value)
    editingRef.current = true
    setEditing(true)
  }

  const commit = () => {
    if (!editingRef.current) return
    editingRef.current = false
    setEditing(false)
    const next = multiline ? draftRef.current.trimEnd() : draftRef.current.trim()
    if (required && !next) return
    if (next !== originalRef.current) onSaveRef.current(next)
  }

  // Leaving the page while a field is focused (e.g. the back button) must not lose the edit.
  useEffect(() => () => commit(), []) // eslint-disable-line react-hooks/exhaustive-deps

  const undo = () => {
    draftRef.current = originalRef.current
    setDraft(originalRef.current)
    fieldRef.current?.blur()
  }

  const onViewClick = (e: MouseEvent) => {
    // A tap on a link inside the view opens the link instead of editing.
    if ((e.target as HTMLElement).closest('a')) return
    startEditing()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      fieldRef.current?.blur()
    }
  }

  if (!editing) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={`${styles.view} ${styles[variant]}`}
        onClick={onViewClick}
        onKeyDown={(e) => e.key === 'Enter' && startEditing()}
      >
        {value ? (renderView ? renderView(value) : value) : <span className={styles.placeholder}>{placeholder}</span>}
      </div>
    )
  }

  const common = {
    ref: fieldRef,
    autoFocus: true,
    className: `${styles.field} ${styles[variant]}`,
    value: draft,
    placeholder,
    onChange: (e: { target: { value: string } }) => {
      draftRef.current = e.target.value
      setDraft(e.target.value)
    },
    onBlur: commit,
    onKeyDown,
  }

  return (
    <div className={styles.editing}>
      {multiline ? (
        <textarea {...common} rows={Math.max(4, draft.split('\n').length + 1)} />
      ) : (
        <input {...common} type={inputMode === 'url' ? 'url' : 'text'} inputMode={inputMode} />
      )}
      {undoable && (
        <button
          type="button"
          className={styles.undo}
          aria-label="Отменить изменения"
          // preventDefault keeps focus in the field, so blur does not save the draft first.
          onPointerDown={(e) => e.preventDefault()}
          onClick={undo}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
