import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const { login, isLoggedIn } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const [form, setForm]       = useState({ username: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isLoggedIn) { navigate('/'); return null }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.username, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <span style={{ fontSize: 40 }}>🐾</span>
          <h1 style={styles.brandName}>RescuePaws</h1>
          <p style={styles.brandSub}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label>Username</label>
            <input
              value={form.username}
              onChange={set('username')}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={styles.pwdWrap}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: 'inherit', padding: '11px 14px' }}
              />
              <button type="button" onClick={() => setShowPwd(v => !v)} style={styles.eyeBtn}>
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            <FiLogIn />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>

      {/* Decorative side */}
      <div style={styles.art}>
        <div style={styles.artInner}>
          <span style={{ fontSize: 80, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}>🐕</span>
          <h2 style={styles.artTitle}>Every rescue<br />starts here.</h2>
          <p style={styles.artSub}>Join thousands of volunteers making a difference for animals every day.</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
  },
  card: {
    flex: '0 0 460px',
    padding: '64px 48px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    background: '#FDFAF5',
  },
  brand: { textAlign: 'center', marginBottom: 40 },
  brandName: {
    fontFamily: "'Playfair Display', serif", fontSize: 28,
    color: '#3D2B1F', marginTop: 10,
  },
  brandSub: { color: '#8C7060', fontSize: 14, marginTop: 6 },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  pwdWrap: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #D8CAB5', borderRadius: 6,
    background: '#FDFAF5', transition: 'all 0.2s',
  },
  eyeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '0 14px', color: '#8C7060', display: 'flex',
  },
  footer: { textAlign: 'center', marginTop: 28, fontSize: 14, color: '#8C7060' },
  link: { color: '#4A6741', fontWeight: 600 },
  art: {
    flex: 1,
    background: 'linear-gradient(135deg, #3D2B1F 0%, #6B4A35 50%, #4A6741 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 48,
  },
  artInner: { textAlign: 'center', maxWidth: 320 },
  artTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.4rem', color: '#F5F0E8',
    lineHeight: 1.2, marginTop: 24, marginBottom: 16,
  },
  artSub: { fontSize: 15, color: '#C8AD8A', lineHeight: 1.7 },
}
