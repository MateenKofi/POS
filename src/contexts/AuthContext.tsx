import React, { createContext, useContext, useState, useEffect } from 'react'
import type { AuthContextType, AuthProviderProps, User, ApiResponse } from '@/lib/types'
import { api, endpoints } from '@/lib/api'
import { mockUser, authenticateMockUser } from '@/lib/mock-data'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const USE_MOCKS = String((import.meta as any)?.env?.VITE_USE_MOCKS ?? 'true') === 'true'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (USE_MOCKS) {
      // In mock mode, check if there's a stored user
      const storedUser = localStorage.getItem('mockUser')
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setToken('mock-token')
        } catch {
          localStorage.removeItem('mockUser')
        }
      }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const authenticatedUser = authenticateMockUser(_username, _password)
      if (authenticatedUser) {
        const authToken = 'mock-token'
        localStorage.setItem('authToken', authToken)
        localStorage.setItem('mockUser', JSON.stringify(authenticatedUser))
        setToken(authToken)
        setUser(authenticatedUser)
        return true
      }
      return false
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
      // Clear mock user session
      localStorage.removeItem('authToken')
      localStorage.removeItem('mockUser')
      setUser(null)
      setToken(null)
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
