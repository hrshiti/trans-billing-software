import { useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Users, Car, Wrench,
  TrendingUp, Settings, LogOut, ChevronLeft,
  ChevronRight, Zap, ShieldCheck, Megaphone,
  Receipt, BarChart2, Truck
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'

// Nav items per role
const commonNav = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bills',       icon: FileText,         label: 'Bills',    badge: null },
  { to: '/parties',     icon: Users,            label: 'Parties' },
  { to: '/finance',     icon: TrendingUp,       label: 'Finance' },
]

const transportNav = [
  { to: '/transport/trips',    icon: Car,    label: 'Trips' },
  { to: '/transport/vehicles', icon: Zap,    label: 'Vehicles' },
]

const garageNav = [
  { to: '/garage/vehicles',  icon: Car,     label: 'Vehicles' },
  { to: '/garage/services',  icon: Wrench,  label: 'Services' },
]

const adminNav = [
  { to: '/admin/dashboard',  icon: ShieldCheck, label: 'Overview' },
  { to: '/admin/users',      icon: Users,        label: 'User Base' },
  { to: '/admin/transport',  icon: Truck,        label: 'Transport' },
  { to: '/admin/garage',     icon: Wrench,       label: 'Garage' },
  { to: '/admin/ads',        icon: Megaphone,    label: 'Ads' },
  { to: '/admin/billing',    icon: Receipt,      label: 'Payments' },
  { to: '/admin/reports',    icon: BarChart2,    label: 'Reports' },
  { to: '/admin/settings',   icon: Settings,     label: 'Settings' },
]

const bottomNav = [
  { to: '/profile',  icon: Settings, label: 'Profile' },
]

export default function Sidebar() {
  const { user, logout, isAdmin, adminModule, switchAdminModule } = useAuth()
  const { sidebarCollapsed, toggleSidebar } = useApp()
  const navigate = useNavigate()

  const roleNav = useMemo(() => {
    if (!user) return []
    if (user.role === 'transport') return transportNav
    if (user.role === 'garage') return garageNav
    if (user.role === 'admin') {
      return adminNav.filter(item => {
        if (adminModule === 'Transport' && item.label === 'Garage') return false
        if (adminModule === 'Garage' && item.label === 'Transport') return false
        return true
      })
    }
    return []
  }, [user, adminModule])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const cls = sidebarCollapsed ? 'sidebar collapsed' : 'sidebar'

  return (
    <aside className={cls}>
      {/* branding */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-[#9333ea] text-white">
          <FileText className="size-6" />
        </div>
        <span className="text-xl font-black italic tracking-tighter text-white">TRANS</span>
      </div>

      {/* Admin Module Toggle */}
      {isAdmin && (
        <div className="px-4 mb-6">
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.04)', padding: '5px', borderRadius: '14px',
            display: 'flex', gap: '2px', border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => switchAdminModule('Transport')}
              style={{
                flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none',
                background: adminModule === 'Transport' ? 'var(--primary)' : 'transparent',
                color: adminModule === 'Transport' ? 'white' : 'rgba(255,255,255,0.6)', 
                fontSize: '0.75rem', fontWeight: 750, cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: adminModule === 'Transport' ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none'
              }}
            >
              <Truck size={15} strokeWidth={2.5} /> Transport
            </button>
            <button
              onClick={() => switchAdminModule('Garage')}
              style={{
                flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none',
                background: adminModule === 'Garage' ? 'var(--primary)' : 'transparent',
                color: adminModule === 'Garage' ? 'white' : 'rgba(255,255,255,0.6)', 
                fontSize: '0.75rem', fontWeight: 750, cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: adminModule === 'Garage' ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none'
              }}
            >
              <Wrench size={15} strokeWidth={2.5} /> Garage
            </button>
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">

        {/* Main */}
        <span className="nav-section-label">Main</span>
        {commonNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}

        {/* Role-specific */}
        {roleNav.length > 0 && (
          <>
            <span className="nav-section-label" style={{ marginTop: 8 }}>
              {user?.role === 'transport' ? 'Transport' : user?.role === 'admin' ? 'Admin' : 'Garage'}
            </span>
            {roleNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <item.icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </>
        )}

        {/* Settings */}
        <span className="nav-section-label" style={{ marginTop: 8 }}>Settings</span>
        {bottomNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── User + Logout ── */}
      <div className="sidebar-footer">
        {/* User row */}
        <div className="nav-item" style={{ cursor: 'default', marginBottom: 4 }}>
          <div className="avatar avatar-sm">
            {user?.name?.[0]?.toUpperCase() || user?.phone?.slice(-2) || '?'}
          </div>
          <div className="nav-label" style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
              {user?.name || 'Business Owner'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
            </div>
          </div>
        </div>

        <button className="nav-item btn-icon w-full" onClick={handleLogout}>
          <LogOut size={20} className="nav-icon" style={{ color: 'rgba(255,100,100,0.8)' }} />
          <span className="nav-label" style={{ color: 'rgba(255,100,100,0.8)', fontSize: '0.875rem' }}>
            Logout
          </span>
        </button>
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        style={{
          position: 'absolute',
          top: '50%',
          right: -14,
          transform: 'translateY(-50%)',
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--primary)',
          border: '2px solid white',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 10,
        }}
      >
        {sidebarCollapsed
          ? <ChevronRight size={14} />
          : <ChevronLeft size={14} />}
      </button>
    </aside>
  )
}
