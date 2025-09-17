import React, { useEffect, useRef, useState } from 'react'
import styles from './Sidebar.module.css'
import { getInitials } from '../utils/strings.js'
import ContextMenu from './ContextMenu.jsx'

export default function Sidebar({
  groups, activeGroupId, onSelect, onOpenCreate, onDeleteGroup, onEditGroup, isMobile
}) {
  const listRef = useRef(null)
  const [menuState, setMenuState] = useState(null)

  useEffect(() => {
    const onScroll = () => { if (menuState) setMenuState(null) }
    const el = listRef.current
    if (el) el.addEventListener('scroll', onScroll)
    return () => el && el.removeEventListener('scroll', onScroll)
  }, [menuState])

  const openMenu = (e, group) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = r.left + window.scrollX - 160 + r.width
    const y = r.bottom + window.scrollY + 6
    setMenuState({ x, y, group })
  }

  const closeMenu = () => setMenuState(null)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Pocket Notes</div>

      <nav className={styles.groupList} ref={listRef}>
        {groups.map(g => (
          <div key={g.id} className={`${styles.groupRow} ${g.id === activeGroupId ? styles.active : ''}`}>
            <button onClick={() => onSelect(g.id)} className={styles.groupItem}>
              <div
                className={styles.avatar}
                style={{ background: g.color }}
                role="img"
                aria-label={`${g.name} group avatar with initials ${getInitials(g.name)}`}
              >
                {getInitials(g.name)}
              </div>
              <div className={styles.groupName}>{g.name}</div>
            </button>
            <button
              className={`${styles.menuBtn} ${isMobile ? styles.menuAlways : ''}`}
              title="Options"
              aria-label={`Options for ${g.name}`}
              onClick={(e) => openMenu(e, g)}
            >
              ⋮
            </button>
          </div>
        ))}
        {groups.length === 0 && <div className={styles.emptyState}>Create your first group</div>}
      </nav>

      <button className={styles.fab} onClick={onOpenCreate} aria-label="Create group" title="Create group">＋</button>

      {menuState && (
        <ContextMenu
          x={menuState.x}
          y={menuState.y}
          onClose={closeMenu}
          items={[
            { label: 'Edit group', onSelect: () => onEditGroup(menuState.group) },
            { label: 'Delete group', danger: true, onSelect: () => onDeleteGroup(menuState.group.id) },
          ]}
        />
      )}
    </aside>
  )
}
