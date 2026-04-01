import React, { useState } from 'react'
import { 
  Settings, CreditCard, Bell, Shield, 
  Globe, Smartphone, Save, RefreshCw,
  Lock, Mail, Phone, Palette, Database,
  CheckCircle2, AlertCircle
} from 'lucide-react'

export default function SystemSettings() {
  const [activeSection, setActiveSection] = useState('Payment')
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }

  const sections = [
    { id: 'Payment', icon: CreditCard, label: 'Payment Gateway' },
    { id: 'General', icon: Globe, label: 'App Settings' },
    { id: 'Security', icon: Shield, label: 'Security & Auth' },
    { id: 'Notify', icon: Bell, label: 'Notifications' },
    { id: 'Storage', icon: Database, label: 'Backup & Storage' },
  ]

  return (
    <div className="animate-fadeIn">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
             <Settings size={18} color="var(--primary)" />
             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>System Configuration</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Settings Command</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Global application configuration and infrastructure controls</p>
        </div>
        <button className="btn btn-primary shadow-lg" onClick={handleSave} disabled={saving}>
          {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Syncing...' : 'Save Global Config'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
        {/* Sidebar Nav */}
        <div className="card" style={{ padding: '16px', height: 'fit-content' }}>
           {sections.map(s => (
             <button
               key={s.id}
               onClick={() => setActiveSection(s.id)}
               style={{
                 width: '100%', padding: '14px 16px', borderRadius: 12, border: 'none',
                 display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                 background: activeSection === s.id ? 'var(--primary-lighter)' : 'transparent',
                 color: activeSection === s.id ? 'var(--primary)' : 'var(--text-secondary)',
                 fontWeight: 700, transition: 'var(--transition)', marginBottom: 4,
                 textAlign: 'left'
               }}
             >
               <s.icon size={20} />
               {s.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-8">
           {activeSection === 'Payment' && (
             <div className="card animate-fadeIn" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: 24 }}>Payment Gateway Integration</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                   <div style={{ padding: '20px', background: 'var(--bg)', borderRadius: 16, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', gap:16 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 14, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                         <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#0070BA' }}>RPAY</span>
                      </div>
                      <div style={{ flex: 1 }}>
                         <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>Razorpay Standard Checkout</p>
                         <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Primary merchant gateway for all card and UPI transactions</p>
                      </div>
                      <span className="badge badge-success">ACTIVE</span>
                   </div>

                   <div className="form-group">
                      <label className="form-label">RAZORPAY KEY ID</label>
                      <div className="input-group">
                         <Lock className="input-icon" size={18} />
                         <input type="text" className="form-input" placeholder="Enter Razorpay Key ID" />
                      </div>
                   </div>

                   <div className="form-group">
                      <label className="form-label">RAZORPAY KEY SECRET</label>
                      <div className="input-group">
                         <Lock className="input-icon" size={18} />
                         <input type="password" className="form-input" placeholder="Enter Razorpay Secret" />
                      </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div className="form-group">
                         <label className="form-label">CURRENCY</label>
                         <select className="form-input">
                            <option>INR (Indian Rupee)</option>
                            <option>USD (US Dollar)</option>
                         </select>
                      </div>
                      <div className="form-group">
                         <label className="form-label">TEST MODE</label>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48 }}>
                            <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>OFF</button>
                            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>ON</button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeSection === 'General' && (
             <div className="card animate-fadeIn" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: 24 }}>General Application Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                   <div className="form-group">
                      <label className="form-label">APPLICATION NAME</label>
                      <input type="text" className="form-input" placeholder="Enter Application Name" />
                   </div>
                   
                   <div className="form-group">
                      <label className="form-label">SUPPORT EMAIL</label>
                      <div className="input-group">
                         <Mail className="input-icon" size={18} />
                         <input type="email" className="form-input" placeholder="Enter Support Email" />
                      </div>
                   </div>

                   <div className="form-group">
                      <label className="form-label">SUPPORT PHONE</label>
                      <div className="input-group">
                         <Phone className="input-icon" size={18} />
                         <input type="tel" className="form-input" placeholder="Enter Support Phone" />
                      </div>
                   </div>

                   <div className="form-group">
                      <label className="form-label">SYSTEM LOOK & FEEL</label>
                      <div style={{ display: 'flex', gap: 12 }}>
                         {['#7C3AED', '#3B82F6', '#10B981', '#F59E0B'].map(c => (
                           <button 
                             key={c}
                             style={{ 
                               width: 32, height: 32, borderRadius: '50%', background: c, border: c === '#7C3AED' ? '3px solid black' : 'none',
                               cursor: 'pointer'
                             }} 
                           />
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Quick Stats Overlay */}
           <div className="card" style={{ padding: '24px', background: 'var(--primary-dark)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={20} color="white" />
                 </div>
                 <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem', color: 'white' }}>Auto-sync is enabled</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Last synced: Never</p>
                 </div>
                 <button style={{ background: 'white', color: 'var(--primary-dark)', border: 'none', padding: '6px 14px', borderRadius: 8, fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>Action Needed</button>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
