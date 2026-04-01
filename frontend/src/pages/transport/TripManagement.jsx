import React, { useState, useEffect, useMemo, useRef } from 'react'
import { 
  Truck, MapPin, Plus, Calendar, Trash2, 
  Search, ArrowLeft, Loader2, CheckCircle2,
  Navigation, Hash, ArrowRight, Camera, Image as ImageIcon, X, Eye, Upload
} from 'lucide-react'
import { useVehicles } from '../../context/VehicleContext'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

export default function TripManagement() {
  const { vehicles } = useVehicles()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  // Local state for trips (since "no backend changes" requested)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // Photo states
  const [selectedTripId, setSelectedTripId] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    vehicleId: '',
    fromLocation: '',
    toLocation: '',
    numberOfTrips: '',
    amount: ''
  })

  // Load trips from localStorage for persistence
  useEffect(() => {
    const saved = localStorage.getItem('transport_trips')
    if (saved) {
      try {
        setTrips(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse trips", e)
      }
    }
    setLoading(false)
  }, [])

  // Persist trips
  const saveTrips = (newList) => {
    setTrips(newList)
    localStorage.setItem('transport_trips', JSON.stringify(newList))
  }

  const handleAddTrip = (e) => {
    e.preventDefault()
    if (!formData.fromLocation || !formData.toLocation || !formData.vehicleId) {
      alert("Please fill in main fields")
      return
    }

    const vehicle = vehicles.find(v => v.id === formData.vehicleId)
    const newTrip = {
      id: `trip_${Date.now()}`,
      ...formData,
      numberOfTrips: formData.numberOfTrips || '1',
      vehicleNumber: vehicle?.vehicleNumber || 'Unknown',
      createdAt: new Date().toISOString(),
      chalanImage: null // Initialize with no image
    }

    saveTrips([newTrip, ...trips])
    setShowForm(false)
    setFormData({
      date: dayjs().format('YYYY-MM-DD'),
      vehicleId: '',
      fromLocation: '',
      toLocation: '',
      numberOfTrips: '',
      amount: ''
    })
  }

  const handleDelete = (id) => {
    if (window.confirm("Delete this trip record?")) {
      saveTrips(trips.filter(t => t.id !== id))
    }
  }

  // Photo handlers
  const handlePhotoCapture = (tripId) => {
    setSelectedTripId(tripId)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Limit file size for localStorage (approx 2MB limit for base64 is safe-ish but small)
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image too large. Please select a smaller photo (under 1.5MB) for browser-only storage.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      const updatedTrips = trips.map(t => 
        t.id === selectedTripId ? { ...t, chalanImage: base64String } : t
      )
      saveTrips(updatedTrips)
      setSelectedTripId(null)
      // Reset file input
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = (e, tripId) => {
    e.stopPropagation()
    if (window.confirm("Remove this Chalan photo?")) {
      const updatedTrips = trips.map(t => 
        t.id === tripId ? { ...t, chalanImage: null } : t
      )
      saveTrips(updatedTrips)
    }
  }

  // Filter & Search (Mock)
  const [search, setSearch] = useState('')
  const filteredTrips = useMemo(() => {
    if (!search) return trips
    const s = search.toLowerCase()
    return trips.filter(t => 
      t.fromLocation.toLowerCase().includes(s) || 
      t.toLocation.toLowerCase().includes(s) ||
      t.vehicleNumber.toLowerCase().includes(s)
    )
  }, [trips, search])

  return (
    <div className="page-wrapper animate-fadeIn">
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F0D2E', margin: 0 }}>Detailed Trip Management</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Track and manage route-wise operations</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ height: 48, borderRadius: 16, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(79, 70, 229, 0.2)' }}>
          {showForm ? <><ArrowLeft size={18} /> Cancel</> : <><Plus size={18} /> Log New Trip</>}
        </button>
      </div>

      {/* Stats row */}
      {!showForm && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: 'white', borderRadius: 24, padding: '20px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Total Trips</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F0D2E' }}>{trips.length}</div>
          </div>
          <div style={{ background: '#EEF2FF', borderRadius: 24, padding: '20px', border: '1px solid #E0E7FF' }}>
            <div style={{ color: '#4F46E5', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Active Routes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#4338CA' }}>{new Set(trips.map(t => `${t.fromLocation}-${t.toLocation}`)).size}</div>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="animate-fadeInUp" style={{ background: 'white', borderRadius: 28, padding: 24, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Navigation size={22} color="var(--primary)" /> Add Trip Details
          </h2>
          <form onSubmit={handleAddTrip} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <div style={{ position: 'relative' }}>
                   <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="form-input" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Select Vehicle</label>
                <select value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="form-input" required>
                  <option value="">— Select —</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.vehicleType})</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">From Location</label>
                <input value={formData.fromLocation} onChange={e => setFormData({...formData, fromLocation: e.target.value})} placeholder="e.g., Ahmedabad" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">To Location</label>
                <input value={formData.toLocation} onChange={e => setFormData({...formData, toLocation: e.target.value})} placeholder="e.g., Surat" className="form-input" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Number of Trips</label>
                <input type="number" value={formData.numberOfTrips} onChange={e => setFormData({...formData, numberOfTrips: e.target.value})} placeholder="1" className="form-input" min="1" required />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹) (Optional)</label>
                <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="1500" className="form-input" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 10, height: 50, borderRadius: 16, fontWeight: 800 }}>
              Save Trip Record
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div style={{ background: 'white', borderRadius: 20, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Search size={20} color="#9CA3AF" />
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by location or vehicle number..." 
              style={{ border: 'none', background: 'transparent', flex: 1, height: 40, outline: 'none', fontSize: '0.9rem' }} 
            />
          </div>

          {/* Trips List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredTrips.length > 0 ? filteredTrips.map((trip) => (
              <div key={trip.id} className="animate-fadeInUp" style={{ background: 'white', borderRadius: 24, padding: 18, display: 'flex', alignItems: 'center', gap: 16, border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                {/* Icon wrapper */}
                <div style={{ width: 48, height: 48, borderRadius: 16, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Truck size={22} />
                </div>

                {/* Main info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F0D2E', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {trip.fromLocation} <ArrowRight size={14} color="#9CA3AF" /> {trip.toLocation}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Hash size={12} /> {trip.vehicleNumber}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {dayjs(trip.date).format('DD MMM YYYY')}</span>
                    <span style={{ background: '#F3F4F6', color: '#374151', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: '0.7rem' }}>{trip.numberOfTrips} TRIP(S)</span>
                  </div>
                </div>

                {/* Action Area (Chalan + Amount + Delete) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 16, borderLeft: '1px solid #F3F4F6', marginLeft: 8 }}>
                  
                  {/* Chalan Photo Capture UI */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {trip.chalanImage ? (
                      <div 
                        onClick={() => { setPreviewImage(trip.chalanImage); setIsPreviewOpen(true); }}
                        style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: '2px solid #7C3AED', position: 'relative', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}
                      >
                        <img src={trip.chalanImage} alt="Chalan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                           <Eye size={14} color="white" />
                        </div>
                        <button 
                          onClick={(e) => removePhoto(e, trip.id)}
                          style={{ position: 'absolute', top: 0, right: 0, background: '#EF4444', border: 'none', color: 'white', padding: '1px 3px', borderRadius: '0 0 0 6px' }}
                        >
                          <X size={8} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handlePhotoCapture(trip.id)}
                        title="Click to capture Chalan photo"
                        style={{ width: 44, height: 44, borderRadius: 12, background: '#F9FAFB', border: '1px dashed #D1D5DB', color: '#9CA3AF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 1, transition: '0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#7C3AED'; e.currentTarget.style.background = '#F5F3FF'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = '#F9FAFB'; }}
                      >
                        <Camera size={16} />
                        <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>CHALAN</span>
                      </button>
                    )}
                  </div>

                  {/* Amount & Delete */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, minWidth: 80 }}>
                    {trip.amount && <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F0D2E' }}>₹{parseFloat(trip.amount).toLocaleString()}</div>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleDelete(trip.id)} 
                        style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} 
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 28, color: '#9CA3AF' }}>
                <Truck size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>No trips recorded yet</div>
                <p style={{ fontSize: '0.875rem' }}>Start by logging a new trip today</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Photo Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="animate-fadeIn"
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 13, 46, 0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(8px)' }}
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                style={{ background: 'white', border: 'none', borderRadius: 12, height: 40, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                <X size={18} /> Close
              </button>
            </div>
            <img 
              src={previewImage} 
              alt="Chalan Preview" 
              style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', objectFit: 'contain', border: '4px solid white' }} 
            />
            <div style={{ marginTop: 20, color: 'white', fontWeight: 700, fontSize: '0.9rem', background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: 20 }}>
              Chalan Proof Capture
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input for Capture */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        capture="environment" 
        onChange={onFileChange} 
      />
    </div>
  )
}
