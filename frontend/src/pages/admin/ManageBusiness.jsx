import React, { useState } from 'react'
import { 
  ArrowLeft, Building2, User, Phone, MapPin, 
  Trash2, Edit3, Shield, Globe, CreditCard,
  CheckCircle, FileText, Truck, Wrench
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function ManageBusiness() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  // Mock data for a single business entity
  const [business, setBusiness] = useState({
    id: id || 'B-1002',
    name: 'Sharma Logistics & Transport',
    owner: 'Rahul Sharma',
    phone: '98765 43210',
    email: 'contact@sharmatransport.com',
    role: 'transport',
    address: 'B-107, Industrial Zone, Vapi, Gujarat',
    status: 'Active',
    joinedDate: '24 Jan 2026',
    totalBills: 142,
    totalRevenue: 852000,
    plan: 'Pro'
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
    alert('Changes saved successfully!')
  }

  const handleDelete = () => {
    if(window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      navigate('/admin/users')
    }
  }

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 60 }}>
      {/* Back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} className="btn-icon">
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>Manage Entity</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, alignItems: 'start' }}>
        
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Main Info Card */}
          <div className="card" style={{ padding: 28, position: 'relative' }}>
             <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ 
                  width: 80, height: 80, borderRadius: 24, 
                  background: business.role === 'transport' ? '#FFF7ED' : '#F5F3FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                   {business.role === 'transport' ? <Truck size={36} color="#F3811E" /> : <Wrench size={36} color="#7C3AED" />}
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>{business.name}</h1>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 800,
                        background: '#DCFCE7', color: '#059669', textTransform: 'uppercase'
                      }}>{business.status}</span>
                   </div>
                   <p style={{ color: '#6B7280', margin: '4px 0 16px' }}>{business.id} • Joined {business.joinedDate}</p>
                   
                   <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(!isEditing)}>
                         <Edit3 size={16} /> Edit Details
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444', background: '#FEF2F2' }} onClick={handleDelete}>
                         <Trash2 size={16} /> Delete Business
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Details Form/View */}
          <div className="card" style={{ padding: 28 }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={18} color="var(--primary)" /> Business Information
             </h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="form-group">
                   <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} /> Owner Name</label>
                   {isEditing ? (
                     <input className="form-input" value={business.owner} onChange={e => setBusiness({...business, owner: e.target.value})} />
                   ) : (
                     <div style={{ fontWeight: 700, padding: '10px 0' }}>{business.owner}</div>
                   )}
                </div>
                <div className="form-group">
                   <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> Contact Number</label>
                   {isEditing ? (
                     <input className="form-input" value={business.phone} onChange={e => setBusiness({...business, phone: e.target.value})} />
                   ) : (
                     <div style={{ fontWeight: 700, padding: '10px 0' }}>{business.phone}</div>
                   )}
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                   <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> Registered Address</label>
                   {isEditing ? (
                     <textarea className="form-input" value={business.address} onChange={e => setBusiness({...business, address: e.target.value})} style={{ minHeight: 80 }} />
                   ) : (
                     <div style={{ fontWeight: 700, padding: '10px 0' }}>{business.address}</div>
                   )}
                </div>
             </div>
             {isEditing && (
               <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Stats & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div className="card" style={{ padding: 24, background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 20 }}>Usage Overview</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Total Bills</div>
                    <div style={{ fontWeight: 900 }}>{business.totalBills}</div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Revenue</div>
                    <div style={{ fontWeight: 900, color: '#10B981' }}>₹{business.totalRevenue.toLocaleString()}</div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Current Plan</div>
                    <div style={{ fontWeight: 900, color: 'var(--primary)', background: 'var(--primary-lighter)', padding: '2px 8px', borderRadius: 6 }}>{business.plan}</div>
                 </div>
              </div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start', background: 'white' }}>
                 <FileText size={18} /> View All Invoices
              </button>
              <button className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start', background: 'white' }}>
                 <Globe size={18} /> Login as {business.owner.split(' ')[0]}
              </button>
              <button className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start', background: 'white', color: '#EF4444' }}>
                 <Shield size={18} /> Rescind Access
              </button>
           </div>
        </div>

      </div>
    </div>
  )
}
