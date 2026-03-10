export type Role = 'ADMIN' | 'MEMBRO' | 'MODERADOR'

export interface User {
  id: string
  email: string
  role: Role
  firstName?: string
  lastName?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
}
