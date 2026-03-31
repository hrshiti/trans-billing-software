import React from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts'
import { 
  FileText, TrendingUp, Users, Download, 
  Calendar, ArrowRight, Share2, Printer
} from 'lucide-react'

export default function SystemReports() {
  const weeklyData = [
    { name: 'Week 1', Transport: 45, Garage: 30 },
    { name: 'Week 2', Transport: 52, Garage: 38 },
    { name: 'Week 3', Transport: 48, Garage: 45 },
    { name: 'Week 4', Transport: 61, Garage: 52 },
  ]

  const userGrowth = [
    { date: 'Jan', count: 400 },
    { date: 'Feb', count: 650 },
    { date: 'Mar', count: 1248 },
  ]

  const reports = [
    { title: 'User Activity Log', date: 'Daily', type: 'PDF' },
    { title: 'Revenue Comparison', date: 'Monthly', type: 'Excel' },
    { title: 'Tax Summary Report', date: 'Quarterly', type: 'PDF' },
    { title: 'Service Performance', date: 'Monthly', type: 'PDF' },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>System Analytics & Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Detailed performance breakdown and downloadable reports</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-sm"><Calendar size={16} /> 2026 Q1</button>
          <button className="btn btn-primary">
            <TrendingUp size={18} /> Run New analysis
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Module Performance */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 20 }}>Module Performance (Bills)</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                <Bar dataKey="Transport" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Garage" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Acquisition */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 20 }}>User Acquisition Trend</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: 'white', stroke: 'var(--primary)', strokeWidth: 3 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Generated Reports List */}
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>Available Reports</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {reports.map((report, idx) => (
          <div key={idx} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-lighter)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>{report.title}</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{report.date} • {report.type}</p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-icon btn-sm"><Printer size={16} /></button>
              <button className="btn btn-icon btn-sm"><Share2 size={16} /></button>
              <button className="btn btn-icon btn-sm"><Download size={16} /></button>
            </div>
          </div>
        ))}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', background: 'transparent', boxShadow: 'none' }}>
          <button className="btn btn-ghost btn-sm" style={{ border: 'none' }}>
            Browse All Reports <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
