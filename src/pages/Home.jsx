import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { rescueService } from '../services/rescueService'
import RescueCard from '../components/RescueCard'
import { FiArrowRight, FiHeart, FiUsers, FiMapPin } from 'react-icons/fi'

export default function Home() {
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    rescueService.getAll(0, 6)
      .then(data => setPosts(data.content || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroGrain} />
        <div style={styles.heroContent}>
          <span style={styles.heroEyebrow}>🐾 Animal Rescue Network</span>
          <h1 style={styles.heroTitle}>
            Give every animal<br />
            <em style={styles.heroItalic}>a fighting chance</em>
          </h1>
          <p style={styles.heroSub}>
            Report injured or abandoned animals, connect with volunteers,
            and support rescues in your community.
          </p>
          <div style={styles.heroCtas}>
            <Link to="/post-rescue" className="btn btn-primary btn-lg" style={{ background: '#4A6741' }}>
              Post a Rescue <FiArrowRight />
            </Link>
            <Link to="/rescues" className="btn btn-secondary btn-lg">
              Browse Rescues
            </Link>
          </div>
        </div>
        <div style={styles.heroArt}>
          <div style={styles.artCircle1} />
          <div style={styles.artCircle2} />
          <span style={styles.artEmoji}>🐕</span>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.stats}>
        {STATS.map(s => (
          <div key={s.label} style={styles.statItem}>
            <span style={styles.statIcon}>{s.icon}</span>
            <strong style={styles.statNum}>{s.num}</strong>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Recent Rescues */}
      <section className="container" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div style={styles.sectionHead}>
          <div>
            <h2 style={styles.sectionTitle}>Recent Rescues</h2>
            <p style={styles.sectionSub}>Animals needing help right now</p>
          </div>
          <Link to="/rescues" style={styles.viewAll}>
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" /> Loading rescues…
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 48 }}>🌿</span>
            <h3>No rescues yet</h3>
            <p>Be the first to report an animal in need.</p>
          </div>
        ) : (
          <div className="rescue-grid">
            {posts.map(p => <RescueCard key={p.id} post={p} />)}
          </div>
        )}
      </section>

      {/* How it works */}
      <section style={styles.howSection}>
        <div className="container">
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: 48 }}>How It Works</h2>
          <div style={styles.howGrid}>
            {HOW.map((h, i) => (
              <div key={i} style={styles.howCard}>
                <div style={styles.howStep}>{i + 1}</div>
                <span style={{ fontSize: 36 }}>{h.emoji}</span>
                <h3 style={styles.howTitle}>{h.title}</h3>
                <p style={styles.howDesc}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container" style={{ paddingBottom: 80 }}>
        <div style={styles.ctaBanner}>
          <div>
            <h2 style={{ ...styles.sectionTitle, color: '#FDFAF5', marginBottom: 8 }}>
              Can't rescue? You can still help.
            </h2>
            <p style={{ color: '#C8AD8A', fontSize: 15 }}>
              Your donation funds emergency vet care, food, and transport.
            </p>
          </div>
          <Link to="/donate" className="btn btn-amber btn-lg">
            <FiHeart /> Donate Now
          </Link>
        </div>
      </section>
    </div>
  )
}

const STATS = [
  { icon: <FiMapPin color="#4A6741" size={20} />, num: '1,240+', label: 'Rescues Posted' },
  { icon: <FiUsers color="#D4821A" size={20} />, num: '380+',   label: 'Active Volunteers' },
  { icon: <FiHeart color="#B84A2A" size={20} />, num: '920+',   label: 'Animals Saved' },
]

const HOW = [
  { emoji: '📸', title: 'Report',    desc: 'Spot an animal in distress? Post a rescue with location & photos.' },
  { emoji: '🙋', title: 'Volunteer', desc: 'Nearby volunteers claim the rescue and head to help.' },
  { emoji: '💰', title: 'Support',   desc: 'Donate to cover vet bills, transport, and ongoing care.' },
  { emoji: '🐾', title: 'Celebrate', desc: 'Mark the rescue complete and celebrate with the community.' },
]

const styles = {
  hero: {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, #3D2B1F 0%, #6B4A35 60%, #4A6741 100%)',
    padding: '80px 24px 100px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 64, flexWrap: 'wrap',
  },
  heroGrain: {
    position: 'absolute', inset: 0, opacity: 0.04,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
    backgroundSize: '200px 200px',
  },
  heroContent: { position: 'relative', maxWidth: 520 },
  heroEyebrow: {
    display: 'inline-block', background: 'rgba(255,255,255,0.12)',
    color: '#C8DCBF', fontSize: 13, fontWeight: 600,
    padding: '6px 16px', borderRadius: 20, marginBottom: 20,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: '#F5F0E8',
    lineHeight: 1.15, marginBottom: 20,
  },
  heroItalic: { color: '#F0A83C', fontStyle: 'italic' },
  heroSub: { fontSize: 16, color: '#C8AD8A', lineHeight: 1.7, marginBottom: 32, maxWidth: 420 },
  heroCtas: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  heroArt: {
    position: 'relative', width: 240, height: 240, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  artCircle1: {
    position: 'absolute', width: 220, height: 220,
    borderRadius: '50%', background: 'rgba(200,220,191,0.15)',
    border: '1px solid rgba(200,220,191,0.3)',
  },
  artCircle2: {
    position: 'absolute', width: 160, height: 160,
    borderRadius: '50%', background: 'rgba(200,220,191,0.1)',
  },
  artEmoji: { fontSize: 96, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))' },
  stats: {
    background: '#FDFAF5', borderBottom: '1px solid #D8CAB5',
    display: 'flex', justifyContent: 'center', gap: 0,
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '28px 48px', borderRight: '1px solid #EDE6D6',
  },
  statIcon: { marginBottom: 4 },
  statNum: {
    fontFamily: "'Playfair Display', serif", fontSize: 28,
    color: '#3D2B1F', fontWeight: 700,
  },
  statLabel: { fontSize: 12, color: '#8C7060', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#3D2B1F' },
  sectionSub: { fontSize: 14, color: '#8C7060', marginTop: 6 },
  viewAll: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, fontWeight: 600, color: '#4A6741',
  },
  howSection: { background: '#EDE6D6', padding: '80px 0' },
  howGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 24,
  },
  howCard: {
    background: '#FDFAF5', borderRadius: 16, padding: '32px 24px',
    display: 'flex', flexDirection: 'column', gap: 12,
    border: '1px solid #D8CAB5', position: 'relative',
  },
  howStep: {
    position: 'absolute', top: 16, right: 16,
    width: 28, height: 28, borderRadius: '50%',
    background: '#4A6741', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
  },
  howTitle: { fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#3D2B1F' },
  howDesc: { fontSize: 13, color: '#8C7060', lineHeight: 1.6 },
  ctaBanner: {
    background: 'linear-gradient(135deg, #3D2B1F 0%, #4A6741 100%)',
    borderRadius: 20, padding: '48px 40px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    gap: 24, flexWrap: 'wrap',
  },
}
