import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService, User } from '@/services/auth-service'
import { tokenManager } from '@/utils/token-manager'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

/**
 * AuthProvider component - wraps the app and provides auth state
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(tokenManager.getUser())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Check if user is authenticated on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = tokenManager.getAccessToken()
      const storedUser = tokenManager.getUser()

      if (!accessToken || !storedUser) {
        setIsLoading(false)
        return
      }

      // Check if access token is expired or expiring soon
      if (tokenManager.isTokenExpiredOrExpiringSoon(accessToken)) {
        try {
          await refreshToken()
        } catch {
          tokenManager.clearTokens()
          setUser(null)
        }
      } else {
        // We have a valid token and user in storage
        setUser(storedUser)
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  /**
   * Set up automatic token refresh before expiry
   */
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      const accessToken = tokenManager.getAccessToken()
      if (accessToken && tokenManager.isTokenExpiredOrExpiringSoon(accessToken)) {
        refreshToken().catch(console.error)
      }
    }, 60 * 1000) // Check every minute

    return () => clearInterval(interval)
  }, [user])

  /**
   * Refresh the access token
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    const refreshToken = tokenManager.getRefreshToken()
    const storedUser = tokenManager.getUser()
    
    if (!refreshToken || !storedUser?.id) {
      throw new Error('No refresh token or user ID available')
    }

    const response = await authService.refresh(storedUser.id, refreshToken)
    tokenManager.setTokens(response.access_token, response.refresh_token)
  }, [])

  /**
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.login(email, password)
      const { user: loggedInUser, access_token, refresh_token } = response

      tokenManager.setTokens(access_token, refresh_token)
      tokenManager.setUser(loggedInUser)
      setUser(loggedInUser)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar login'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Logout - clear state and tokens
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
    } finally {
      tokenManager.clearTokens()
      setUser(null)
      setIsLoading(false)
    }
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
