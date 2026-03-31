import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const OTP_LENGTH = 6
const RESEND_TIMEOUT = 30

export default function OTPVerify() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [timer, setTimer] = useState(RESEND_TIMEOUT)
  const [resending, setResending] = useState(false)
  const [localError, setLocalError] = useState('')
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyOTP, sendOTP, verifying, error } = useAuth()

  const phone = location.state?.phone || ''

  // If no phone, redirect to login
  useEffect(() => {
    if (!phone) navigate('/login', { replace: true })
  }, [phone, navigate])

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer])

  // Focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, val) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    setLocalError('')
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    // Auto-submit when all filled
    if (digit && index === OTP_LENGTH - 1) {
      const fullOtp = [...newOtp.slice(0, OTP_LENGTH - 1), digit].join('')
      if (fullOtp.length === OTP_LENGTH) handleVerify(fullOtp)
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    e.preventDefault()
    const newOtp = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((d, i) => { if (i < OTP_LENGTH) newOtp[i] = d })
    setOtp(newOtp)
    const lastIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[lastIdx]?.focus()
    if (pasted.length === OTP_LENGTH) handleVerify(pasted)
  }

  const handleVerify = useCallback(async (otpStr) => {
    const code = otpStr || otp.join('')
    if (code.length < OTP_LENGTH) {
      setLocalError(`Please enter the ${OTP_LENGTH}-digit OTP`)
      return
    }
    const res = await verifyOTP(phone, code)
    if (res.success) {
      // Always show selection page after OTP
      navigate('/role-select', { replace: true })
    }
    // error displayed via context
  }, [otp, phone, verifyOTP, navigate])

  const handleResend = async () => {
    setResending(true)
    setOtp(Array(OTP_LENGTH).fill(''))
    setLocalError('')
    inputRefs.current[0]?.focus()
    await sendOTP(phone)
    setTimer(RESEND_TIMEOUT)
    setResending(false)
  }

  const displayPhone = phone
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : ''

  const displayError = localError || error

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
          <ShieldCheck size={20} color="var(--primary)" />
        </div>
        <h2 className="auth-card-title">Verify OTP</h2>
        <p className="auth-card-subtitle">
          We sent a 6-digit code to<br />
          <strong style={{ color: 'var(--text-primary)' }}>{displayPhone}</strong>
        </p>
      </div>

      {/* OTP Boxes */}
      <div className="form-group" style={{ marginBottom: 8 }}>
        <div className="otp-grid" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              id={`otp-box-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`otp-box${digit ? ' filled' : ''}${displayError ? ' error' : ''}`}
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              style={displayError ? { borderColor: 'var(--danger)' } : {}}
            />
          ))}
        </div>

        {displayError && (
          <div className="form-error" style={{ justifyContent: 'center', marginTop: 8 }}>
            <AlertCircle size={13} /> {displayError}
          </div>
        )}
      </div>

      {/* Verify Button */}
      <button
        id="btn-verify-otp"
        className="btn btn-primary btn-lg btn-full"
        onClick={() => handleVerify()}
        disabled={verifying || otp.join('').length < OTP_LENGTH}
        style={{ marginTop: 16 }}
      >
        {verifying ? (
          <><Loader2 size={18} className="spin" /> Verifying...</>
        ) : (
          'Verify & Continue'
        )}
      </button>

      {/* Resend + Back */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginTop: 20
      }}>
        <button
          id="btn-change-number"
          onClick={() => navigate('/login')}
          className="btn btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={14} /> Change Number
        </button>

        {timer > 0 ? (
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Resend in <strong style={{ color: 'var(--text-primary)' }}>{timer}s</strong>
          </span>
        ) : (
          <button
            id="btn-resend-otp"
            onClick={handleResend}
            disabled={resending}
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} className={resending ? 'spin' : ''} />
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        )}
      </div>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .otp-box.error { border-color: var(--danger) !important; }
      `}</style>
    </>
  )
}
