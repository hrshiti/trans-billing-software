import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

// ─── Mock OTP service (replace with real API later) ─────────────────────────
const mockSendOTP = async (phone) => {
  await new Promise(r => setTimeout(r, 1000))
  console.log(`OTP sent to ${phone}: 123456`)
  return { success: true, message: 'OTP sent successfully' }
}

const mockVerifyOTP = async (phone, otp) => {
  await new Promise(r => setTimeout(r, 1000))
  if (otp === '123456') {
    const savedRole = localStorage.getItem(`role_${phone}`)
    return {
      success: true,
      isNewUser: !savedRole,
      user: {
        id: `user_${phone}`,
        phone,
        name: savedRole ? 'Business Owner' : null,
        role: savedRole || null,
        businessName: null,
      }
    }
  }
  return { success: false, message: 'Invalid OTP. Try 123456' }
}

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [sendingOTP, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('billing_user')
      if (saved) setUser(JSON.parse(saved))
    } catch (_) { localStorage.removeItem('billing_user') }
    setLoading(false)
  }, [])

  const clearError = useCallback(() => setError(''), [])

  const sendOTP = useCallback(async (phone) => {
    setSending(true)
    setError('')
    try {
      return await mockSendOTP(phone)
    } catch (e) {
      setError('Failed to send OTP. Please try again.')
      return { success: false }
    } finally {
      setSending(false)
    }
  }, [])

  const verifyOTP = useCallback(async (phone, otp) => {
    setVerifying(true)
    setError('')
    try {
      const res = await mockVerifyOTP(phone, otp)
      if (res.success) {
        setUser(res.user)
        localStorage.setItem('billing_user', JSON.stringify(res.user))
      } else {
        setError(res.message)
      }
      return res
    } catch (e) {
      setError('Verification failed. Please try again.')
      return { success: false }
    } finally {
      setVerifying(false)
    }
  }, [])

  const setRole = useCallback((role) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, role, isNewUser: false }
      localStorage.setItem('billing_user', JSON.stringify(updated))
      localStorage.setItem(`role_${prev.phone}`, role)
      return updated
    })
  }, [])

  const updateProfile = useCallback((profileData) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...profileData }
      localStorage.setItem('billing_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('billing_user')
  }, [])

  const login = useCallback(async (userData) => {
    setUser(userData)
    localStorage.setItem('billing_user', JSON.stringify(userData))
    return { success: true, user: userData }
  }, [])

  const value = {
    user,
    loading,
    sendingOTP,
    verifying,
    error,
    clearError,
    sendOTP,
    verifyOTP,
    setRole,
    updateProfile,
    logout,
    login,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTransport: user?.role === 'transport',
    isGarage: user?.role === 'garage',
    hasRole: !!user?.role,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
