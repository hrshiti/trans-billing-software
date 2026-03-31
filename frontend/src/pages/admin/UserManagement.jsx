import React, { useState } from 'react'
import { 
  Users, Search, Filter, MoreVertical, 
  CheckCircle, XCircle, Shield, Phone,
  ChevronLeft, ChevronRight, UserPlus, Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UserManagement() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  // Mock data for user management
  const users = [
    { id: 1, name: 'Rahul Logistics', phone: '9876543210', role: 'Transport', status: 'Active', plan: 'Free', joined: '2026-03-24' },
    { id: 2, name: 'Sharma Motors', phone: '8765432109', role: 'Garage', status: 'Active', plan: 'Pro', joined: '2026-03-22' },
    { id: 3, name: 'Quick Fix Auto', phone: '7654321098', role: 'Garage', status: 'Pending', plan: 'Free', joined: '2026-03-25' },
    { id: 4, name: 'Viking Transport', phone: '6543210987', role: 'Transport', status: 'Inactive', plan: 'Trial', joined: '2026-03-20' },
    { id: 5, name: 'Sai Services', phone: '5432109876', role: 'Garage', status: 'Active', plan: 'Pro', joined: '2026-03-18' },
    { id: 6, name: 'Jaguar Fast', phone: '4321098765', role: 'Transport', status: 'Active', plan: 'Free', joined: '2026-03-15' },
  ]

  const tabs = ['All', 'Active', 'Pending', 'Inactive']

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm)
    const matchesTab = activeTab === 'All' || u.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>View, manage and onboard system users</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="input-group" style={{ flex: 1 }}>
            <Search className="input-icon" size={18} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px', border: 'none', background: activeTab === tab ? 'var(--primary-lighter)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === tab ? 700 : 600,
                  fontSize: '0.8125rem', cursor: 'pointer', transition: 'var(--transition)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* User Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>User / Business</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Plan</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joined On</th>
                <th style={{ padding: '12px 24px', textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-lighter)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)'
                      }}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>{user.name}</p>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Phone size={12} /> {user.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700,
                      color: user.role === 'Transport' ? '#D97706' : '#7C3AED', background: user.role === 'Transport' ? '#FEF3C7' : '#EDE9FE',
                      padding: '4px 10px', borderRadius: 99
                    }}>
                      <Shield size={12} /> {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700,
                      color: user.status === 'Active' ? '#059669' : user.status === 'Pending' ? '#D97706' : '#DC2626',
                      background: user.status === 'Active' ? '#DCFCE7' : user.status === 'Pending' ? '#FEF3C7' : '#FEE2E2',
                      padding: '4px 10px', borderRadius: 99
                    }}>
                      {user.status === 'Active' ? <CheckCircle size={12} /> : user.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: user.plan === 'Pro' ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      {user.plan}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {user.joined}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button className="btn btn-icon btn-sm" onClick={() => navigate(`/admin/manage/${user.id}`)}>
                       <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Showing <b>1-6</b> of <b>142</b> users</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" disabled><ChevronLeft size={16} /></button>
            <button className="btn btn-ghost btn-sm" style={{ background: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }}>1</button>
            <button className="btn btn-ghost btn-sm">2</button>
            <button className="btn btn-ghost btn-sm">3</button>
            <button className="btn btn-ghost btn-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
