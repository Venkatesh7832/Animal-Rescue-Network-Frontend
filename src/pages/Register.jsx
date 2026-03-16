import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Register() {
  const { register, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    fullName: '', phoneNumber: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isLoggedIn) { navigate('/'); return null }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
      })
      toast.success('Account created! Welcome to RescuePaws 🐾')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Decorative side */}
      <div style={styles.art}>
        <div style={styles.artInner}>
          <span style={{ fontSize: 72, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}>🐈</span>
          <h2 style={styles.artTitle}>Join the<br />rescue network.</h2>
          <p style={styles.artSub}>Report strays, volunteer for rescues, and change lives — one animal at a time.</p>
          <div style={styles.artStats}>
            {['380+ Volunteers', '920+ Rescues', '1,240+ Posts'].map(s => (
              <span key={s} style={styles.artStat}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={{ fontSize: 36 }}>🐾</span>
          <h1 style={styles.brandName}>Create Account</h1>
          <p style={styles.brandSub}>Start helping animals today</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Full Name</label>
              <input value={form.fullName} onChange={set('fullName')} placeholder="Jane Doe" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Phone</label>
              <input value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="+91 98765 43210" />
            </div>
          </div>

          <div className="form-group">
            <label>Username *</label>
            <input value={form.username} onChange={set('username')} placeholder="Choose a username" required />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
          </div>

          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Password *</label>
              <div style={styles.pwdWrap}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  required
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: 'inherit', padding: '11px 14px' }}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={styles.eyeBtn}>
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Confirm Password *</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          {/* Password strength */}
          {form.password && (
            <div style={styles.strength}>
              {[4, 8, 12].map((len, i) => (
                <div key={i} style={{
                  ...styles.strengthBar,
                  background: form.password.length >= len ? ['#B84A2A','#D4821A','#4A6741'][i] : '#EDE6D6'
                }} />
              ))}
              <span style={{ fontSize: 11, color: '#8C7060' }}>
                {form.password.length < 4 ? 'Weak' : form.password.length < 8 ? 'Fair' : 'Strong'}
              </span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
          >
            <FiUserPlus />
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', display: 'flex' },
  art: {
    flex: 1,
    background: 'linear-gradient(135deg, #4A6741 0%, #3D2B1F 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 48,
  },
  artInner: { textAlign: 'center', maxWidth: 340 },
  artTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.2rem', color: '#F5F0E8',
    lineHeight: 1.2, marginTop: 24, marginBottom: 16,
  },
  artSub:   { fontSize: 14, color: '#C8AD8A', lineHeight: 1.7, marginBottom: 24 },
  artStats: { display: 'flex', flexDirection: 'column', gap: 8 },
  artStat:  {
    background: 'rgba(255,255,255,0.1)', color: '#C8DCBF',
    padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600,
  },
  card: {
    flex: '0 0 520px',
    padding: '48px 44px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    background: '#FDFAF5', overflowY: 'auto',
  },
  brand: { textAlign: 'center', marginBottom: 32 },
  brandName: { fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#3D2B1F', marginTop: 10 },
  brandSub:  { color: '#8C7060', fontSize: 13, marginTop: 6 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  row: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  pwdWrap: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #D8CAB5', borderRadius: 6,
    background: '#FDFAF5',
  },
  eyeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0 14px', color: '#8C7060', display: 'flex' },
  strength: { display: 'flex', alignItems: 'center', gap: 6 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2, transition: 'background 0.3s' },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#8C7060' },
  link:   { color: '#4A6741', fontWeight: 600 },
}
