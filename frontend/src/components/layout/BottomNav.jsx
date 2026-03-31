import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Plus, Users, UserCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function BottomNav() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/bills',     icon: FileText,        label: 'Bills' },
    // center FAB — handled separately
    { to: '/parties',   icon: Users,           label: 'Parties' },
    { to: '/profile',   icon: UserCircle,      label: 'Profile' },
  ]

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom navigation">
      <div className="bottom-nav-inner">
        {/* Home */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <div className="bottom-nav-icon-wrap">
            <LayoutDashboard size={24} />
          </div>
          <span className="bottom-nav-label">Home</span>
        </NavLink>

        {/* Bills */}
        <NavLink
          to="/bills"
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <div className="bottom-nav-icon-wrap">
            <FileText size={24} />
          </div>
          <span className="bottom-nav-label">Bills</span>
        </NavLink>

        {/* Center FAB — Create New Bill */}
        <button
          className="bottom-nav-fab"
          id="btn-create-new"
          aria-label="Create new bill"
          onClick={() => navigate('/bills/new')}
        >
          <div className="fab-btn">
            <Plus size={26} color="white" strokeWidth={2.8} />
          </div>
          <span>New</span>
        </button>

        {/* Parties */}
        <NavLink
          to="/parties"
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <div className="bottom-nav-icon-wrap">
            <Users size={24} />
          </div>
          <span className="bottom-nav-label">Parties</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <div className="bottom-nav-icon-wrap">
            <UserCircle size={24} />
          </div>
          <span className="bottom-nav-label">Profile</span>
        </NavLink>
      </div>
    </nav>
  )
}
