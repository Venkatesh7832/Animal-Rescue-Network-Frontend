import { useEffect, useRef, useState } from 'react'
import { FiNavigation, FiSearch } from 'react-icons/fi'
import { getCurrentPosition, reverseGeocode, forwardGeocode } from '../utils/geoLocation'

// Dynamically load Leaflet CSS
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'

let L = null

async function getLeaflet() {
  if (L) return L
  if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = LEAFLET_CSS
    document.head.appendChild(link)
  }
  L = (await import('leaflet')).default
  // Fix default marker icons
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
  return L
}

export default function MapLocation({ value, onChange }) {
  const mapRef     = useRef(null)
  const markerRef  = useRef(null)
  const mapElRef   = useRef(null)
  const [search, setSearch]   = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)

  const DEFAULT_LAT = 17.385  // Hyderabad, IN
  const DEFAULT_LNG = 78.4867

  useEffect(() => {
    let cancelled = false

    getLeaflet().then((Leaflet) => {
      if (cancelled || mapRef.current) return
      const map = Leaflet.map(mapElRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 12)
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)
      mapRef.current = map

      map.on('click', async (e) => {
        const { lat, lng } = e.latlng
        placeMarker(Leaflet, map, lat, lng)
        const address = await reverseGeocode(lat, lng)
        onChange({ lat, lng, address })
      })

      if (value?.lat && value?.lng) {
        placeMarker(Leaflet, map, value.lat, value.lng)
        map.setView([value.lat, value.lng], 14)
      }
    })

    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  function placeMarker(Leaflet, map, lat, lng) {
    if (markerRef.current) markerRef.current.remove()
    markerRef.current = Leaflet.marker([lat, lng]).addTo(map)
  }

  const handleLocate = async () => {
    setLocating(true)
    try {
      const Leaflet = await getLeaflet()
      const { lat, lng } = await getCurrentPosition()
      placeMarker(Leaflet, mapRef.current, lat, lng)
      mapRef.current.setView([lat, lng], 15)
      const address = await reverseGeocode(lat, lng)
      onChange({ lat, lng, address })
    } catch (e) {
      alert('Unable to get your location. Please click on the map instead.')
    } finally {
      setLocating(false)
    }
  }

  const handleSearch = async () => {
    if (!search.trim()) return
    setLoading(true)
    const found = await forwardGeocode(search)
    setResults(found)
    setLoading(false)
  }

  const selectResult = async (r) => {
    const Leaflet = await getLeaflet()
    placeMarker(Leaflet, mapRef.current, r.lat, r.lng)
    mapRef.current.setView([r.lat, r.lng], 14)
    onChange({ lat: r.lat, lng: r.lng, address: r.display_name })
    setResults([])
    setSearch(r.display_name)
  }

  return (
    <div style={styles.wrap}>
      {/* Search bar */}
      <div style={styles.searchRow}>
        <input
          style={styles.searchInput}
          placeholder="Search location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button type="button" style={styles.iconBtn} onClick={handleSearch} disabled={loading}>
          <FiSearch size={16} />
        </button>
        <button type="button" style={styles.iconBtn} onClick={handleLocate} disabled={locating} title="Use my location">
          <FiNavigation size={16} />
        </button>
      </div>

      {/* Autocomplete results */}
      {results.length > 0 && (
        <div style={styles.results}>
          {results.map((r, i) => (
            <button key={i} type="button" style={styles.resultItem} onClick={() => selectResult(r)}>
              {r.display_name}
            </button>
          ))}
        </div>
      )}

      {/* Map */}
      <div ref={mapElRef} style={styles.mapEl} />
      <p style={styles.hint}>Click on the map or search to pin the rescue location.</p>
    </div>
  )
}

const styles = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  searchRow: { display: 'flex', gap: 8 },
  searchInput: {
    flex: 1, padding: '9px 12px',
    border: '1.5px solid #D8CAB5', borderRadius: 8,
    background: '#FDFAF5', fontSize: 13, outline: 'none',
    fontFamily: 'inherit',
  },
  iconBtn: {
    padding: '9px 14px', border: '1.5px solid #D8CAB5',
    borderRadius: 8, background: '#FDFAF5', cursor: 'pointer',
    color: '#4A6741', display: 'flex', alignItems: 'center',
    transition: 'all 0.2s',
  },
  results: {
    background: '#FDFAF5', border: '1.5px solid #D8CAB5',
    borderRadius: 8, maxHeight: 180, overflowY: 'auto',
  },
  resultItem: {
    width: '100%', textAlign: 'left', padding: '10px 14px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 12, color: '#3D2B1F', borderBottom: '1px solid #EDE6D6',
    fontFamily: 'inherit', transition: 'background 0.15s',
  },
  mapEl: { height: 280, borderRadius: 12, overflow: 'hidden', border: '1.5px solid #D8CAB5' },
  hint: { fontSize: 11, color: '#8C7060' },
}
