import React, { useEffect, useMemo, useState } from 'react'
import styles from './App.module.css'
import Sidebar from './components/Sidebar.jsx'
import NotesPane from './components/NotesPane.jsx'
import CreateGroupModal from './components/CreateGroupModal.jsx'

const LS_KEYS = {
  GROUPS: 'minimal_notes_groups_v1',
  NOTES: 'minimal_notes_notes_v1',
  LAST_GROUP: 'minimal_notes_last_group_v1'
}

export default function App() {
  const [groups, setGroups] = useState(() => JSON.parse(localStorage.getItem(LS_KEYS.GROUPS) || '[]'))
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem(LS_KEYS.NOTES) || '{}'))
  const [activeGroupId, setActiveGroupId] = useState(localStorage.getItem(LS_KEYS.LAST_GROUP) || null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 860)
  const [view, setView] = useState('list') // 'list' | 'notes'

  useEffect(() => { localStorage.setItem(LS_KEYS.GROUPS, JSON.stringify(groups)) }, [groups])
  useEffect(() => { localStorage.setItem(LS_KEYS.NOTES, JSON.stringify(notes)) }, [notes])
  useEffect(() => { if (activeGroupId) localStorage.setItem(LS_KEYS.LAST_GROUP, activeGroupId) }, [activeGroupId])

  useEffect(() => {
    if (activeGroupId && !groups.some(g => g.id === activeGroupId)) {
      setActiveGroupId(null)
    }
  }, [groups]) // eslint-disable-line

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 860)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      const hasValidActive = !!activeGroupId && groups.some(g => g.id === activeGroupId)
      setView(hasValidActive ? 'notes' : 'list')
    }
  }, [isMobile, activeGroupId, groups])

  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId) || null, [groups, activeGroupId])
  const activeNotes = useMemo(() => notes[activeGroupId] || [], [notes, activeGroupId])

  const addGroup = (name, color) => {
    const id = name.trim().toLowerCase()
    if (groups.some(g => g.id === id)) return { ok: false, reason: 'duplicate' }
    const newGroup = { id, name: name.trim(), color, createdAt: Date.now() }
    setGroups(prev => [...prev, newGroup])
    if (!activeGroupId) setActiveGroupId(newGroup.id)
    if (isMobile) setView('notes')
    return { ok: true }
  }

  const updateGroup = (oldId, name, color) => {
    const newId = name.trim().toLowerCase()
    if (newId !== oldId && groups.some(g => g.id === newId)) return { ok: false, reason: 'duplicate' }
    setGroups(prev => prev.map(g => g.id === oldId ? { ...g, id: newId, name: name.trim(), color } : g))
    if (newId !== oldId) {
      setNotes(prev => { const c = { ...prev }; c[newId] = c[oldId] || []; delete c[oldId]; return c })
      if (activeGroupId === oldId) setActiveGroupId(newId)
    }
    return { ok: true }
  }

  const deleteGroup = (id) => {
    setGroups(prev => prev.filter(g => g.id !== id))
    setNotes(prev => { const c = { ...prev }; delete c[id]; return c })
    if (activeGroupId === id) setActiveGroupId(null)
    if (isMobile) setView('list')
  }

  const addNote = (text) => {
    if (!activeGroupId) return
    const now = Date.now()
    const newNote = { id: crypto.randomUUID(), text: text.trim(), createdAt: now, updatedAt: now }
    setNotes(prev => ({ ...prev, [activeGroupId]: [...(prev[activeGroupId] || []), newNote] }))
  }
  const updateNote = (noteId, newText) => {
    if (!activeGroupId) return
    setNotes(prev => ({ ...prev, [activeGroupId]: (prev[activeGroupId] || []).map(n => n.id === noteId ? { ...n, text: newText, updatedAt: Date.now() } : n) }))
  }
  const deleteNoteItem = (noteId) => {
    if (!activeGroupId) return
    setNotes(prev => ({ ...prev, [activeGroupId]: (prev[activeGroupId] || []).filter(n => n.id !== noteId) }))
  }

  const openCreate = () => { setEditTarget(null); setIsModalOpen(true) }
  const openEdit = (group) => { setEditTarget(group); setIsModalOpen(true) }
  const handleSubmitGroup = (name, color) => {
    if (editTarget) {
      const r = updateGroup(editTarget.id, name, color)
      if (r.ok) setIsModalOpen(false)
      return r
    } else {
      const r = addGroup(name, color)
      if (r.ok) setIsModalOpen(false)
      return r
    }
  }

  const showSidebar = !isMobile || (isMobile && view === 'list')
  const canShowNotes = !isMobile || (isMobile && view === 'notes' && activeGroup)

  return (
    <div className={styles.appWrap}>
      {showSidebar && (
        <Sidebar
          groups={groups}
          activeGroupId={activeGroupId}
          onSelect={(id) => { setActiveGroupId(id); if (isMobile) setView('notes') }}
          onOpenCreate={openCreate}
          onDeleteGroup={(id) => { if (confirm('Delete this group and its notes?')) deleteGroup(id) }}
          onEditGroup={openEdit}
          isMobile={isMobile}
        />
      )}

      {canShowNotes && (
        <NotesPane
          key={activeGroupId || 'empty'}
          group={activeGroup}
          notes={activeNotes}
          onAddNote={addNote}
          onEditNote={updateNote}
          onDeleteNote={deleteNoteItem}
          showBack={isMobile}
          onBack={() => setView('list')}
        />
      )}

      {isModalOpen && (
        <CreateGroupModal
          mode={editTarget ? 'edit' : 'create'}
          initialName={editTarget?.name || ''}
          initialColor={editTarget?.color}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleSubmitGroup}
          existing={groups.map(g => g.id)}
        />
      )}
    </div>
  )
}
