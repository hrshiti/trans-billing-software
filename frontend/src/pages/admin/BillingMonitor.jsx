import React, { useState, useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import { 
  FileText, Search, Filter, Download, 
  ArrowUpRight, Clock, CheckCircle, AlertCircle, TrendingUp,
  Calendar, CreditCard, Banknote, Landmark, MoreHorizontal,
  ChevronLeft, ChevronRight, IndianRupee
} from 'lucide-react'

export default function BillingMonitor() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateRange, setDateRange] = useState('All time')

  // Replaced with empty state for production readiness
  const [invoices, setInvoices] = useState([])

  const pieData = [
    { name: 'Paid', value: 0, color: 'var(--success)' },
    { name: 'Pending', value: 0, color: 'var(--warning)' },
    { name: 'Partial', value: 0, color: 'var(--primary)' },
  ]

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.user.toLowerCase().includes(searchTerm.toLowerCase()) || inv.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const stats = [
    { label: 'Total Billed', value: '₹0', icon: IndianRupee, color: 'var(--primary)', bg: 'var(--primary-lighter)' },
    { label: 'Settled', value: '₹0', icon: CheckCircle, color: 'var(--success)', bg: 'var(--success-light)' },
    { label: 'Outstanding', value: '₹0', icon: AlertCircle, color: 'var(--warning)', bg: 'var(--warning-light)' },
  ]

  return (
    <div className="animate-fadeIn">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
             <CreditCard size={18} color="var(--primary)" />
             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Financial Oversight</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Billing Monitor</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Centralized registry of all system-wide financial transactions</p>
        </div>
        <button className="btn btn-primary shadow-lg">
          <Download size={18} /> Export Settlement Report
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map((s, idx) => (
          <div key={idx} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={26} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{s.label}</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '2px 0 0' }}>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 24, marginBottom: 32 }}>
        {/* Settlement Distribution */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 20 }}>Payment Health</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)', fontWeight: 700 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              {pieData.map(d => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  </span>
                  <span>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
             <button className="btn btn-ghost btn-full btn-sm">Audit Details</button>
          </div>
        </div>

        {/* Global Registry */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Quick Filters */}
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '240px' }}>
              <Search className="input-icon" size={18} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by Invoice ID or Business..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 44, height: 44 }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
               <select 
                 className="form-input" 
                 style={{ width: 140, height: 44, padding: '0 12px', fontWeight: 600, fontSize: '0.8125rem' }}
                 value={statusFilter}
                 onChange={e => setStatusFilter(e.target.value)}
               >
                 <option value="All">All Status</option>
                 <option value="Paid">Paid Only</option>
                 <option value="Pending">Pending</option>
                 <option value="Partial">Partial</option>
               </select>
               
               <button className="btn btn-ghost" style={{ height: 44 }}>
                 <Calendar size={18} />
               </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reference / Date</th>
                  <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Onboarded Business</th>
                  <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Billing Total</th>
                  <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 24px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)', transition: 'all 0.2s' }} className="registry-row">
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={16} color="var(--primary)" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: '0.875rem' }}>{inv.id}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{inv.date}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{inv.user}</span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-primary)' }}>₹{inv.total.toLocaleString()}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Inc. GST ₹{inv.tax.toLocaleString()}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', fontWeight: 800,
                        color: inv.status === 'Paid' ? 'var(--success)' : inv.status === 'Pending' ? 'var(--warning)' : 'var(--primary)',
                        background: inv.status === 'Paid' ? 'var(--success-light)' : inv.status === 'Pending' ? 'var(--warning-light)' : 'var(--primary-lighter)',
                        padding: '4px 10px', borderRadius: 99, textTransform: 'uppercase'
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button className="btn btn-icon btn-sm">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer Controls */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)' }}>
             <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" disabled><ChevronLeft size={16} /></button>
                <button className="btn btn-primary btn-sm">1</button>
                <button className="btn btn-ghost btn-sm">2</button>
                <button className="btn btn-ghost btn-sm"><ChevronRight size={16} /></button>
             </div>
             <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Page 1 of {Math.max(1, Math.ceil(filteredInvoices.length / 10))} ({filteredInvoices.length} Transactions)
              </p>
          </div>
        </div>
      </div>

      <style>{`
        .registry-row:hover {
          background: rgba(124, 58, 237, 0.02);
          transform: translateX(4px);
        }
      `}</style>
    </div>
  )
}
