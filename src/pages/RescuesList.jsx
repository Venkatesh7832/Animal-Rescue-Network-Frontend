import { useState, useEffect } from 'react'
import { rescueService } from '../services/rescueService'
import RescueCard from '../components/RescueCard'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'

const STATUSES     = ['', 'OPEN', 'IN_PROGRESS', 'RESCUED', 'CLOSED']
const ANIMAL_TYPES = ['', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Cow', 'Horse', 'Goat', 'Sheep', 'Other']

export default function RescuesList() {
  const [posts,    setPosts]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [page,     setPage]     = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [filters, setFilters] = useState({ status: '', animalType: '', location: '' })
  const [draft,   setDraft]   = useState({ status: '', animalType: '', location: '' })

  const load = (p = 0, f = filters) => {
    setLoading(true)
    const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v))
    rescueService.search(params, p, 12)
      .then(data => {
        setPosts(data.content || [])
        setTotalPages(data.totalPages || 0)
        setPage(p)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(0) }, [])

  const applyFilters = () => { setFilters(draft); load(0, draft) }

  const clearFilters = () => {
    const empty = { status: '', animalType: '', location: '' }
    setFilters(empty); setDraft(empty); load(0, empty)
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Browse Rescues</h1>
          <p style={styles.sub}>Find animals in need near you</p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <FiFilter size={15} style={{ color: '#4A6741', flexShrink: 0 }} />
          <select
            style={styles.select}
            value={draft.status}
            onChange={e => setDraft(d => ({ ...d, status: e.target.value }))}
          >
            <option value="">All statuses</option>
            {STATUSES.slice(1).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>

          <select
            style={styles.select}
            value={draft.animalType}
            onChange={e => setDraft(d => ({ ...d, animalType: e.target.value }))}
          >
            <option value="">All animals</option>
            {ANIMAL_TYPES.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <div style={styles.searchWrap}>
            <FiSearch size={14} style={{ color: '#8C7060', flexShrink: 0 }} />
            <input
              style={styles.searchInput}
              placeholder="Search by location…"
              value={draft.location}
              onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
            />
          </div>
        </div>

        <div style={styles.filterActions}>
          <button className="btn btn-primary" onClick={applyFilters}>Search</button>
          {hasFilters && (
            <button className="btn btn-secondary" onClick={clearFilters}>
              <FiX size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div style={styles.chips}>
          {filters.status     && <span style={styles.chip}>{filters.status.replace('_', ' ')} <button onClick={() => { const f = {...filters, status: ''}; setFilters(f); setDraft(f); load(0,f) }} style={styles.chipX}>×</button></span>}
          {filters.animalType && <span style={styles.chip}>{filters.animalType} <button onClick={() => { const f = {...filters, animalType: ''}; setFilters(f); setDraft(f); load(0,f) }} style={styles.chipX}>×</button></span>}
          {filters.location   && <span style={styles.chip}>📍 {filters.location} <button onClick={() => { const f = {...filters, location: ''}; setFilters(f); setDraft(f); load(0,f) }} style={styles.chipX}>×</button></span>}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner" /> Loading rescues…</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>🌿</span>
          <h3>No rescues found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <>
          <p style={styles.resultCount}>{posts.length} rescue{posts.length !== 1 ? 's' : ''} found</p>
          <div className="rescue-grid">
            {posts.map(p => <RescueCard key={p.id} post={p} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                className="btn btn-secondary"
                disabled={page === 0}
                onClick={() => load(page - 1)}
              >← Prev</button>
              <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
              <button
                className="btn btn-secondary"
                disabled={page >= totalPages - 1}
                onClick={() => load(page + 1)}
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  header: { marginBottom: 28 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#3D2B1F' },
  sub:   { color: '#8C7060', marginTop: 6 },
  filterBar: {
    background: '#FDFAF5', border: '1px solid #D8CAB5', borderRadius: 14,
    padding: '16px 20px', marginBottom: 20,
    display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterGroup: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', flex: 1 },
  select: {
    padding: '8px 12px', border: '1.5px solid #D8CAB5', borderRadius: 8,
    background: '#F5F0E8', fontSize: 13, color: '#3D2B1F',
    outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
  },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: 8,
    border: '1.5px solid #D8CAB5', borderRadius: 8,
    padding: '8px 12px', background: '#F5F0E8', flex: 1, minWidth: 180,
  },
  searchInput: {
    border: 'none', outline: 'none', background: 'transparent',
    fontSize: 13, color: '#3D2B1F', fontFamily: 'inherit', width: '100%',
  },
  filterActions: { display: 'flex', gap: 8 },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#C8DCBF', color: '#2D6A4F', padding: '4px 12px',
    borderRadius: 20, fontSize: 12, fontWeight: 600,
  },
  chipX: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#2D6A4F', fontWeight: 700, fontSize: 14, lineHeight: 1,
    padding: 0,
  },
  resultCount: { fontSize: 13, color: '#8C7060', marginBottom: 20 },
  pagination: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: 16, marginTop: 48,
  },
  pageInfo: { fontSize: 14, color: '#5C4535', fontWeight: 500 },
}
