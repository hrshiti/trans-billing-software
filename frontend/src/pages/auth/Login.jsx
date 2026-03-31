import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [phone, setPhone]     = useState('')
  const [error, setError]     = useState('')
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
    <>
      {/* Header */}
      <div className="auth-card-header">
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'var(--primary-lighter)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16
        }}>
          <Phone size={20} color="var(--primary)" />
        </div>
        <h2 className="auth-card-title">Welcome to TRANS</h2>
        <p className="auth-card-subtitle">
          Enter your mobile number to get started.<br />
          We'll send you a 6-digit OTP.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        <div className="form-group">
          <label className="form-label" htmlFor="phone-input">
            Mobile Number
          </label>
          <div className="phone-input-wrap" style={error ? { borderColor: 'var(--danger)' } : {}}>
            <div className="phone-code">
              <span style={{ fontSize: '1rem' }}>🇮🇳</span>
              +91
            </div>
            <input
              id="phone-input"
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={formatPhone(phone)}
              onChange={e => {
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                if (error) setError('')
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="tel"
            />
          </div>
          {error && (
            <span className="form-error">
              <AlertCircle size={12} /> {error}
            </span>
          )}
        </div>

        <button
          id="btn-send-otp"
          className="btn btn-primary btn-lg btn-full"
          onClick={handleSend}
          disabled={sendingOTP || phone.replace(/\D/g, '').length < 10}
          style={{ marginTop: 4 }}
        >
          {sendingOTP ? (
            <><Loader2 size={18} className="spin" /> Sending OTP...</>
          ) : (
            <>Send OTP <ArrowRight size={18} /></>
          )}
        </button>
      </div>

      {/* Footer note */}
      <p style={{
        textAlign: 'center', fontSize: '0.75rem',
        color: 'var(--text-muted)', marginTop: 20
      }}>
        By continuing, you agree to our{' '}
        <a href="#" style={{ color: 'var(--primary)' }}>Terms</a> &{' '}
        <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>
      </p>

      {/* Demo hint */}
      <div style={{
        marginTop: 16, padding: '10px 14px', borderRadius: 10,
        background: 'var(--primary-lighter)', border: '1px solid #DDD6FE'
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: 500 }}>
          🧪 <strong>Demo:</strong> Enter any 10-digit number → OTP is <strong>123456</strong>
        </p>
      </div>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
