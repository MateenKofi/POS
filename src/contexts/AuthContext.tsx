import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, endpoints, type User, type ApiResponse } from '@/lib/api'
import { mockUser } from '@/lib/mock-data'
const USE_MOCKS = String((import.meta as any)?.env?.VITE_USE_MOCKS ?? 'true') === 'true'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (USE_MOCKS) {
      // Presentation mode: auto-log in with mock user
      const authToken = 'mock-token'
      localStorage.setItem('authToken', authToken)
      setToken(authToken)
      setUser(mockUser)
      setIsLoading(false)
      return
    }

    // Check for existing token on app load
    const existingToken = localStorage.getItem('authToken')
    if (existingToken) {
      setToken(existingToken)
      // Fetch user profile
      fetchUserProfile(existingToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async (_authToken: string) => {
    if (USE_MOCKS) {
      setUser(mockUser)
      setIsLoading(false)
      return
    }
    try {
      const response = await api.get<ApiResponse<User>>(endpoints.auth.profile)
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      // Token might be invalid, remove it
      localStorage.removeItem('authToken')
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (_username: string, _password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      if (USE_MOCKS) {
        const authToken = 'mock-token'
        localStorage.setItem('authToken', authToken)
        setToken(authToken)
        setUser(mockUser)
        return true
      }
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        endpoints.auth.login,
        { username: _username, password: _password }
      )
      const { user: userData, token: authToken } = response.data
      setUser(userData)
      setToken(authToken)
      localStorage.setItem('authToken', authToken)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (USE_MOCKS) {
      // Presentation mode: keep mock user logged in
      const authToken = 'mock-token'
      localStorage.setItem('authToken', authToken)
      setToken(authToken)
      setUser(mockUser)
      return
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
