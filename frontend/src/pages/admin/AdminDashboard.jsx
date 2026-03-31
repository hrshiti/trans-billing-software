import React, { useMemo } from 'react'
import { 
  Users, FileText, Banknote, TrendingUp, 
  ShieldCheck, AlertCircle, ArrowUpRight,
  TrendingDown, Activity, Clock
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  // Mock data for Admin KPIs
  const kpis = [
    { label: 'Total Users', value: '1,248', change: '+12%', icon: Users, color: '#4F46E5', bg: '#EEF2FF', up: true },
    { label: 'Total Invoices', value: '8,642', change: '+18%', icon: FileText, color: '#7C3AED', bg: '#EDE9FE', up: true },
    { label: 'Revenue (MTD)', value: '₹4.2L', change: '+8%', icon: Banknote, color: '#059669', bg: '#ECFDF5', up: true },
    { label: 'Active Sessions', value: '342', change: '-4%', icon: Activity, color: '#EA580C', bg: '#FFF7ED', up: false },
  ]

  const chartData = [
    { name: 'Mon', users: 120, bills: 450 },
    { name: 'Tue', users: 150, bills: 520 },
    { name: 'Wed', users: 180, bills: 610 },
    { name: 'Thu', users: 220, bills: 580 },
    { name: 'Fri', users: 190, bills: 720 },
    { name: 'Sat', users: 250, bills: 890 },
    { name: 'Sun', users: 210, bills: 810 },
  ]

  const recentUsers = [
    { id: 1, name: 'Sharma Transports', role: 'Transport', status: 'Active', joined: '2m ago' },
    { id: 2, name: 'Metro Garage', role: 'Garage', status: 'Active', joined: '15m ago' },
    { id: 3, name: 'Rahul Logistics', role: 'Transport', status: 'Pending', joined: '1h ago' },
    { id: 4, name: 'Perfect Auto', role: 'Garage', status: 'Active', joined: '3h ago' },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Command Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>System-wide performance and user analytics</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-sm"><Clock size={16} /> Last 7 Days</button>
          <button className="btn btn-primary btn-sm"><TrendingUp size={16} /> Export Report</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={24} color={kpi.color} />
              </div>
              <span style={{ 
                display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700,
                color: kpi.up ? '#059669' : '#DC2626', background: kpi.up ? '#DCFCE7' : '#FEE2E2',
                padding: '4px 8px', borderRadius: 99
              }}>
                {kpi.up ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                {kpi.change}
              </span>
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0 0' }}>{kpi.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Growth Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Growth & Activity</h3>
            <div style={{ display: 'flex', gap: 16, fontSize: '0.8125rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} /> Invoices</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} /> New Users</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBills" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="bills" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBills)" />
                <Area type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={3} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Status */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 20 }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck color="#059669" size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>API Server</p>
                <p style={{ fontSize: '0.75rem', color: '#059669', margin: 0 }}>All systems operational</p>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity color="#2563EB" size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>Database</p>
                <p style={{ fontSize: '0.75rem', color: '#2563EB', margin: 0 }}>99.9% Up time / 12ms latency</p>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle color="#D97706" size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>Pending KYC</p>
                <p style={{ fontSize: '0.75rem', color: '#D97706', margin: 0 }}>24 users awaiting approval</p>
              </div>
              <ArrowUpRight size={16} color="var(--text-muted)" />
            </div>
          </div>
        </div>
      </div>

      {/* User Management Preview */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>New Onboardings</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/users')}>View All Users</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 0', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Business Name</th>
                <th style={{ padding: '12px 0', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Type</th>
                <th style={{ padding: '12px 0', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '12px 0', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Time</th>
                <th style={{ padding: '12px 0', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 0', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span className={`badge ${u.role === 'Transport' ? 'badge-warning' : 'badge-info'}`}>{u.role}</span>
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span>
                  </td>
                  <td style={{ padding: '16px 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{u.joined}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right' }}>
                    <button className="btn btn-icon btn-sm" onClick={() => navigate(`/admin/manage/${u.id}`)}>
                       <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
