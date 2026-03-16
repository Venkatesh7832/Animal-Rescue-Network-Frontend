import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { rescueService } from '../services/rescueService'
import UploadImage from '../components/UploadImage'
import MapLocation from '../components/MapLocation'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { FiSend } from 'react-icons/fi'

const ANIMAL_TYPES = ['Dog','Cat','Bird','Rabbit','Cow','Horse','Goat','Sheep','Other']
const CONDITIONS    = ['Critical','Injured','Malnourished','Abandoned','Stray','Other']

export default function PostRescue() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', location: '',
    animalType: '', animalCondition: '',
    imageUrl: '', contactNumber: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 48 }}>🔒</span>
        <h2 style={{ fontFamily: 'var(--font-display)', marginTop: 16, color: 'var(--bark)' }}>
          Login Required
        </h2>
        <p style={{ color: 'var(--text-light)', margin: '12px 0 24px' }}>
          You need to be logged in to post a rescue.
        </p>
        <a href="/login" className="btn btn-primary">Login</a>
      </div>
    )
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleImageChange = (file, dataUrl) => {
    setImageFile(file)
    setForm(f => ({ ...f, imageUrl: dataUrl || '' }))
  }

  const handleMapChange = ({ lat, lng, address }) => {
    setForm(f => ({ ...f, location: address }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.location || !form.animalType) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    try {
      let imageUrl = ''
      if (imageFile) {
        try {
          const uploaded = await rescueService.uploadImage(imageFile)
          imageUrl = uploaded.url || uploaded.imageUrl || ''
        } catch {
          // upload failed, continue without image
        }
      }
      const payload = { ...form, imageUrl: imageUrl || '' }
      const created = await rescueService.create(payload)
      toast.success('Rescue posted successfully!')
      navigate(`/rescues/${created.id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post rescue.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 760, paddingTop: 48, paddingBottom: 80 }}>
      <div style={styles.header}>
        <h1 style={styles.title}>Post a Rescue</h1>
        <p style={styles.sub}>Report an animal in need so volunteers can help.</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Photo */}
        <div className="form-group">
          <label>Photo (optional)</label>
          <UploadImage value={form.imageUrl} onChange={handleImageChange} />
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Title *</label>
          <input value={form.title} onChange={set('title')}
            placeholder="e.g. Injured dog near park entrance" required />
        </div>

        {/* Animal type & Condition */}
        <div style={styles.row}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Animal Type *</label>
            <select value={form.animalType} onChange={set('animalType')} required>
              <option value="">Select type…</option>
              {ANIMAL_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Condition</label>
            <select value={form.animalCondition} onChange={set('animalCondition')}>
              <option value="">Select condition…</option>
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description *</label>
          <textarea value={form.description} onChange={set('description')}
            placeholder="Describe the animal's situation, injuries, behaviour…"
            rows={4} required />
        </div>

        {/* Location text */}
        <div className="form-group">
          <label>Location *</label>
          <input value={form.location} onChange={set('location')}
            placeholder="Address or landmark" required />
        </div>

        {/* Map picker */}
        <div className="form-group">
          <label>Pin on Map</label>
          <MapLocation onChange={handleMapChange} />
        </div>

        {/* Contact */}
        <div className="form-group">
          <label>Contact Number</label>
          <input value={form.contactNumber} onChange={set('contactNumber')}
            placeholder="+91 98765 43210" />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ marginTop: 8 }}>
          <FiSend />
          {submitting ? 'Posting…' : 'Post Rescue'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  header: { marginBottom: 36 },
  title: { fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--bark)' },
  sub: { color: 'var(--text-light)', marginTop: 8 },
  form: {
    background: 'var(--white)', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)', padding: '36px',
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  row: { display: 'flex', gap: 16, flexWrap: 'wrap' },
}
