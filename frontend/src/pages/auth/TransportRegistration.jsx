import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Truck, User, MapPin, Phone, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Field({ label, error, children, required }) {
  return (
    <div className="form-group" style={{ marginBottom: 16 }}>
      <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
        {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <span className="form-error" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{error.message}</span>}
    </div>
  )
}

export default function TransportRegistration() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      businessName: '',
      phone: user?.phone || '',
      address: '',
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200))
    updateProfile({ ...data, setupComplete: true })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="auth-card-header" style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ 
          width: 64, height: 64, borderRadius: 20, background: '#FEF3C7', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' 
        }}>
          <Truck size={32} color="#F59E0B" />
        </div>
        <h2 className="auth-card-title" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Setup Transport Business</h2>
        <p className="auth-card-subtitle">Tell us about your transport agency to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-flat" style={{ padding: 24, background: 'white', borderRadius: 24, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Owner Name" error={errors.name} required>
            <div className="input-group">
              <span className="input-prefix"><User size={16} /></span>
              <input {...register('name', { required: 'Name is required' })} placeholder="Full Name" className="form-input" />
            </div>
          </Field>
          
          <Field label="Phone Number" error={errors.phone} required>
            <div className="input-group">
              <span className="input-prefix"><Phone size={16} /></span>
              <input {...register('phone', { required: 'Phone is required' })} placeholder="Phone Number" className="form-input" readOnly />
            </div>
          </Field>
        </div>

        <Field label="Transport Name" error={errors.businessName} required>
          <div className="input-group">
            <span className="input-prefix"><Truck size={16} /></span>
            <input {...register('businessName', { required: 'Business name is required' })} placeholder="e.g. Mahakal Logistics" className="form-input" />
          </div>
        </Field>

        <Field label="Office Address" error={errors.address} required>
          <div className="input-group" style={{ alignItems: 'flex-start' }}>
            <span className="input-prefix" style={{ marginTop: 12 }}><MapPin size={16} /></span>
            <textarea {...register('address', { required: 'Address is required' })} placeholder="Full Address" className="form-input" style={{ minHeight: 80, paddingTop: 10 }} />
          </div>
        </Field>

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? (
            <><Loader2 size={18} className="spin" /> Creating Profile...</>
          ) : (
            <>Complete Registration <ArrowRight size={18} /></>
          )}
        </button>
      </form>

      <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
