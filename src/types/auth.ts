export enum Role {
  ADMIN = 'ADMIN',
  ADMIN_MASTER = 'ADMIN_MASTER',
  PASTOR = 'PASTOR',
  SECRETARIO = 'SECRETARIO',
  TESOUREIRO = 'TESOUREIRO',
  LIDER_MINISTERIO = 'LIDER_MINISTERIO',
  LIDER_CELULA = 'LIDER_CELULA',
  DISCIPULADOR = 'DISCIPULADOR',
  MEMBRO = 'MEMBRO',
  MODERADOR = 'MODERADOR',
}

export interface User {
  id: string
  email: string
  role: Role
  firstName?: string
  lastName?: string
  membro_id?: string
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
