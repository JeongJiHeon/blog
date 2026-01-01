import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authApi } from '@/lib/api'
import type { Admin } from '@/types'

interface AuthContextType {
  isAuthenticated: boolean
  admin: Admin | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authApi
        .getMe()
        .then((adminData) => {
          setAdmin(adminData)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ username, password })
      localStorage.setItem('token', response.access_token)
      setAdmin(response.admin)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!admin,
        admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
