import apiClient from './api-client'
import { tokenManager } from '@/utils/token-manager'
import type { Role } from '@/types/auth'

export interface User {
  id: string
  email: string
  role: Role
  firstName?: string
  lastName?: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
}

/**
 * Authentication service - handles all auth-related API calls
 */
export const authService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  /**
   * Register a new user
   */
  async register(email: string, password: string, name: string): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', {
      email,
      password,
      name,
    })
    return response.data
  },

  /**
   * Refresh access token using refresh token
   */
  async refresh(userId: string, refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const response = await apiClient.post<{ access_token: string; refresh_token: string }>('/auth/refresh', {
      userId,
      refreshToken,
    })
    return response.data
  },

  /**
   * Logout - invalidates tokens on server
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = tokenManager.getRefreshToken()
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken })
      }
    } finally {
      tokenManager.clearTokens()
    }
  },

  /**
   * Get current user profile (not implemented on backend yet, but kept as placeholder)
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile')
    return response.data
  },
}
