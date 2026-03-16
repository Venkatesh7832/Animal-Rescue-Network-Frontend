import { useState, useRef } from 'react'
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi'

export default function UploadImage({ value, onChange }) {
  const [preview, setPreview] = useState(value || null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      onChange(file, e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleChange = (e) => handleFile(e.target.files[0])

  const clear = () => {
    setPreview(null)
    onChange(null, null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {preview ? (
        <div style={styles.previewWrap}>
          <img src={preview} alt="preview" style={styles.preview} />
          <button type="button" onClick={clear} style={styles.clearBtn}>
            <FiX size={16} />
          </button>
        </div>
      ) : (
        <div
          style={{ ...styles.dropzone, ...(dragging ? styles.dragging : {}) }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <FiUploadCloud size={32} style={{ color: '#4A6741', marginBottom: 10 }} />
          <p style={styles.dropText}>Drag &amp; drop an image, or <span style={styles.browse}>browse</span></p>
          <p style={styles.dropSub}>JPEG, PNG, GIF, WEBP — max 5 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  )
}

const styles = {
  dropzone: {
    border: '2px dashed #C8AD8A',
    borderRadius: 12,
    padding: '40px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#FDFAF5',
    transition: 'all 0.2s',
  },
  dragging: {
    borderColor: '#4A6741',
    background: '#C8DCBF33',
  },
  dropText: { fontSize: 14, color: '#5C4535', marginBottom: 4 },
  browse: { color: '#4A6741', fontWeight: 600 },
  dropSub: { fontSize: 12, color: '#8C7060' },
  previewWrap: {
    position: 'relative', borderRadius: 12, overflow: 'hidden',
    border: '1.5px solid #D8CAB5',
  },
  preview: { width: '100%', height: 220, objectFit: 'cover', display: 'block' },
  clearBtn: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(61,43,31,0.7)', border: 'none',
    borderRadius: 20, width: 30, height: 30,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#fff',
  },
}
