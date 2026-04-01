import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, ArrowRight, Loader2, AlertCircle, ShieldCheck, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/trans-logo.png'

export default function Login() {
  const [phone, setPhone]     = useState('')
  const [error, setError]     = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const { sendOTP, sendingOTP } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit mobile number')
      return false
    }
    setError('')
    return true
  }

  const handleSend = async () => {
    if (!validate()) return
    const res = await sendOTP(phone.replace(/\D/g, ''))
    if (res.success) {
      navigate('/otp', { state: { phone: phone.replace(/\D/g, '') } })
    } else {
      setError('Could not send OTP. Please try again.')
    }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSend() }

  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 5) return digits
    return `${digits.slice(0, 5)} ${digits.slice(5)}`
  }

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 440, margin: '0 auto', padding: '0 10px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ 
          width: 64, height: 64, borderRadius: 24, background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.06)', position: 'relative',
          border: '1px solid #F1F5F9'
        }}>
          <img src={logo} alt="Logo" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
          <div style={{ 
            position: 'absolute', bottom: -5, right: -5, width: 24, height: 24, 
            borderRadius: '50%', background: '#7C3AED', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', color: 'white', border: '3px solid white',
            boxShadow: '0 4px 10px rgba(124, 58, 237, 0.4)'
          }}>
            <Check size={14} strokeWidth={4} />
          </div>
        </div>
        <h2 style={{ 
          fontSize: '1.75rem', fontWeight: 950, color: '#0F172A', letterSpacing: '-0.04em', marginBottom: 8,
          background: 'linear-gradient(to right, #0F172A, #4C1D95)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Welcome to TRANS
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500, lineHeight: 1.4 }}>
          Enter your mobile number to get started.<br />
          We'll send you a <span style={{ color: '#7C3AED', fontWeight: 700 }}>6-digit OTP</span>.
        </p>
      </div>

      {/* Main Login Card */}
      <div style={{ 
        background: 'white', padding: '28px 24px', borderRadius: 28, 
        border: '1px solid #F1F5F9', boxShadow: '0 25px 60px rgba(0,0,0,0.04)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Subtle decorative glow */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 100, height: 100, borderRadius: '50%', background: 'rgba(124, 58, 237, 0.03)', filter: 'blur(40px)' }} />

        <div className="form-group" style={{ marginBottom: 24 }}>
          <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 750, color: '#334155', marginBottom: 10, display: 'block', letterSpacing: '0.02em' }}>
            MOBILE NUMBER
          </label>
          <div className="phone-input-wrap" style={{ 
            height: 52, borderRadius: 16, overflow: 'hidden', border: '2px solid',
            borderColor: error ? '#FECACA' : (isFocused ? '#7C3AED' : '#F1F5F9'),
            background: error ? '#FEF2F2' : (isFocused ? '#F5F3FF' : 'white'),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isFocused && !error ? '0 0 0 4px rgba(124, 58, 237, 0.1)' : 'none'
          }}>
            <div className="phone-code" style={{ padding: '0 16px', background: error ? '#FEE2E2' : '#F8FAFC', borderRight: '2px solid', borderColor: error ? '#FECACA' : '#F1F5F9', height: '100%', display: 'flex', alignItems: 'center' }}>
               <span style={{ fontSize: '1rem' }}>🇮🇳</span>
               <span style={{ fontWeight: 800, color: '#1E293B', marginLeft: 6, fontSize: '0.9rem' }}>+91</span>
            </div>
            <input
              id="phone-input"
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={formatPhone(phone)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={e => {
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                if (error) setError('')
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              className="form-input"
              style={{ border: 'none', height: '100%', fontSize: '1.05rem', fontWeight: 700, padding: '0 16px', color: '#0F172A', outline: 'none' }}
            />
          </div>
          {error && (
            <span className="form-error" style={{ marginTop: 8, color: '#DC2626', fontSize: '0.75rem', fontWeight: 650, display: 'flex', alignItems: 'center', gap: 6, animation: 'shake 0.4s ease' }}>
              <AlertCircle size={14} /> {error}
            </span>
          )}
        </div>

        <button
          id="btn-send-otp"
          className="btn btn-primary btn-lg btn-full"
          onClick={handleSend}
          disabled={sendingOTP || phone.replace(/\D/g, '').length < 10}
          style={{ 
            height: 52, borderRadius: 16, fontSize: '0.95rem', fontWeight: 850, 
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #4C1D95 100%)', 
            boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
            transform: 'scale(1)',
            transition: 'all 0.3s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {sendingOTP ? (
            <><Loader2 size={20} className="spin" /> Sending...</>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Send Authentication OTP <ArrowRight size={20} strokeWidth={2.5} />
            </div>
          )}
        </button>

        {/* Footer info */}
        <p style={{
          textAlign: 'center', fontSize: '0.75rem',
          color: '#94A3B8', marginTop: 24, fontWeight: 500, lineHeight: 1.4
        }}>
          By continuing, you agree to our{' '}
          <a href="#" className="hover:text-purple-700" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(124, 58, 237, 0.1)' }}>Terms</a> &{' '}
          <a href="#" className="hover:text-purple-700" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(124, 58, 237, 0.1)' }}>Privacy Policy</a>
        </p>
      </div>

      {/* Enhanced Demo Section */}
      <div style={{
        marginTop: 18, padding: '12px 16px', borderRadius: 16,
        background: 'rgba(124, 58, 237, 0.03)', border: '1px dashed #DDD6FE',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: 'inset 0 2px 4px rgba(124, 58, 237, 0.02)'
      }}>
        <div style={{ 
          width: 32, height: 32, borderRadius: 10, background: 'white', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: '0 4px 10px rgba(124, 58, 237, 0.1)', border: '1px solid #EDE9FE' 
        }}>
           <ShieldCheck size={18} color="#7C3AED" />
        </div>
        <div>
          <p style={{ fontSize: '0.7rem', color: '#6D28D9', fontWeight: 750, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Demo Access</p>
          <p style={{ fontSize: '0.75rem', color: '#4C1D95', fontWeight: 500, margin: '2px 0 0 0' }}>
            Any 10 digits → OTP is <strong style={{ color: '#7C3AED', fontSize: '0.85rem' }}>123456</strong>
          </p>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .form-input:focus { box-shadow: none !important; }
        .hover\\:text-purple-700:hover { color: #4C1D95 !important; border-bottom-color: #4C1D95 !important; }
      `}</style>
    </div>
  )
}
