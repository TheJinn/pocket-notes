import React, { useEffect, useRef, useState } from 'react'
import styles from './NotesPane.module.css'
import { formatDateTime } from '../utils/time.js'

export default function NotesPane({ group, notes, onAddNote, onEditNote, onDeleteNote, showBack, onBack }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [group?.id])

  const handleSubmit = () => {
    const text = value.trim()
    if (!text) return
    onAddNote(text)
    setValue('')
  }

  if (!group) {
    return (
      <section className={styles.paneWelcome}>
        <div className={styles.illustration} aria-hidden="true" title="Welcome illustration"></div>
        <h2 className={styles.welcomeTitle}>Pocket Notes</h2>
        <p className={styles.welcomeText}>Send and receive messages without keeping your phone online.<br/>Use Pocket Notes on up to 4 linked devices and 1 mobile phone.</p>
        <div className={styles.encrypted}>🔒 end-to-end encrypted</div>
      </section>
    )
  }

  return (
    <section className={styles.pane}>
      <header className={styles.topBar}>
        {showBack && <button className={styles.backBtn} onClick={onBack} aria-label="Back" title="Back">←</button>}
        <div className={styles.groupTitle}>{group.name}</div>
      </header>

      <div className={styles.noteList}>
        {notes.map(n => (
          <article key={n.id} className={styles.noteCard}>
            <div className={styles.noteText}>{n.text}</div>
            <div className={styles.noteMeta}>
              <span title="Created">{formatDateTime(n.createdAt)}</span>
              {n.updatedAt !== n.createdAt && <><span className={styles.dot}>•</span><span title="Updated">Updated {formatDateTime(n.updatedAt)}</span></>}
            </div>
            <div className={styles.noteActions}><button className={styles.link} onClick={() => onDeleteNote(n.id)}>Delete</button></div>
          </article>
        ))}
        {notes.length === 0 && <div className={styles.emptyNotes}>No notes yet in this group</div>}
      </div>

      <div className={styles.inputBar}>
        <input ref={inputRef} type="text" placeholder="Enter your text here............" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key==='Enter' && handleSubmit()} className={styles.input} aria-label="Note input" />
        <button onClick={handleSubmit} className={`${styles.sendBtn} ${value.trim() ? styles.sendEnabled : ''}`} aria-label="Add note" title="Add note">▶</button>
      </div>
    </section>
  )
}
