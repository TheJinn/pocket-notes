import React, { useEffect, useRef, useState } from 'react'
import styles from './CreateGroupModal.module.css'

const SWATCHES = ['#0b57ff','#b197ff','#ffb3c0','#49e6f2','#f39a7a','#7ea3ff']

export default function CreateGroupModal({ mode='create', initialName='', initialColor, onClose, onCreate, existing }) {
  const [name, setName] = useState(initialName)
  const defaultColor = initialColor || SWATCHES[0]
  const [color, setColor] = useState(defaultColor)
  const [error, setError] = useState('')
  const overlayRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const tryCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) return setError('Please enter a group name')
    const id = trimmed.toLowerCase()
    if (mode==='create' && existing.includes(id)) return setError('That group already exists')
    const res = onCreate(trimmed, color)
    if (!res.ok && res.reason === 'duplicate') setError('That group already exists')
  }

  const onOverlayClick = (e) => { if (e.target === overlayRef.current) onClose() }

  return (
    <div className={styles.overlay} ref={overlayRef} onMouseDown={onOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="cg-title">
        <h2 id="cg-title" className={styles.title}>{mode==='create' ? 'Create New group' : 'Edit group'}</h2>
        <label className={styles.row}>
          <span className={styles.label}>Group Name</span>
          <input ref={inputRef} type="text" value={name} onChange={(e) => { setName(e.target.value); setError('') }} className={styles.input} placeholder="Enter group name" onKeyDown={(e) => e.key==='Enter' && tryCreate()} />
        </label>

        <div className={styles.row}>
          <span className={styles.label}>Choose colour</span>
          <div className={styles.swatches}>
            {SWATCHES.map(s => (
              <button
                key={s}
                className={`${styles.swatch} ${s === color ? styles.swatchActive : ''}`}
                style={{ background:s }}
                onClick={() => setColor(s)}
                aria-label={`Choose ${s}`}
                title={`Choose ${s}`}
              />
            ))}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}><button className={styles.cancel} onClick={onClose}>Cancel</button><button className={styles.create} onClick={tryCreate}>{mode==='create' ? 'Create' : 'Save'}</button></div>
      </div>
    </div>
  )
}
