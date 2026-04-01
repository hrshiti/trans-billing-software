import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'

// Layouts
import AuthLayout     from '../layouts/AuthLayout'
import MainLayout     from '../layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'

// Auth pages (eager)
import Login      from '../pages/auth/Login'
import AdminLogin from '../pages/auth/AdminLogin'
import OTPVerify  from '../pages/auth/OTPVerify'
import RoleSelect from '../pages/auth/RoleSelect'
import TransportRegistration from '../pages/auth/TransportRegistration'
import GarageRegistration    from '../pages/auth/GarageRegistration'

// App pages (lazy)
const Dashboard        = lazy(() => import('../pages/dashboard/Dashboard'))
const BillList         = lazy(() => import('../pages/bills/BillList'))
const CreateBill       = lazy(() => import('../pages/bills/CreateBill'))
const BillDetail       = lazy(() => import('../pages/bills/BillDetail'))
const Finance          = lazy(() => import('../pages/finance/Finance'))
const Profile          = lazy(() => import('../pages/profile/Profile'))
const BusinessProfile  = lazy(() => import('../pages/profile/BusinessProfile'))
const BankDetails      = lazy(() => import('../pages/profile/BankDetails'))
const QRCode           = lazy(() => import('../pages/profile/QRCode'))
const AddMovement      = lazy(() => import('../pages/finance/AddMovement'))

// Phase 2 — Party management
const PartyList        = lazy(() => import('../pages/parties/PartyList'))
const AddParty         = lazy(() => import('../pages/parties/AddParty'))

// Phase 2 — Transport
const TransportVehicleList = lazy(() => import('../pages/transport/VehicleList'))
const AddVehicle           = lazy(() => import('../pages/transport/AddVehicle'))
const TripManagement       = lazy(() => import('../pages/transport/TripManagement'))

// Phase 2 — Garage
const GarageVehicles = lazy(() => import('../pages/garage/GarageVehicles'))
const GarageServices = lazy(() => import('../pages/garage/GarageServices'))

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminUsers     = lazy(() => import('../pages/admin/UserManagement'))
const AdminAds       = lazy(() => import('../pages/admin/AdManager'))
const AdminBilling   = lazy(() => import('../pages/admin/BillingMonitor'))
const AdminReports   = lazy(() => import('../pages/admin/SystemReports'))
const AdminSettings  = lazy(() => import('../pages/admin/SystemSettings'))

// Specialized Admin Management
const AdminTransport = lazy(() => import('../pages/admin/TransportMgmt'))
const AdminGarage    = lazy(() => import('../pages/admin/GarageMgmt'))
const AdminManage    = lazy(() => import('../pages/admin/ManageBusiness'))

// Loader fallback
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <Loader2 size={28} color="var(--primary)" style={{ animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

export default function AppRouter() {
  const { isAuthenticated, hasRole } = useAuth()

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={
          isAuthenticated
            ? (hasRole ? <Navigate to="/dashboard" replace /> : <Navigate to="/role-select" replace />)
            : <Navigate to="/login" replace />
        } />

        {/* ── Auth (public) ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login"         element={<Login />} />
          <Route path="/admin-login"   element={<AdminLogin />} />
          <Route path="/otp"           element={<OTPVerify />} />
          <Route path="/role-select"   element={<RoleSelect />} />
          <Route path="/register/transport" element={<TransportRegistration />} />
          <Route path="/register/garage"    element={<GarageRegistration />} />
        </Route>

        {/* ── App (protected) ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Bills — Phase 3 */}
            <Route path="/bills"     element={<BillList />} />
            <Route path="/bills/new" element={<CreateBill />} />
            <Route path="/bills/:id" element={<BillDetail />} />

            {/* ── Phase 2: Parties ── */}
            <Route path="/parties"             element={<PartyList />} />
            <Route path="/parties/add"         element={<AddParty />} />
            <Route path="/parties/edit/:id"    element={<AddParty />} />
            <Route path="/parties/:id"         element={<AddParty />} />

            {/* Finance */}
            <Route path="/finance" element={<Finance />} />
            <Route path="/finance/add" element={<AddMovement />} />

            {/* Profile */}
            <Route path="/profile"             element={<Profile />} />
            <Route path="/profile/business"    element={<BusinessProfile />} />
            <Route path="/profile/bank"        element={<BankDetails />} />
            <Route path="/profile/qr"          element={<QRCode />} />

            {/* ── Transport Module ── */}
            <Route element={<ProtectedRoute requireRole="transport" />}>
              <Route path="/transport/vehicles"          element={<TransportVehicleList />} />
              <Route path="/transport/vehicles/add"      element={<AddVehicle />} />
              <Route path="/transport/vehicles/edit/:id" element={<AddVehicle />} />
              <Route path="/transport/trips"             element={<TripManagement />} />
            </Route>

            {/* ── Garage Module ── */}
            <Route element={<ProtectedRoute requireRole="garage" />}>
              <Route path="/garage/vehicles" element={<GarageVehicles />} />
              <Route path="/garage/services" element={<GarageServices />} />
            </Route>

            {/* ── Admin Module ── */}
            <Route element={<ProtectedRoute requireRole="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users"     element={<AdminUsers />} />
              <Route path="/admin/ads"       element={<AdminAds />} />
              <Route path="/admin/billing"   element={<AdminBilling />} />
              <Route path="/admin/reports"   element={<AdminReports />} />
              <Route path="/admin/settings"  element={<AdminSettings />} />
              <Route path="/admin/transport" element={<AdminTransport />} />
              <Route path="/admin/garage"    element={<AdminGarage />} />
              <Route path="/admin/manage/:id" element={<AdminManage />} />
            </Route>
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
