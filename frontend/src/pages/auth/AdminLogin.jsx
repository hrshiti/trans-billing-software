import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Loader2, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/trans-logo.png'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate administrative delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Secure Admin Validation (Hardcoded for demo)
    if (email === 'admin@billpro.com' && password === 'admin123') {
      await login({ 
        id: 'sys_admin_root', 
        name: 'Super Admin', 
        role: 'admin', 
        email: 'admin@billpro.com',
        avatar: 'SA'
      })
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('System Access Denied: Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="animate-fadeIn">
      {/* Branding / Header */}
      <div className="auth-card-header" style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
          <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h2 className="auth-card-title" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Admin Portal</h2>
        <p className="auth-card-subtitle">
          Authorized personnel only. Please enter your secure administrative credentials to access the console.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#4B5563' }}>
            Work Email
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="email" 
              placeholder="admin@billpro.com"
              value={email}
              onChange={e => {setEmail(e.target.value); if(error) setError('')}}
              required
              className="form-input"
              style={{ paddingLeft: 44, height: 48, borderRadius: 12, border: error ? '2px solid #EF4444' : '1.5px solid #E5E7EB' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#4B5563' }}>
            Secret Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={e => {setPassword(e.target.value); if(error) setError('')}}
              required
              className="form-input"
              style={{ paddingLeft: 44, paddingRight: 44, height: 48, borderRadius: 12, border: error ? '2px solid #EF4444' : '1.5px solid #E5E7EB' }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', 
            borderRadius: 10, background: '#FEF2F2', border: '1px solid #FEE2E2',
            color: '#DC2626', fontSize: '0.8125rem', fontWeight: 600
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button 
          className="btn btn-primary btn-lg btn-full" 
          type="submit"
          disabled={loading}
          style={{ 
            height: 52, borderRadius: 12, fontSize: '1rem', fontWeight: 700,
            background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
            border: 'none', marginTop: 8
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Loader2 size={20} className="spin" />
              Verifying...
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Unlock Dashboard <ArrowRight size={20} />
            </div>
          )}
        </button>
      </form>

      {/* Alternative Login */}
      <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid #F3F4F6', paddingTop: 24 }}>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: 16 }}>Are you a business owner?</p>
        <button 
          onClick={() => navigate('/login')}
          className="btn btn-ghost"
          style={{ 
            fontWeight: 700, color: '#4F46E5', fontSize: '0.875rem',
            background: '#F5F3FF', padding: '8px 20px', borderRadius: 10
          }}
        >
          User OTP Login
        </button>
      </div>

      {/* Security Disclaimer */}
      <p style={{ 
        textAlign: 'center', fontSize: '0.7rem', color: '#9CA3AF', 
        marginTop: 32, lineHeight: 1.5, padding: '0 20px'
      }}>
        All administrative actions are logged and strictly monitored. Unauthorized access attempts will be permanently blocked.
      </p>

      {/* Demo Credentials Hint */}
      <div style={{
        marginTop: 20, padding: '12px', borderRadius: 12,
        background: '#F8FAFC', border: '1px solid #E2E8F0'
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 6 }}>Demo Admin Access</div>
        <div style={{ fontSize: '0.75rem', color: '#1E293B' }}>
          Email: <code style={{ fontWeight: 700 }}>admin@billpro.com</code><br/>
          Pass: <code style={{ fontWeight: 700 }}>admin123</code>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
