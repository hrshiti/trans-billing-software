import React, { useState } from 'react'
import { 
  Plus, Edit, Trash2, Calendar, 
  Eye, Image as ImageIcon, CheckCircle, 
  XCircle, ArrowUpRight, TrendingUp, Clock, Megaphone
} from 'lucide-react'

export default function AdManager() {
  const [activeTab, setActiveTab] = useState('Active')

  // Mock data for advertisement management
  const ads = [
    { id: 1, title: 'New Truck Insurance', type: 'Banner', location: 'Dashboard', status: 'Active', clicks: 124, impressions: 8520, expires: '2026-04-10' },
    { id: 2, title: 'Spare Parts Sale', type: 'Popup', location: 'Auth', status: 'Active', clicks: 84, impressions: 5120, expires: '2026-03-30' },
    { id: 3, title: 'Summer Service Offer', type: 'Banner', location: 'Dashboard', status: 'Paused', clicks: 0, impressions: 0, expires: '2026-05-15' },
    { id: 4, title: 'Castrol Oil Discount', type: 'Sidebar', location: 'Global', status: 'Active', clicks: 215, impressions: 12450, expires: '2026-04-20' },
  ]

  const metrics = [
    { label: 'Total Impressions', value: '26.1K', icon: Eye, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Total Clicks', value: '423', icon: TrendingUp, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Avg CTR', value: '1.6%', icon: ArrowUpRight, color: '#8B5CF6', bg: '#F5F3FF' },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Advertisement Panel</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Management of promotional banners and targeted ads</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Create New Ad
        </button>
      </div>

      {/* Ad Performance KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        {metrics.map((m, idx) => (
          <div key={idx} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <m.icon size={20} color={m.color} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{m.label}</p>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0' }}>{m.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 32 }}>
        {/* Create Ad Section Preview */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 20 }}>Ad Preview</h3>
          <div style={{ 
            aspectRatio: '16/9', background: 'var(--bg)', borderRadius: 'var(--radius-lg)', padding: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '2px dashed var(--border)', color: 'var(--text-muted)', gap: 12
          }}>
            <ImageIcon size={40} />
            <p style={{ textAlign: 'center', fontSize: '0.875rem' }}>No image uploaded. <br/> Preview will appear here.</p>
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, margin: '0 0 6px' }}>Target Audience</p>
              <select className="form-input">
                <option>All Users</option>
                <option>Transport Only</option>
                <option>Garage Only</option>
                <option>Pending KYC Users</option>
              </select>
            </div>
            <button className="btn btn-ghost btn-full"><Megaphone size={16} /> Broadcast New Ad</button>
          </div>
        </div>

        {/* Existing Ads Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Live Campaigns</h3>
            <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: 4 }}>
              {['Active', 'Paused', 'Archived'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    padding: '4px 12px', border: 'none', background: activeTab === t ? 'white' : 'transparent',
                    color: activeTab === t ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600,
                    fontSize: '0.75rem', borderRadius: 6, cursor: 'pointer', transition: 'var(--transition)'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Ad Details</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Views / Clicks</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Expires</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map(ad => (
                  <tr key={ad.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{ad.title}</p>
                      <span className="badge badge-primary" style={{ fontSize: '0.625rem', marginTop: 4 }}>{ad.type} / {ad.location}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem' }}>{ad.impressions.toLocaleString()}</p>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}>{ad.clicks} clicks</p>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontWeight: 700,
                        color: ad.status === 'Active' ? '#059669' : '#D97706', background: ad.status === 'Active' ? '#DCFCE7' : '#FEF3C7',
                        padding: '3px 8px', borderRadius: 99
                      }}>
                        {ad.status === 'Active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {ad.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {ad.expires}</div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button className="btn btn-icon btn-sm"><Edit size={16} /></button>
                        <button className="btn btn-icon btn-sm" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
