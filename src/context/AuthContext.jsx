import { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = authService.getStoredUser()
    if (stored) setUser(stored)
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password)
    authService.storeSession(data)
    setUser({ id: data.id, username: data.username, email: data.email, role: data.role })
    return data
  }, [])

  const register = useCallback(async (formData) => {
    const data = await authService.register(formData)
    authService.storeSession(data)
    setUser({ id: data.id, username: data.username, email: data.email, role: data.role })
    return data
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const isAdmin     = user?.role === 'ADMIN'
  const isVolunteer = user?.role === 'VOLUNTEER' || isAdmin
  const isLoggedIn  = !!user

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isVolunteer, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}
