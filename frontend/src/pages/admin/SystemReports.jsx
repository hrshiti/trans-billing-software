import React, { useState } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, Legend,
  AreaChart, Area
} from 'recharts'
import { 
  FileText, TrendingUp, Users, Download, 
  Calendar, ArrowRight, Share2, Printer,
  Activity, PieChart as PieIcon, Filter,
  Search, ChevronRight, CheckCircle, AlertTriangle
} from 'lucide-react'

export default function SystemReports() {
  const [activeReport, setActiveReport] = useState('Overview')

  const [weeklyData, setWeeklyData] = useState([])
  const [userGrowth, setUserGrowth] = useState([])
  const [reports, setReports] = useState([])
  const [activityLog, setActivityLog] = useState([])

  return (
    <div className="animate-fadeIn">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
             <Activity size={18} color="var(--primary)" />
             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>System Analytics</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Analytics & Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Detailed performance breakdown and system telemetry</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost"><Calendar size={18} /> FY 2026-27</button>
          <button className="btn btn-primary shadow-lg">
            <TrendingUp size={18} /> Run Deep Analysis
          </button>
        </div>
      </div>

      {/* ── Report Tabs ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
         {['Overview', 'Financial', 'Users', 'System Logs'].map(tab => (
           <button 
             key={tab} 
             onClick={() => setActiveReport(tab)}
             style={{ 
               padding: '8px 20px', borderRadius: 99, border: 'none', fontSize: '0.875rem', fontWeight: 700, 
               background: activeReport === tab ? 'var(--primary)' : 'transparent',
               color: activeReport === tab ? 'white' : 'var(--text-muted)',
               cursor: 'pointer', transition: 'var(--transition)'
             }}
           >
             {tab}
           </button>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Revenue Performance Area Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Revenue Performance</h3>
             <div style={{ display: 'flex', itemsCenter: 'center', gap: 20 }}>
                <div style={{ display: 'flex', itemsCenter: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Revenue (₹)</span>
                </div>
             </div>
          </div>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Acquisition Line Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Module Distribution</h3>
             <button className="btn btn-ghost btn-sm"><Filter size={14} /> Filter</button>
          </div>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20, fontWeight: 700, fontSize: '0.875rem' }} />
                <Bar dataKey="Transport" fill="#F59E0B" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="Garage" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Activity Log */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: '1.125rem', fontWeight: 900 }}>Activity Telemetry</h3>
             <button className="btn btn-ghost btn-sm">View Full Log</button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {activityLog.map((log) => (
              <div key={log.id} style={{ 
                padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16,
                borderBottom: log.id !== activityLog.length ? '1px solid var(--border)' : 'none',
                transition: 'var(--transition)', cursor: 'default'
              }} className="log-row">
                 <div style={{ 
                   width: 10, height: 10, borderRadius: '50%', 
                   background: log.type === 'success' ? 'var(--success)' : log.type === 'warning' ? 'var(--warning)' : log.type === 'danger' ? 'var(--danger)' : 'var(--info)'
                 }} />
                 <div style={{ flex: 1 }}>
                   <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{log.action} <span style={{ color: 'var(--primary)' }}>{log.target}</span></p>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>By {log.user} • {log.time}</p>
                 </div>
                 <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* Downloadable Assets */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 900, marginBottom: 20 }}>Resource Center</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
             {reports.map((report, idx) => (
               <div key={idx} style={{ 
                 padding: '16px', borderRadius: 16, border: '1.5px solid var(--border)', 
                 display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s'
               }} className="report-card">
                  <div style={{ 
                    width: 44, height: 44, borderRadius: 12, background: 'var(--bg-alt)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <FileText size={20} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0 }}>{report.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{report.date} • {report.size}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-icon btn-sm"><Download size={18} /></button>
                    <button className="btn btn-icon btn-sm"><Printer size={18} /></button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <style>{`
        .log-row:hover { background: var(--bg); }
        .report-card:hover { border-color: var(--primary); background: var(--bg); box-shadow: var(--shadow-sm); }
      `}</style>
    </div>
  )
}
