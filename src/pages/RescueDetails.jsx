import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { rescueService } from '../services/rescueService'
import { donationService } from '../services/donationService'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { FiMapPin, FiPhone, FiUser, FiClock, FiArrowLeft, FiHeart } from 'react-icons/fi'

const STATUS_MAP = {
  OPEN:        { label: 'Open',        bg: '#D4EDDA', color: '#2D6A4F' },
  IN_PROGRESS: { label: 'In Progress', bg: '#FFF3CD', color: '#856404' },
  RESCUED:     { label: 'Rescued',     bg: '#CCE5FF', color: '#1A4F8A' },
  CLOSED:      { label: 'Closed',      bg: '#EDE6D6', color: '#8C7060' },
}

export default function RescueDetails() {
  const { id } = useParams()
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [post,    setPost]    = useState(null)
  const [claims,  setClaims]  = useState([])
  const [total,   setTotal]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [notes,   setNotes]   = useState('')

  useEffect(() => {
    Promise.all([
      rescueService.getById(id),
      donationService.getTotalForPost(id).catch(() => ({ totalDonated: 0 })),
    ]).then(([p, t]) => {
      setPost(p)
      setTotal(t.totalDonated)
    }).catch(() => navigate('/rescues'))
      .finally(() => setLoading(false))

    if (isLoggedIn) {
      rescueService.getClaimsForPost(id).then(setClaims).catch(() => {})
    }
  }, [id])

  const handleClaim = async () => {
    setClaiming(true)
    try {
      await rescueService.claimRescue(id, notes)
      toast.success('Rescue claimed! Please head to the location.')
      setPost(p => ({ ...p, status: 'IN_PROGRESS' }))
      const updated = await rescueService.getClaimsForPost(id)
      setClaims(updated)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not claim rescue.')
    } finally {
      setClaiming(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this rescue post?')) return
    try {
      await rescueService.delete(id)
      toast.success('Post deleted.')
      navigate('/')
    } catch {
      toast.error('Could not delete post.')
    }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner" /> Loading…</div>
  if (!post)   return null

  const status  = STATUS_MAP[post.status] || STATUS_MAP.OPEN
  const isOwner = user?.id === post.postedById || user?.role === 'ADMIN'
  const alreadyClaimed = claims.some(c => c.volunteer?.username === user?.username)

  return (
    <div className="container" style={{ maxWidth: 820, paddingTop: 40, paddingBottom: 80 }}>
      <Link to="/rescues" style={styles.back}><FiArrowLeft size={14} /> Back to Rescues</Link>

      <div style={styles.grid}>
        {/* Main */}
        <div>
          {/* Image */}
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} style={styles.mainImg} />
          ) : (
            <div style={styles.placeholder}>
              <span style={{ fontSize: 80 }}>🐾</span>
            </div>
          )}

          <div style={styles.content}>
            <div style={styles.topRow}>
              <span style={{ ...styles.statusPill, background: status.bg, color: status.color }}>
                {status.label}
              </span>
              <span style={styles.animalTag}>{post.animalType}</span>
            </div>

            <h1 style={styles.title}>{post.title}</h1>

            {post.animalCondition && (
              <p style={styles.condition}>Condition: <strong>{post.animalCondition}</strong></p>
            )}

            <p style={styles.desc}>{post.description}</p>

            <div style={styles.metaGrid}>
              {post.location && (
                <div style={styles.metaItem}>
                  <FiMapPin size={15} color="#4A6741" />
                  <span>{post.location}</span>
                </div>
              )}
              {post.contactNumber && (
                <div style={styles.metaItem}>
                  <FiPhone size={15} color="#4A6741" />
                  <span>{post.contactNumber}</span>
                </div>
              )}
              {post.postedByUsername && (
                <div style={styles.metaItem}>
                  <FiUser size={15} color="#4A6741" />
                  <span>Posted by {post.postedByUsername}</span>
                </div>
              )}
              {post.createdAt && (
                <div style={styles.metaItem}>
                  <FiClock size={15} color="#4A6741" />
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            {isOwner && (
              <div style={styles.ownerActions}>
                <Link to={`/rescues/${id}/edit`} className="btn btn-secondary">Edit</Link>
                <button onClick={handleDelete} className="btn btn-danger">Delete</button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Donation total */}
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}><FiHeart size={15} /> Donations Raised</h3>
            <p style={styles.donationTotal}>₹{Number(total || 0).toLocaleString('en-IN')}</p>
            <Link to={`/donate?rescueId=${id}`} className="btn btn-amber" style={{ width: '100%', justifyContent: 'center' }}>
              Donate to this Rescue
            </Link>
          </div>

          {/* Claim */}
          {isLoggedIn && post.status === 'OPEN' && !alreadyClaimed && (
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>Volunteer to Rescue</h3>
              <textarea
                placeholder="Add notes (optional)…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={styles.notesBox}
              />
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleClaim}
                disabled={claiming}
              >
                {claiming ? 'Claiming…' : '🙋 Claim this Rescue'}
              </button>
            </div>
          )}

          {alreadyClaimed && (
            <div style={{ ...styles.sideCard, background: '#D4EDDA', border: '1.5px solid #2D6A4F22' }}>
              <p style={{ color: '#2D6A4F', fontWeight: 600, fontSize: 14 }}>
                ✅ You have claimed this rescue.
              </p>
            </div>
          )}

          {/* Claims list */}
          {claims.length > 0 && (
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>Volunteers ({claims.length})</h3>
              {claims.map(c => (
                <div key={c.id} style={styles.claimRow}>
                  <FiUser size={13} />
                  <span>{c.volunteer?.username}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8C7060' }}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#5C4535', marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' },
  mainImg: { width: '100%', height: 320, objectFit: 'cover', borderRadius: 16 },
  placeholder: {
    width: '100%', height: 280,
    background: 'linear-gradient(135deg, #EDE6D6, #C8DCBF)',
    borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  content: { marginTop: 24 },
  topRow: { display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' },
  statusPill: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  animalTag: { fontSize: 12, fontWeight: 600, color: '#4A6741', textTransform: 'uppercase', letterSpacing: '0.06em' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.9rem', color: '#3D2B1F', marginBottom: 8 },
  condition: { fontSize: 13, color: '#8C7060', marginBottom: 12 },
  desc: { fontSize: 15, color: '#5C4535', lineHeight: 1.75, marginBottom: 24 },
  metaGrid: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 },
  metaItem: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#5C4535' },
  ownerActions: { display: 'flex', gap: 10 },
  sidebar: { display: 'flex', flexDirection: 'column', gap: 16 },
  sideCard: {
    background: '#FDFAF5', borderRadius: 16, border: '1px solid #D8CAB5',
    padding: '22px', display: 'flex', flexDirection: 'column', gap: 12,
  },
  sideTitle: { fontFamily: "'Playfair Display', serif", fontSize: 15, color: '#3D2B1F', display: 'flex', alignItems: 'center', gap: 7 },
  donationTotal: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#D4821A' },
  notesBox: {
    width: '100%', padding: '9px 12px', border: '1.5px solid #D8CAB5',
    borderRadius: 8, resize: 'vertical', minHeight: 80,
    fontFamily: 'inherit', fontSize: 13, background: '#F5F0E8', outline: 'none',
  },
  claimRow: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
    borderBottom: '1px solid #EDE6D6', fontSize: 13, color: '#5C4535',
  },
}
