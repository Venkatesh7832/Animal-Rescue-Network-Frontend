import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { rescueService } from '../services/rescueService'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiXCircle, FiMapPin, FiClock } from 'react-icons/fi'

const CLAIM_STATUS_STYLE = {
  PENDING:   { bg: '#FFF3CD', color: '#856404' },
  ACCEPTED:  { bg: '#D4EDDA', color: '#2D6A4F' },
  COMPLETED: { bg: '#CCE5FF', color: '#1A4F8A' },
  CANCELLED: { bg: '#EDE6D6', color: '#8C7060' },
}

export default function VolunteerDashboard() {
  const { user, isLoggedIn } = useAuth()
  const [myPosts,  setMyPosts]  = useState([])
  const [myClaims, setMyClaims] = useState([])
  const [tab, setTab] = useState('claims')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) return
    Promise.all([rescueService.getMyPosts(), rescueService.getMyClaims()])
      .then(([posts, claims]) => { setMyPosts(posts); setMyClaims(claims) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isLoggedIn])

  const handleComplete = async (claimId) => {
    try {
      await rescueService.updateClaimStatus(claimId, 'COMPLETED')
      setMyClaims(c => c.map(cl => cl.id === claimId ? { ...cl, status: 'COMPLETED' } : cl))
      toast.success('Marked as completed! 🎉')
    } catch { toast.error('Failed to update.') }
  }

  const handleCancel = async (claimId) => {
    if (!window.confirm('Cancel this claim?')) return
    try {
      await rescueService.cancelClaim(claimId)
      setMyClaims(c => c.map(cl => cl.id === claimId ? { ...cl, status: 'CANCELLED' } : cl))
      toast.success('Claim cancelled.')
    } catch { toast.error('Failed to cancel.') }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return
    try {
      await rescueService.delete(postId)
      setMyPosts(p => p.filter(post => post.id !== postId))
      toast.success('Post deleted.')
    } catch { toast.error('Failed to delete.') }
  }

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 48 }}>🔒</span>
        <h2 style={{ fontFamily: 'var(--font-display)', marginTop: 16, color: 'var(--bark)' }}>Login Required</h2>
        <p style={{ color: 'var(--text-light)', margin: '12px 0 24px' }}>Please login to view your dashboard.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Volunteer Dashboard</h1>
          <p style={styles.sub}>Welcome back, <strong>{user?.username}</strong> 👋</p>
        </div>
        <Link to="/post-rescue" className="btn btn-primary">+ Post Rescue</Link>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { label: 'My Posts',      val: myPosts.length,                          color: '#4A6741' },
          { label: 'Active Claims', val: myClaims.filter(c => c.status === 'PENDING').length, color: '#D4821A' },
          { label: 'Completed',     val: myClaims.filter(c => c.status === 'COMPLETED').length, color: '#1A4F8A' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <strong style={{ ...styles.statNum, color: s.color }}>{s.val}</strong>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['claims', 'posts'].map(t => (
          <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }} onClick={() => setTab(t)}>
            {t === 'claims' ? `My Claims (${myClaims.length})` : `My Posts (${myPosts.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /> Loading…</div>
      ) : tab === 'claims' ? (
        myClaims.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 48 }}>🙋</span>
            <h3>No claims yet</h3>
            <p>Browse rescues and volunteer to help animals in need.</p>
            <Link to="/rescues" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Rescues</Link>
          </div>
        ) : (
          <div style={styles.list}>
            {myClaims.map(claim => {
              const s = CLAIM_STATUS_STYLE[claim.status] || CLAIM_STATUS_STYLE.PENDING
              return (
                <div key={claim.id} style={styles.claimCard}>
                  <div style={styles.claimLeft}>
                    <span style={{ ...styles.statusPill, background: s.bg, color: s.color }}>
                      {claim.status}
                    </span>
                    <Link to={`/rescues/${claim.rescuePost?.id}`} style={styles.claimTitle}>
                      {claim.rescuePost?.title || 'Rescue Post'}
                    </Link>
                    <div style={styles.claimMeta}>
                      {claim.rescuePost?.location && (
                        <span style={styles.metaItem}><FiMapPin size={12} /> {claim.rescuePost.location}</span>
                      )}
                      {claim.claimedAt && (
                        <span style={styles.metaItem}><FiClock size={12} /> {new Date(claim.claimedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {claim.notes && <p style={styles.notes}>{claim.notes}</p>}
                  </div>
                  {claim.status === 'PENDING' && (
                    <div style={styles.claimActions}>
                      <button className="btn btn-primary" onClick={() => handleComplete(claim.id)}>
                        <FiCheckCircle size={14} /> Complete
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleCancel(claim.id)}>
                        <FiXCircle size={14} /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      ) : (
        myPosts.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 48 }}>📋</span>
            <h3>No posts yet</h3>
            <p>Post a rescue to report animals that need help.</p>
            <Link to="/post-rescue" className="btn btn-primary" style={{ marginTop: 16 }}>Post a Rescue</Link>
          </div>
        ) : (
          <div style={styles.list}>
            {myPosts.map(post => (
              <div key={post.id} style={styles.postRow}>
                <div>
                  <Link to={`/rescues/${post.id}`} style={styles.claimTitle}>{post.title}</Link>
                  <div style={styles.claimMeta}>
                    <span style={styles.metaItem}><FiMapPin size={12} /> {post.location}</span>
                    <span className={`badge badge-${post.status?.toLowerCase().replace('_','-')}`}>
                      {post.status}
                    </span>
                  </div>
                </div>
                <div style={styles.claimActions}>
                  <Link to={`/rescues/${post.id}`} className="btn btn-secondary">View</Link>
                  <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#3D2B1F' },
  sub: { color: '#8C7060', marginTop: 6, fontSize: 15 },
  statsRow: { display: 'flex', gap: 16, marginBottom: 36, flexWrap: 'wrap' },
  statCard: {
    flex: 1, minWidth: 140,
    background: '#FDFAF5', border: '1px solid #D8CAB5',
    borderRadius: 14, padding: '20px 24px',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700 },
  statLabel: { fontSize: 12, color: '#8C7060', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tabs: { display: 'flex', gap: 4, marginBottom: 28, borderBottom: '2px solid #EDE6D6', paddingBottom: 0 },
  tab: {
    padding: '10px 22px', border: 'none', background: 'none',
    cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#8C7060',
    borderBottom: '2px solid transparent', marginBottom: -2,
    fontFamily: 'inherit', transition: 'all 0.2s',
  },
  tabActive: { color: '#4A6741', borderBottomColor: '#4A6741', fontWeight: 700 },
  list: { display: 'flex', flexDirection: 'column', gap: 14 },
  claimCard: {
    background: '#FDFAF5', border: '1px solid #D8CAB5', borderRadius: 14,
    padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: 16, flexWrap: 'wrap',
  },
  postRow: {
    background: '#FDFAF5', border: '1px solid #D8CAB5', borderRadius: 14,
    padding: '18px 24px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: 16, flexWrap: 'wrap',
  },
  claimLeft: { display: 'flex', flexDirection: 'column', gap: 6 },
  statusPill: { display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
  claimTitle: { fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#3D2B1F', textDecoration: 'none', fontWeight: 600 },
  claimMeta: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8C7060' },
  notes: { fontSize: 12, color: '#8C7060', fontStyle: 'italic' },
  claimActions: { display: 'flex', gap: 8, flexShrink: 0 },
}
