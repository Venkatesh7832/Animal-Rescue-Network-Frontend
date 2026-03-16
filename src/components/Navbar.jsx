import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiPlusCircle } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  const navLinks = [
    { to: '/',                  label: 'Home' },
    { to: '/rescues',           label: 'Rescues' },
    { to: '/volunteer-dashboard', label: 'Volunteer' },
    { to: '/donate',            label: 'Donate', icon: <FiHeart size={14} /> },
  ]

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo} onClick={() => setOpen(false)}>
          <span style={styles.logoIcon}>🐾</span>
          <span style={styles.logoText}>RescuePaws</span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          {navLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}
            >
              {icon && <span>{icon}</span>}
              {label}
            </NavLink>
          ))}
        </div>

        {/* Desktop auth */}
        <div style={styles.auth}>
          {isLoggedIn ? (
            <>
              <Link to="/post-rescue" style={styles.btnPost}>
                <FiPlusCircle size={15} /> Post Rescue
              </Link>
              <div style={styles.userInfo}>
                <FiUser size={14} />
                <span>{user.username}</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                <FiLogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button style={styles.hamburger} onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={styles.mobileMenu}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.mobileLinkActive : {}) })}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div style={styles.mobileDivider} />
          {isLoggedIn ? (
            <>
              <Link to="/post-rescue" style={styles.mobileLink} onClick={() => setOpen(false)}>
                + Post Rescue
              </Link>
              <button onClick={handleLogout} style={{ ...styles.mobileLink, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: '#B84A2A' }}>
                Logout ({user.username})
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    style={styles.mobileLink} onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(245,240,232,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #D8CAB5',
    boxShadow: '0 2px 12px rgba(61,43,31,0.06)',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 24px',
    height: 64, display: 'flex', alignItems: 'center', gap: 32,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 },
  logoIcon: { fontSize: 24 },
  logoText: {
    fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
    color: '#3D2B1F', letterSpacing: '-0.02em',
  },
  links: { display: 'flex', gap: 4, alignItems: 'center', flex: 1 },
  link: {
    padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
    color: '#5C4535', textDecoration: 'none', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', gap: 5,
  },
  linkActive: { background: '#C8DCBF', color: '#2D6A4F', fontWeight: 600 },
  auth: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  btnPost: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 16px', background: '#4A6741', color: '#FDFAF5',
    borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
    transition: 'all 0.2s',
  },
  userInfo: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, color: '#5C4535', fontWeight: 500,
    padding: '4px 10px', background: '#EDE6D6', borderRadius: 20,
  },
  logoutBtn: {
    background: 'none', border: '1.5px solid #D8CAB5', borderRadius: 8,
    padding: '6px 10px', cursor: 'pointer', color: '#8C7060',
    display: 'flex', alignItems: 'center', transition: 'all 0.2s',
  },
  loginBtn: {
    padding: '7px 16px', fontSize: 14, fontWeight: 500,
    color: '#4A6741', textDecoration: 'none',
    border: '1.5px solid #4A6741', borderRadius: 8, transition: 'all 0.2s',
  },
  registerBtn: {
    padding: '7px 16px', fontSize: 14, fontWeight: 600,
    background: '#4A6741', color: '#FDFAF5', textDecoration: 'none',
    borderRadius: 8, transition: 'all 0.2s',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none', cursor: 'pointer',
    color: '#3D2B1F', padding: 4,
    '@media (max-width: 768px)': { display: 'flex' },
  },
  mobileMenu: {
    display: 'flex', flexDirection: 'column',
    background: '#F5F0E8', borderTop: '1px solid #D8CAB5',
    padding: '12px 24px 20px',
  },
  mobileLink: {
    padding: '12px 0', fontSize: 15, fontWeight: 500,
    color: '#3D2B1F', textDecoration: 'none', display: 'block',
    borderBottom: '1px solid #EDE6D6',
  },
  mobileLinkActive: { color: '#4A6741', fontWeight: 700 },
  mobileDivider: { height: 1, background: '#D8CAB5', margin: '8px 0' },
}
