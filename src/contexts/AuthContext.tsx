import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, endpoints, type User, type ApiResponse } from '@/lib/api'

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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        endpoints.auth.login,
        { username, password }
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
