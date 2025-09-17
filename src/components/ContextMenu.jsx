import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './ContextMenu.module.css'

export default function ContextMenu({ x, y, onClose, items = [] }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <>
      <div className={styles.overlay} onMouseDown={onClose} />
      <div className={styles.menu} style={{ top: y, left: x }} role="menu">
        {items.map((it, i) => (
          <button
            key={i}
            role="menuitem"
            className={`${styles.item} ${it.danger ? styles.danger : ''}`}
            onClick={() => { it.onSelect(); onClose() }}
          >
            {it.label}
          </button>
        ))}
      </div>
    </>,
    document.body
  )
}
