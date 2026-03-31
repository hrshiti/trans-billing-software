import React, { useMemo } from 'react'
import { Wrench, Car, User, TrendingUp, Clock, AlertTriangle, ArrowRight, Plus } from 'lucide-react'
import { useBills } from '../../context/BillContext'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'

export default function GarageDashboard() {
  const { bills } = useBills()
  const navigate = useNavigate()

  const garageBills = useMemo(() => bills.filter(b => b.type === 'garage'), [bills])

  const stats = useMemo(() => {
    const totalService = garageBills.reduce((s, b) => s + (b.grandTotal || 0), 0)
    const pendingAmount = garageBills.filter(b => b.status !== 'paid').reduce((s, b) => s + (b.grandTotal || 0), 0)
    const servicesDone = garageBills.length
    const reminders = garageBills.filter(b => b.nextServiceKm).length

    return [
      { label: 'Total Sales', value: `₹${totalService.toLocaleString()}`, sub: 'From all job cards', icon: TrendingUp, color: '#16A34A', bg: '#DCFCE7' },
      { label: 'Receivables', value: `₹${pendingAmount.toLocaleString()}`, sub: 'Payment pending', icon: Clock, color: '#DC2626', bg: '#FEE2E2' },
      { label: 'Services Done', value: servicesDone.toString(), sub: 'Completed', icon: Wrench, color: '#7C3AED', bg: '#EDE9FE' },
      { label: 'Service Reminders', value: reminders.toString(), sub: 'Upcoming work', icon: AlertTriangle, color: '#D97706', bg: '#FEF3C7' },
    ]
  }, [garageBills])

  const chartData = useMemo(() => {
    return garageBills.slice(-7).map(b => ({
      date: dayjs(b.billDate).format('D MMM'),
      amount: b.grandTotal
    }))
  }, [garageBills])

  return (
    <div className="page-wrapper animate-fadeIn">
      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 24, padding: '24px', color: 'white', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Garage Dashboard</h1>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: 4 }}>Manage job cards, spares, and customer vehicle services</p>
        </div>
        <Wrench size={64} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', bottom: -12, right: 12, transform: 'rotate(-15deg)' }} />
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 14px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="card" style={{ padding: '20px 16px', marginBottom: 20 }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 16 }}>Service Revenue Trend</h3>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#10B981" fill="#10B98115" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card" style={{ padding: '18px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Upcoming Services</h3>
          <button onClick={() => navigate('/bills')} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)', fontWeight: 700 }}>View All</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {garageBills.slice(0, 4).map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg)', padding: '10px 12px', borderRadius: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Car size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.customerName || 'Customer'} • {b.vehicleNo}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{dayjs(b.billDate).format('DD MMM')} • {b.vehicleModel}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹{b.grandTotal.toLocaleString()}</div>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: b.status === 'paid' ? '#16A34A' : '#DC2626' }}>{b.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => navigate('/bills/new')} className="btn btn-primary btn-lg" style={{ position: 'fixed', bottom: 84, right: 20, borderRadius: 20, boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}>
        <Plus size={20} /> New Job Card
      </button>

      <div style={{ height: 20 }} />
    </div>
  )
}
