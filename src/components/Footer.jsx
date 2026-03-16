import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <span style={{ fontSize: 22 }}>🐾</span>
          <span style={styles.name}>RescuePaws</span>
          <p style={styles.tagline}>Every animal deserves a second chance.</p>
        </div>

        <div style={styles.links}>
          <h4 style={styles.colTitle}>Platform</h4>
          <Link to="/"         style={styles.link}>Home</Link>
          <Link to="/rescues"  style={styles.link}>Browse Rescues</Link>
          <Link to="/post-rescue" style={styles.link}>Post a Rescue</Link>
          <Link to="/donate"   style={styles.link}>Donate</Link>
        </div>

        <div style={styles.links}>
          <h4 style={styles.colTitle}>Volunteer</h4>
          <Link to="/volunteer-dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/register" style={styles.link}>Join as Volunteer</Link>
        </div>

        <div style={styles.links}>
          <h4 style={styles.colTitle}>Account</h4>
          <Link to="/login"    style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
        </div>
      </div>

      <div style={styles.bottom}>
        <span>© {new Date().getFullYear()} RescuePaws. All rights reserved.</span>
        <span style={styles.madeWith}>
          Made with <FiHeart size={12} style={{ color: '#B84A2A', margin: '0 4px' }} /> for animals
        </span>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: '#3D2B1F',
    color: '#C8AD8A',
    marginTop: 80,
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '56px 24px 40px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: 48,
  },
  brand: { display: 'flex', flexDirection: 'column', gap: 8 },
  name: {
    fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700,
    color: '#F5F0E8', marginTop: 4,
  },
  tagline: { fontSize: 13, color: '#8C7060', lineHeight: 1.6, maxWidth: 200 },
  colTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 14,
    color: '#F5F0E8', marginBottom: 16, fontWeight: 600,
  },
  links: { display: 'flex', flexDirection: 'column', gap: 10 },
  link: {
    fontSize: 13, color: '#C8AD8A', textDecoration: 'none',
    transition: 'color 0.2s',
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '20px 24px',
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: 12, color: '#6B4A35',
  },
  madeWith: { display: 'flex', alignItems: 'center' },
}
