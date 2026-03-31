import React, { useState } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import { 
  FileText, Search, Filter, Download, 
  ArrowUpRight, Clock, CheckCircle, AlertCircle, TrendingUp
} from 'lucide-react'

export default function BillingMonitor() {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for billing monitor
  const invoices = [
    { id: 'INV-001', user: 'Sharma Transports', date: '2026-03-26', amount: 15400, tax: 2772, total: 18172, status: 'Paid', method: 'UPI' },
    { id: 'INV-002', user: 'Metro Garage', date: '2026-03-25', amount: 8400, tax: 1512, total: 9912, status: 'Pending', method: '-' },
    { id: 'INV-003', user: 'Rahul Logistics', date: '2026-03-25', amount: 45000, tax: 8100, total: 53100, status: 'Paid', method: 'Bank Transfer' },
    { id: 'INV-004', user: 'Perfect Auto', date: '2026-03-24', amount: 12000, tax: 2160, total: 14160, status: 'Partial', method: 'Cash' },
  ]

  const pieData = [
    { name: 'Paid', value: 45, color: '#16A34A' },
    { name: 'Pending', value: 25, color: '#D97706' },
    { name: 'Partial', value: 30, color: '#7C3AED' },
  ]

  const revenueData = [
    { name: '1 Mar', rev: 45000 },
    { name: '5 Mar', rev: 52000 },
    { name: '10 Mar', rev: 48000 },
    { name: '15 Mar', rev: 61000 },
    { name: '20 Mar', rev: 58000 },
    { name: '25 Mar', rev: 72000 },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>System Billing Monitor</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Full visibility over system-wide invoice generation</p>
        </div>
        <button className="btn btn-primary">
          <Download size={18} /> Export All Data
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Revenue Trends */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>System Revenue Stream</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#DCFCE7', padding: '4px 10px', borderRadius: 99 }}>+24% vs Last Month</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="rev" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Distribution */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 20 }}>Payment Status</h3>
          <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {pieData.map(d => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                  {d.name}
                </span>
                <span>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Registry */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="input-group" style={{ flex: 1 }}>
            <Search className="input-icon" size={18} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Filter by ID, Business, or Method..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
          <button className="btn btn-ghost btn-sm">
            <Filter size={16} /> Filters
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ID / Date</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Generated By</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Total Amount</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Payment Method</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>{inv.id}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.date}</p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>🏢</div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{inv.user}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ margin: 0, fontWeight: 800 }}>₹{inv.total.toLocaleString()}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>GST: ₹{inv.tax.toLocaleString()}</p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700,
                      color: inv.status === 'Paid' ? '#059669' : inv.status === 'Pending' ? '#D97706' : '#7C3AED',
                      background: inv.status === 'Paid' ? '#DCFCE7' : inv.status === 'Pending' ? '#FEF3C7' : '#EDE9FE',
                      padding: '4px 10px', borderRadius: 99
                    }}>
                      {inv.status === 'Paid' ? <CheckCircle size={12} /> : inv.status === 'Pending' ? <AlertCircle size={12} /> : <TrendingUp size={12} />}
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 500 }}>{inv.method}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button className="btn btn-icon btn-sm"><ArrowUpRight size={18} /></button>
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
