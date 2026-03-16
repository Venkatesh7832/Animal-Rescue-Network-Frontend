import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { donationService } from '../services/donationService'
import { rescueService } from '../services/rescueService'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { FiHeart, FiCheckCircle, FiDollarSign } from 'react-icons/fi'

const PRESETS = [100, 250, 500, 1000, 2500]

export default function DonationPage() {
  const { isLoggedIn } = useAuth()
  const [searchParams]  = useSearchParams()
  const rescueId        = searchParams.get('rescueId')

  const [amount,    setAmount]    = useState('')
  const [custom,    setCustom]    = useState('')
  const [message,   setMessage]   = useState('')
  const [anon,      setAnon]      = useState(false)
  const [post,      setPost]      = useState(null)
  const [myDonations, setMyDonations] = useState([])
  const [myTotal,   setMyTotal]   = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [done,      setDone]      = useState(false)

  useEffect(() => {
    if (rescueId) {
      rescueService.getById(rescueId).then(setPost).catch(() => {})
    }
    if (isLoggedIn) {
      donationService.getMyDonations().then(setMyDonations).catch(() => {})
      donationService.getMyTotal().then(d => setMyTotal(d.totalDonated || 0)).catch(() => {})
    }
  }, [rescueId, isLoggedIn])

  const selectedAmount = custom ? parseFloat(custom) : amount

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedAmount || selectedAmount < 1) {
      toast.error('Please enter a valid donation amount.')
      return
    }
    setSubmitting(true)
    try {
      await donationService.donate({
        amount: selectedAmount,
        message,
        anonymous: anon,
        rescuePostId: rescueId ? parseInt(rescueId) : null,
      })
      toast.success('Thank you for your donation! 🐾')
      setDone(true)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Donation failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="container" style={{ maxWidth: 500, paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
        <div style={styles.successIcon}>
          <FiCheckCircle size={52} color="#2D6A4F" />
        </div>
        <h1 style={styles.successTitle}>Donation Received!</h1>
        <p style={styles.successSub}>
          Your generous contribution of <strong>₹{Number(selectedAmount).toLocaleString('en-IN')}</strong> will
          directly support animal rescue efforts. Thank you! 🐾
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <Link to="/"        className="btn btn-secondary">Go Home</Link>
          <Link to="/rescues" className="btn btn-primary">Browse Rescues</Link>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 48 }}>🔒</span>
        <h2 style={{ fontFamily: 'var(--font-display)', marginTop: 16, color: 'var(--bark)' }}>Login to Donate</h2>
        <p style={{ color: 'var(--text-light)', margin: '12px 0 24px' }}>
          Please log in to make a donation.
        </p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 960 }}>
      <div style={styles.pageHead}>
        <h1 style={styles.title}>Make a Donation</h1>
        <p style={styles.sub}>100% of donations go towards animal rescue, vet care, and rehabilitation.</p>
      </div>

      <div style={styles.grid}>
        {/* Form */}
        <div style={styles.formCard}>
          {post && (
            <div style={styles.linkedPost}>
              <span style={{ fontSize: 20 }}>🐾</span>
              <div>
                <p style={{ fontSize: 11, color: '#4A6741', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Donating to</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#3D2B1F' }}>{post.title}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Amount presets */}
            <div className="form-group">
              <label>Select Amount (₹)</label>
              <div style={styles.presets}>
                {PRESETS.map(p => (
                  <button
                    key={p} type="button"
                    style={{ ...styles.preset, ...(amount === p && !custom ? styles.presetActive : {}) }}
                    onClick={() => { setAmount(p); setCustom('') }}
                  >
                    ₹{p}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Or enter custom amount</label>
              <div style={styles.inputPrefix}>
                <span style={styles.prefix}>₹</span>
                <input
                  type="number" min="1" step="1"
                  value={custom}
                  onChange={e => { setCustom(e.target.value); setAmount('') }}
                  placeholder="Enter amount"
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, fontFamily: 'inherit', padding: '11px 12px 11px 0' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Message (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Leave an encouraging message…"
                rows={3}
              />
            </div>

            <label style={styles.checkLabel}>
              <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} />
              <span>Donate anonymously</span>
            </label>

            <div style={styles.totalRow}>
              <span style={{ color: '#8C7060' }}>Total</span>
              <strong style={styles.totalAmt}>
                ₹{selectedAmount ? Number(selectedAmount).toLocaleString('en-IN') : '0'}
              </strong>
            </div>

            <button type="submit" className="btn btn-amber btn-lg" disabled={submitting}>
              <FiHeart /> {submitting ? 'Processing…' : 'Donate Now'}
            </button>
          </form>
        </div>

        {/* My donation history */}
        <div>
          <div style={styles.historyCard}>
            <h3 style={styles.historyTitle}>My Donations</h3>
            <div style={styles.totalBadge}>
              <FiDollarSign size={16} />
              <span>Total: </span>
              <strong style={{ color: '#D4821A' }}>₹{Number(myTotal).toLocaleString('en-IN')}</strong>
            </div>

            {myDonations.length === 0 ? (
              <p style={{ fontSize: 13, color: '#8C7060', marginTop: 8 }}>No donations yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {myDonations.slice(0, 8).map(d => (
                  <div key={d.id} style={styles.donationRow}>
                    <div>
                      <strong style={{ fontSize: 15, color: '#3D2B1F' }}>₹{Number(d.amount).toLocaleString('en-IN')}</strong>
                      {d.message && <p style={{ fontSize: 12, color: '#8C7060', marginTop: 2 }}>{d.message}</p>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={styles.donationStatus(d.paymentStatus)}>{d.paymentStatus}</span>
                      <p style={{ fontSize: 11, color: '#8C7060', marginTop: 3 }}>
                        {d.donatedAt ? new Date(d.donatedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Impact card */}
          <div style={styles.impactCard}>
            <h3 style={styles.historyTitle}>Your Impact</h3>
            <div style={styles.impactItems}>
              {[
                { emoji: '🩺', label: 'Vet consultations',  val: Math.floor(myTotal / 300)  },
                { emoji: '🍖', label: 'Meals provided',     val: Math.floor(myTotal / 30)   },
                { emoji: '🏠', label: 'Days of shelter',    val: Math.floor(myTotal / 100)  },
              ].map(i => (
                <div key={i.label} style={styles.impactItem}>
                  <span style={{ fontSize: 22 }}>{i.emoji}</span>
                  <div>
                    <strong style={{ color: '#3D2B1F' }}>{i.val}</strong>
                    <p style={{ fontSize: 11, color: '#8C7060' }}>{i.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  pageHead: { marginBottom: 36 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#3D2B1F' },
  sub:   { color: '#8C7060', marginTop: 8, fontSize: 15 },
  grid:  { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' },
  formCard: {
    background: '#FDFAF5', borderRadius: 20, border: '1px solid #D8CAB5',
    padding: '32px',
  },
  linkedPost: {
    display: 'flex', gap: 12, alignItems: 'center',
    background: '#C8DCBF33', border: '1.5px solid #C8DCBF',
    borderRadius: 12, padding: '14px 16px', marginBottom: 8,
  },
  presets: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  preset: {
    padding: '9px 18px', borderRadius: 8, border: '1.5px solid #D8CAB5',
    background: '#F5F0E8', cursor: 'pointer', fontSize: 14, fontWeight: 600,
    color: '#5C4535', transition: 'all 0.2s', fontFamily: 'inherit',
  },
  presetActive: {
    background: '#4A6741', color: '#FDFAF5', borderColor: '#4A6741',
  },
  inputPrefix: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #D8CAB5', borderRadius: 8, background: '#FDFAF5',
    transition: 'all 0.2s',
  },
  prefix: {
    padding: '0 12px', fontSize: 15, color: '#8C7060', fontWeight: 600,
    borderRight: '1.5px solid #D8CAB5',
  },
  checkLabel: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 14, color: '#5C4535', cursor: 'pointer',
  },
  totalRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 16px', background: '#F5F0E8', borderRadius: 10,
    border: '1px solid #EDE6D6',
  },
  totalAmt: { fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#D4821A' },
  successIcon: {
    width: 96, height: 96, borderRadius: '50%',
    background: '#D4EDDA', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 24px',
  },
  successTitle: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#3D2B1F', marginBottom: 12 },
  successSub: { fontSize: 15, color: '#5C4535', lineHeight: 1.7 },
  historyCard: {
    background: '#FDFAF5', borderRadius: 16, border: '1px solid #D8CAB5',
    padding: '22px', marginBottom: 16,
  },
  historyTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 15,
    color: '#3D2B1F', marginBottom: 12,
  },
  totalBadge: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 14, color: '#5C4535', background: '#FFF3CD',
    padding: '6px 12px', borderRadius: 8, width: 'fit-content',
  },
  donationRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '10px 0', borderBottom: '1px solid #EDE6D6',
  },
  donationStatus: (s) => ({
    fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
    background: s === 'SUCCESS' ? '#D4EDDA' : '#FFF3CD',
    color:      s === 'SUCCESS' ? '#2D6A4F' : '#856404',
  }),
  impactCard: {
    background: 'linear-gradient(135deg, #3D2B1F, #4A6741)',
    borderRadius: 16, padding: '22px',
  },
  impactItems: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 },
  impactItem: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '10px 14px', background: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
  },
}
