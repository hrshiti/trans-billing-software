import React, { useState } from 'react'
import { 
  Users, Search, Filter, MoreVertical, 
  CheckCircle, XCircle, Shield, Phone,
  ChevronLeft, ChevronRight, UserPlus, Clock,
  X, Mail, User, ShieldCheck, ShieldAlert
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

export default function UserManagement() {
  const { adminModule } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Replaced with empty state for production readiness
  const [users, setUsers] = useState([])

  const [newUser, setNewUser] = useState({ name: '', phone: '', role: adminModule })

  const tabs = ['All', 'Active', 'Pending', 'Inactive']

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm)
    const matchesTab = activeTab === 'All' || u.status === activeTab
    const matchesModule = u.role === adminModule
    return matchesSearch && matchesTab && matchesModule
  })

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
      }
      return u
    }))
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    const userToAdd = {
      id: users.length + 1,
      ...newUser,
      status: 'Active',
      plan: 'Free',
      joined: new Date().toISOString().split('T')[0]
    }
    setUsers([userToAdd, ...users])
    setShowAddModal(false)
    setNewUser({ name: '', phone: '', role: adminModule })
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>View, manage and onboard system users across modules</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Toolbar */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: 1, minWidth: '300px' }}>
            <Search className="input-icon" size={18} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search users by name, phone or business..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 44, height: 48 }}
            />
          </div>
          
          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: 4, border: '1px solid var(--border)' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px', border: 'none', background: activeTab === tab ? 'var(--surface)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700,
                  fontSize: '0.8125rem', cursor: 'pointer', transition: 'var(--transition)', borderRadius: 'var(--radius-sm)',
                  boxShadow: activeTab === tab ? 'var(--shadow-xs)' : 'none'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <button className="btn btn-ghost">
            <Filter size={18} /> More Filters
          </button>
        </div>

        {/* User Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Information</th>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Role</th>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan</th>
                <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined</th>
                <th style={{ padding: '14px 24px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }} className="table-row-hover">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ 
                        width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary-lighter), #DDD6FE)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '1rem'
                      }}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{user.name}</p>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Phone size={12} /> {user.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 800,
                      color: user.role === 'Transport' ? '#D97706' : '#7C3AED', background: user.role === 'Transport' ? '#FEF3C7' : '#EDE9FE',
                      padding: '6px 12px', borderRadius: 99
                    }}>
                      <Shield size={14} /> {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', itemsCenter: 'center', gap: 12 }}>
                       <button 
                         onClick={() => toggleStatus(user.id)}
                         style={{
                           width: 38, height: 20, borderRadius: 10, background: user.status === 'Active' ? 'var(--success)' : 'var(--text-muted)',
                           border: 'none', position: 'relative', cursor: 'pointer', transition: 'var(--transition)'
                         }}
                       >
                         <div style={{ 
                           position: 'absolute', top: 2, left: user.status === 'Active' ? 20 : 2,
                           width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                         }} />
                       </button>
                       <span style={{ 
                         fontSize: '0.75rem', fontWeight: 800, 
                         color: user.status === 'Active' ? 'var(--success)' : user.status === 'Pending' ? 'var(--warning)' : 'var(--danger)',
                         textTransform: 'uppercase', letterSpacing: '0.02em'
                       }}>
                         {user.status}
                       </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: user.plan === 'Pro' ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      {user.plan}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} /> {user.joined}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button className="btn btn-icon" onClick={() => navigate(`/admin/manage/${user.id}`)}>
                       <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                       <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Users size={32} color="var(--text-muted)" />
                       </div>
                       <div>
                         <h3 style={{ margin: 0, fontWeight: 800 }}>No users found</h3>
                         <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>Showing <b>{filteredUsers.length}</b> of <b>{users.length}</b> users</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" disabled><ChevronLeft size={16} /></button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-ghost btn-sm">2</button>
            <button className="btn btn-ghost btn-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* ── Add User Modal ── */}
      {showAddModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card animate-scaleIn" style={{ width: '100%', maxWidth: 480, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontWeight: 900 }}>Onboard New User</h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddUser} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">FULL NAME / BUSINESS NAME</label>
                  <div className="input-group">
                    <User className="input-icon" size={18} />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Sharma Transports" 
                      required
                      value={newUser.name}
                      onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">PHONE NUMBER</label>
                  <div className="input-group">
                    <Phone className="input-icon" size={18} />
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="Enter 10-digit mobile" 
                      required
                      value={newUser.phone}
                      onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">SELECT MODULE / ROLE</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                     <button 
                       type="button"
                       disabled={adminModule !== 'Transport'}
                       onClick={() => setNewUser({ ...newUser, role: 'Transport' })}
                       style={{
                         padding: '16px', borderRadius: 'var(--radius-lg)', border: `2px solid ${newUser.role === 'Transport' ? 'var(--primary)' : 'var(--border)'}`,
                         background: newUser.role === 'Transport' ? 'var(--primary-lighter)' : 'var(--surface)',
                         display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, 
                         cursor: adminModule === 'Transport' ? 'pointer' : 'not-allowed', 
                         transition: 'var(--transition)',
                         opacity: adminModule === 'Transport' ? 1 : 0.4
                       }}
                     >
                       <ShieldCheck size={24} color={newUser.role === 'Transport' ? 'var(--primary)' : 'var(--text-muted)'} />
                       <span style={{ fontWeight: 800, fontSize: '0.875rem', color: newUser.role === 'Transport' ? 'var(--primary)' : 'var(--text-secondary)' }}>Transport</span>
                     </button>
                     <button 
                       type="button"
                       disabled={adminModule !== 'Garage'}
                       onClick={() => setNewUser({ ...newUser, role: 'Garage' })}
                       style={{
                         padding: '16px', borderRadius: 'var(--radius-lg)', border: `2px solid ${newUser.role === 'Garage' ? 'var(--primary)' : 'var(--border)'}`,
                         background: newUser.role === 'Garage' ? 'var(--primary-lighter)' : 'var(--surface)',
                         display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, 
                         cursor: adminModule === 'Garage' ? 'pointer' : 'not-allowed', 
                         transition: 'var(--transition)',
                         opacity: adminModule === 'Garage' ? 1 : 0.4
                       }}
                     >
                       <ShieldAlert size={24} color={newUser.role === 'Garage' ? 'var(--primary)' : 'var(--text-muted)'} />
                       <span style={{ fontWeight: 800, fontSize: '0.875rem', color: newUser.role === 'Garage' ? 'var(--primary)' : 'var(--text-secondary)' }}>Garage</span>
                     </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost btn-full" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-full">Create User Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background: rgba(124, 58, 237, 0.02);
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
