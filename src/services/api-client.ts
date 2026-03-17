import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { tokenManager } from '@/utils/token-manager'

// API base URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Refresh token state management
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

/**
 * Process queue after token refresh
 */
function processQueue(error: any, token: string | null = null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

async function ensureValidToken(reqUrl?: string): Promise<string | null> {
  if (reqUrl?.includes('/auth/logout')) {
    return tokenManager.getAccessToken()
  }
  
  const accessToken = tokenManager.getAccessToken()
  
  if (!accessToken) {
    return null
  }
  
  if (tokenManager.isTokenExpiredOrExpiringSoon(accessToken)) {
    const refreshToken = tokenManager.getRefreshToken()
    const user = tokenManager.getUser()
    
    if (!refreshToken || !user?.id) {
      return null
    }
    
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
        userId: user.id
      })
      
      const { access_token, refresh_token } = response.data
      tokenManager.setTokens(access_token, refresh_token)
      
      const decodedAccess = tokenManager.decodeToken(access_token)
      if (decodedAccess) {
        const updatedUser = {
          ...user,
          email: decodedAccess.email || user.email,
          role: decodedAccess.role || user.role,
          igrejaId: decodedAccess.igrejaId || user.igrejaId,
        }
        tokenManager.setUser(updatedUser)
      }
      
      return access_token
    } catch (error) {
      tokenManager.clearTokens()
      window.location.href = '/login'
      return null
    }
  }
  
  return accessToken
}

/**
 * Request interceptor - add Authorization header
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await ensureValidToken(config.url)
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response interceptor - handle token refresh on 401
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest || !error.response) {
      return Promise.reject(error)
    }

    const { status } = error.response

    // Only refresh on 401 Unauthorized
    if (status === 401 && !originalRequest._retry) {
      // Don't retry if we're already trying to login or refresh
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true

        try {
          const refreshToken = tokenManager.getRefreshToken()
          const user = tokenManager.getUser()
          
          if (!refreshToken || !user?.id) {
            throw new Error('No refresh token or user ID available')
          }

          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
            userId: user.id
          })

          const { access_token, refresh_token } = response.data
          tokenManager.setTokens(access_token, refresh_token)

          const decodedAccess = tokenManager.decodeToken(access_token)
          if (decodedAccess) {
            const updatedUser = {
              ...user,
              email: decodedAccess.email || user.email,
              role: decodedAccess.role || user.role,
              igrejaId: decodedAccess.igrejaId || user.igrejaId,
            }
            tokenManager.setUser(updatedUser)
          }

          // Update Authorization header for original request
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          originalRequest.headers.Authorization = `Bearer ${access_token}`

          // Process queued requests
          processQueue(null, access_token)

          // Retry original request
          return apiClient(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          tokenManager.clearTokens()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
