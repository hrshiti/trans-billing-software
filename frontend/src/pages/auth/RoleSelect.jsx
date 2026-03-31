import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Truck, Wrench, CheckCircle2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const roles = [
  {
    id: 'transport',
    icon: '🚛',
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    title: 'Transporter',
    titleHi: 'ट्रांसपोर्ट',
    desc: 'Manage trips, vehicles & transport billing',
    features: ['Trip management', 'Vehicle fleet', 'Route billing', 'Chalan upload'],
  },
  {
    id: 'garage',
    icon: '🔧',
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE',
    title: 'Garage Owner',
    titleHi: 'गैरेज',
    desc: 'Manage vehicle services & repair billing',
    features: ['Service records', 'Spare parts', 'Service reminders', 'Repair invoices'],
  },
]

export default function RoleSelect() {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setRole } = useAuth()
  const navigate = useNavigate()

  const handleContinue = async () => {
    if (!selected) return
    setLoading(true)
    // Simulate save delay
    await new Promise(r => setTimeout(r, 600))
    setRole(selected)
    navigate('/dashboard', { replace: true })
  }

  return (
    <>
      {/* Header */}
      <div className="auth-card-header">
        <h2 className="auth-card-title">Choose Your Role</h2>
        <p className="auth-card-subtitle">
          Select what best describes your business.<br />
          You can't change this later.
        </p>
      </div>

      {/* Role cards */}
      <div className="role-grid">
        {roles.map((role, idx) => (
          <button
            key={role.id}
            id={`btn-role-${role.id}`}
            className={`role-card animate-fadeInUp stagger-${idx + 1}`}
            onClick={() => setSelected(role.id)}
            style={{
              border: selected === role.id
                ? '2px solid var(--primary)'
                : '2px solid var(--border)',
              background: selected === role.id ? 'var(--primary-lighter)' : 'var(--surface)',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Check mark */}
            {selected === role.id && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                color: 'var(--primary)'
              }}>
                <CheckCircle2 size={18} fill="var(--primary-lighter)" />
              </div>
            )}

            {/* Icon */}
            <div className="role-icon" style={{ background: role.iconBg }}>
              <span style={{ fontSize: '1.75rem' }}>{role.icon}</span>
            </div>

            {/* Title */}
            <div className="role-title">{role.title}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {role.titleHi}
            </div>

            {/* Desc */}
            <div className="role-desc" style={{ marginTop: 8 }}>{role.desc}</div>
          </button>
        ))}
      </div>

      {/* Features preview */}
      {selected && (
        <div
          className="animate-fadeInUp card-flat"
          style={{
            padding: 16, borderRadius: 12, marginBottom: 16,
            background: 'var(--primary-lighter)',
            border: '1px solid #DDD6FE'
          }}
        >
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 10 }}>
            ✅ Included features:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {roles.find(r => r.id === selected)?.features.map(f => (
              <div key={f} style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', display: 'flex', gap: 6, alignItems: 'center' }}>
                <CheckCircle2 size={12} /> {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue button */}
      <button
        id="btn-role-continue"
        className="btn btn-primary btn-lg btn-full"
        onClick={handleContinue}
        disabled={!selected || loading}
      >
        {loading ? (
          <><Loader2 size={18} className="spin" /> Setting up...</>
        ) : (
          <>Continue as {roles.find(r => r.id === selected)?.title || '...'} <ArrowRight size={18} /></>
        )}
      </button>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
