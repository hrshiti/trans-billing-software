import React, { useMemo, useState } from 'react'
import { 
  Users, FileText, Banknote, TrendingUp, 
  ShieldCheck, AlertCircle, ArrowUpRight,
  TrendingDown, Activity, Clock, Globe,
  Download, Filter, MoreHorizontal, UserPlus,
  Truck, Wrench, MapPin, CreditCard, ExternalLink, ChevronRight
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { adminModule, switchAdminModule } = useAuth()
  const [timeRange, setTimeRange] = useState('7d')

  // Data states (initially empty to remove static data)
  const [kpis] = useState([
    { label: 'Total Users', value: '0', change: '0%', icon: Users, color: '#6366F1', bg: '#EEF2FF', up: true, desc: 'Global' },
    { label: 'System Revenue', value: '₹0', change: '0%', icon: Banknote, color: '#10B981', bg: '#ECFDF5', up: true, desc: 'MTD' },
  ])

  // Module specific manageable data
  const transportData = {
    stats: [
      { label: 'Active Trips', val: '0', icon: Truck, color: '#F59E0B' },
      { label: 'Total Fleet', val: '0', icon: MapPin, color: '#82ca9d' },
    ],
    items: []
  }

  const garageData = {
    stats: [
      { label: 'Active Jobs', val: '0', icon: Wrench, color: '#7C3AED' },
      { label: 'Service Revenue', val: '₹0', icon: CreditCard, color: '#10B981' },
    ],
    items: []
  }

  const chartData = []

  const currentData = adminModule === 'Transport' ? transportData : garageData

  return (
    <div className="animate-fadeIn">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
             <Globe size={20} color="var(--primary)" />
             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Command Dashboard</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Admin Console</h1>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate(adminModule === 'Transport' ? '/admin/transport' : '/admin/garage')}>
            Manage {adminModule} <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {/* Global KPIs */}
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card" style={{ padding: '24px' }}>
             <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>{kpi.label}</p>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>{kpi.value}</h2>
                <div style={{ padding: '4px 10px', borderRadius: 99, background: kpi.bg, color: kpi.color, fontSize: '0.75rem', fontWeight: 800 }}>{kpi.change}</div>
             </div>
          </div>
        ))}
        
        {/* Module Specific Stats (Dynamic Based on Toggle) */}
        {currentData.stats.map((s, idx) => (
          <div key={idx} className="card animate-fadeIn" style={{ padding: '24px', borderLeft: `4px solid ${s.color}` }}>
             <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>{s.label}</p>
             <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <s.icon size={22} color={s.color} />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>{s.val}</h2>
             </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Growth Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex items-center justify-between mb-8">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>System Growth</h3>
            <select className="form-input" style={{ width: 120, height: 36, padding: '0 10px', fontSize: '0.8rem' }} value={timeRange} onChange={e => setTimeRange(e.target.value)}>
               <option value="7d">Last 7 Days</option>
               <option value="30d">Last 30 Days</option>
            </select>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)', fontWeight: 700 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Manageable Things (Dynamic Content) */}
        <div className="card animate-fadeIn" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 900 }}>{adminModule} Monitor</h3>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'var(--bg)', padding: '4px 10px', borderRadius: 99 }}>LIVE</span>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              {currentData.items.map(item => (
                <div key={item.id} style={{ 
                  padding: '16px', borderRadius: 16, background: 'var(--bg)', border: '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 14, transition: 'var(--transition)'
                }} className="item-hover">
                   <div style={{ 
                     width: 40, height: 40, borderRadius: 12, background: 'white', 
                     display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--primary)', boxShadow: 'var(--shadow-xs)' 
                   }}>
                     {item.name[0]}
                   </div>
                   <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem' }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.activity}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 800, color: item.trend.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>{item.trend}</p>
                      <span style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>{item.status}</span>
                   </div>
                </div>
              ))}
           </div>
           
           <button 
             className="btn btn-ghost btn-full btn-sm" style={{ marginTop: 20 }}
             onClick={() => navigate(adminModule === 'Transport' ? '/admin/transport' : '/admin/garage')}
           >
              Full {adminModule} View <ChevronRight size={16} />
           </button>
        </div>
      </div>

      <style>{`
        .item-hover:hover { border-color: var(--primary); background: white; transform: translateY(-2px); box-shadow: var(--shadow-sm); }
      `}</style>
    </div>
  )
}
