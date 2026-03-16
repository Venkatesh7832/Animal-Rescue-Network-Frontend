import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiUser } from 'react-icons/fi'

const STATUS_MAP = {
  OPEN:        { label: 'Open',        cls: 'badge-open' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge-progress' },
  RESCUED:     { label: 'Rescued',     cls: 'badge-rescued' },
  CLOSED:      { label: 'Closed',      cls: 'badge-closed' },
}

const ANIMAL_EMOJI = {
  dog: '🐕', cat: '🐈', bird: '🐦', rabbit: '🐇',
  cow: '🐄', horse: '🐎', goat: '🐐', sheep: '🐑',
  default: '🐾',
}

function getAnimalEmoji(type = '') {
  const key = type.toLowerCase()
  return ANIMAL_EMOJI[key] || ANIMAL_EMOJI.default
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days  = Math.floor(hours / 24)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins > 0)  return `${mins}m ago`
  return 'just now'
}

export default function RescueCard({ post }) {
  const status  = STATUS_MAP[post.status] || STATUS_MAP.OPEN
  const emoji   = getAnimalEmoji(post.animalType)
  const imgSrc  = post.imageUrl || null

  return (
    <Link to={`/rescues/${post.id}`} style={{ textDecoration: 'none' }}>
      <div className="card fade-up" style={styles.card}>
        {/* Image / Placeholder */}
        <div style={styles.imgWrap}>
          {imgSrc ? (
            <img src={imgSrc} alt={post.title} style={styles.img} />
          ) : (
            <div style={styles.placeholder}>
              <span style={{ fontSize: 56 }}>{emoji}</span>
            </div>
          )}
          <span className={`badge ${status.cls}`} style={styles.statusBadge}>
            {status.label}
          </span>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <div style={styles.animalTag}>
            {emoji} {post.animalType}
          </div>
          <h3 style={styles.title}>{post.title}</h3>
          <p style={styles.desc}>
            {post.description?.length > 100
              ? post.description.slice(0, 100) + '…'
              : post.description}
          </p>

          <div style={styles.meta}>
            <span style={styles.metaItem}><FiMapPin size={12} /> {post.location}</span>
            <span style={styles.metaItem}><FiClock size={12} /> {timeAgo(post.createdAt)}</span>
            {post.postedByUsername && (
              <span style={styles.metaItem}><FiUser size={12} /> {post.postedByUsername}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  card: {
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column', height: '100%',
  },
  imgWrap: { position: 'relative', height: 200, flexShrink: 0 },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: {
    width: '100%', height: '100%',
    background: 'linear-gradient(135deg, #EDE6D6 0%, #C8DCBF 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute', top: 12, right: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  body: { padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  animalTag: {
    fontSize: 12, fontWeight: 600, color: '#4A6741',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 17, fontWeight: 600, color: '#3D2B1F',
    lineHeight: 1.3,
  },
  desc: { fontSize: 13, color: '#8C7060', lineHeight: 1.6, flex: 1 },
  meta: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  metaItem: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: 12, color: '#8C7060',
  },
}
