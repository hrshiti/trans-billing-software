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
]

const bottomNav = [
  { to: '/profile',  icon: Settings, label: 'Profile' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { sidebarCollapsed, toggleSidebar } = useApp()
  const navigate = useNavigate()

  const roleNav = user?.role === 'transport' ? transportNav
    : user?.role === 'garage' ? garageNav
    : user?.role === 'admin'  ? adminNav
    : []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const cls = sidebarCollapsed ? 'sidebar collapsed' : 'sidebar'

  return (
    <aside className={cls}>
      {/* ── Logo ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FileText size={18} color="white" strokeWidth={2.5} />
        </div>
        <span className="sidebar-brand" style={{ fontWeight: 900 }}>TRANS</span>
      </div>

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
