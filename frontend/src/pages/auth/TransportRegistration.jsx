import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Truck, User, MapPin, Phone, Loader2, CheckCircle2, ArrowRight, FileText, Image, Files, CreditCard, Shield, Info, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/trans-logo.png'

function Field({ label, error, children, required, sublabel }) {
  return (
    <div className="form-group" style={{ marginBottom: 12 }}>
      {label && (
        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 650, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          {label} {required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
          {sublabel && <span style={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 500 }}>({sublabel})</span>}
        </label>
      )}
      {children}
      {error && <span className="form-error" style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
        <Info size={11} /> {error.message}
      </span>}
    </div>
  )
}

function DocUploadField({ label, icon: Icon, register, name, required }) {
  const [hasFile, setHasFile] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <label style={{ 
        display: 'flex', flexDirection: 'column', gap: 5, padding: '10px 12px', 
        border: '1.5px dashed #E2E8F0', borderRadius: '12px', background: '#F8FAFC',
        cursor: 'pointer', transition: 'all 0.2s', borderStyle: hasFile ? 'solid' : 'dashed',
        borderColor: hasFile ? '#16A34A' : '#E2E8F0',
        backgroundColor: hasFile ? '#F0FDF4' : '#F8FAFC'
      }} className="hover:border-purple-300 hover:bg-purple-50">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 30, height: 30, borderRadius: 9, background: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: hasFile ? '#16A34A' : '#7C3AED',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}>
            {hasFile ? <Check size={14} /> : <Icon size={14} />}
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 750, color: '#1E293B' }}>{label}</span>
        </div>
        <input 
          type="file" 
          {...register(name, { required: required && `${label} is required` })}
          onChange={(e) => setHasFile(e.target.files.length > 0)}
          style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }} 
        />
        <div style={{ fontSize: '0.58rem', color: hasFile ? '#16A34A' : '#94A3B8', fontWeight: 600, marginLeft: 38 }}>
          {hasFile ? 'Uploaded' : 'Select file'}
        </div>
      </label>
    </div>
  )
}

export default function TransportRegistration() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    defaultValues: {
      name: user?.name || '',
      businessName: '',
      phone: user?.phone || '',
      address: '',
    }
  })

  const handleNext = async () => {
    const isValid = await trigger(['name', 'businessName', 'address']);
    if (isValid) setStep(2);
  }

  const onSubmit = async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    updateProfile({ ...data, setupComplete: true })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 640, margin: '0 auto', padding: '0 0 10px' }}>
      {/* Header Info */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ 
          width: 56, height: 56, borderRadius: 20, background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)', position: 'relative'
        }}>
          <img src={logo} alt="Logo" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
          <div style={{ position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '3px solid white' }}>
            <Check size={10} strokeWidth={4} />
          </div>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: 2 }}>
          Setup Your Transport
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ height: 4, width: 32, borderRadius: 2, background: step === 1 ? '#7C3AED' : '#E2E8F0', transition: 'all 0.3s' }} />
          <div style={{ height: 4, width: 32, borderRadius: 2, background: step === 2 ? '#7C3AED' : '#E2E8F0', transition: 'all 0.3s' }} />
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
           {step === 1 ? 'Enter your business information' : 'Upload required documents for verification'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'white', padding: '20px 24px', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 15px 40px rgba(0,0,0,0.03)' }}>
        
        {step === 1 && (
          <div className="animate-slideInRight">
            {/* Section 1: Business Profile */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                 <div style={{ width: 5, height: 14, background: '#7C3AED', borderRadius: 2 }} />
                 <span style={{ fontSize: '0.8rem', fontWeight: 850, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Business Identity</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Owner Name" error={errors.name} required>
                  <div className="input-group">
                    <span className="input-prefix"><User size={15} /></span>
                    <input {...register('name', { required: 'Owner name is required' })} placeholder="Full Name" className="form-input" style={{ borderRadius: 9, height: 40, fontSize: '0.875rem' }} />
                  </div>
                </Field>
                
                <Field label="Contact Number" error={errors.phone} required>
                  <div className="input-group">
                    <span className="input-prefix"><Phone size={15} /></span>
                    <input {...register('phone', { required: 'Phone is required' })} placeholder="Phone Number" className="form-input" readOnly style={{ borderRadius: 9, height: 40, fontSize: '0.875rem', background: '#F8FAFC' }} />
                  </div>
                </Field>
              </div>

              <Field label="Transport Name" error={errors.businessName} required sublabel="Trade Name">
                <div className="input-group">
                  <span className="input-prefix"><Truck size={15} /></span>
                  <input {...register('businessName', { required: 'Business name is required' })} placeholder="e.g. Radhe Logistics" className="form-input" style={{ borderRadius: 9, height: 40, fontSize: '0.875rem' }} />
                </div>
              </Field>

              <Field label="Office Address" error={errors.address} required>
                <div className="input-group" style={{ alignItems: 'flex-start' }}>
                  <span className="input-prefix" style={{ marginTop: 10 }}><MapPin size={15} /></span>
                  <textarea {...register('address', { required: 'Address is required' })} placeholder="Complete Office Address" className="form-input" style={{ minHeight: 60, paddingTop: 8, borderRadius: 9, fontSize: '0.875rem' }} />
                </div>
              </Field>
            </div>

            <button type="button" onClick={handleNext} className="btn btn-primary btn-lg btn-full" style={{ borderRadius: 12, height: 48, fontSize: '0.875rem', fontWeight: 800 }}>
              Next Step <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slideInRight">
            {/* Section 2: Document Proofs */}
            <div style={{ marginBottom: 16, padding: '16px 18px', background: '#F1F5F9', borderRadius: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                 <Files size={15} color="#7C3AED" />
                 <span style={{ fontSize: '0.8rem', fontWeight: 850, color: '#1E293B' }}>Required Documents</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <DocUploadField label="Aadhar Card" icon={FileText} register={register} name="docAadhar" required />
                <DocUploadField label="PAN Card" icon={FileText} register={register} name="docPan" required />
                <DocUploadField label="Passport Photo" icon={Image} register={register} name="docPhoto" required />
                <DocUploadField label="Vehicle RC" icon={Truck} register={register} name="docRc" required />
                <DocUploadField label="Vehicle Insurance" icon={Shield} register={register} name="docInsurance" required />
                <DocUploadField label="Bank Details" icon={CreditCard} register={register} name="docBank" required />
              </div>
              
              <div style={{ marginTop: 10, padding: '6px 10px', background: 'rgba(124, 58, 237, 0.05)', borderRadius: 9, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                 <Info size={11} color="#7C3AED" style={{ marginTop: 2 }} />
                 <p style={{ fontSize: '0.6rem', color: '#6B7280', margin: 0, lineHeight: 1.3 }}>
                    Documents are used for verification purposes. Maximum size 5MB.
                 </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1, borderRadius: 12, height: 46, fontSize: '0.875rem', fontWeight: 800, border: '1px solid #E2E8F0' }}>
                Back
              </button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 2, borderRadius: 12, height: 46, fontSize: '0.875rem', fontWeight: 800 }}>
                {loading ? (
                  <><Loader2 size={16} className="spin" /> Verifying...</>
                ) : (
                  <>Setup My Business <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; } 
        @keyframes spin { to { transform: rotate(360deg); } }
        .hover\\:border-purple-300:hover { border-color: #C4B5FD !important; }
        .hover\\:bg-purple-50:hover { background-color: #F5F3FF !important; }
        
        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out forwards;
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
