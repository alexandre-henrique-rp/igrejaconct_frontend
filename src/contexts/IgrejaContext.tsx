import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import apiClient from '@/services/api-client'
import { useAuth } from './AuthContext'

export interface Igreja {
  id: string
  nome: string
  cnpj?: string
  endereco?: string
  cidade?: string
  estado?: string
  telefone?: string
  email?: string
  logo_url?: string
  ativo: boolean
  created_at: string
  updated_at: string
  _count?: {
    usuarios: number
    membros: number
    celulas: number
    ministerios: number
  }
}

interface IgrejaContextType {
  currentIgrejaId: string | null
  currentIgreja: Igreja | null
  isLoading: boolean
  isAdmin: boolean
  availableIgrejas: Igreja[]
  setCurrentIgreja: (igrejaId: string) => Promise<void>
  refreshAvailableIgrejas: () => Promise<void>
}

const IgrejaContext = createContext<IgrejaContextType | undefined>(undefined)

const IGREJA_STORAGE_KEY = 'igreja-connect-current-igreja'

/**
 * IgrejaProvider - Gerencia o estado de multi-tenancy (igreja atual)
 */
export function IgrejaProvider({ children }: { children: React.ReactNode }) {
   const { user, isAuthenticated } = useAuth()

   const [currentIgrejaId, setCurrentIglejaId] = useState<string | null>(() => {
    const stored = localStorage.getItem(IGREJA_STORAGE_KEY)
    return stored ? stored : null
  })
  const [currentIgreja, setCurrentIgleja] = useState<Igreja | null>(null)
  const [availableIgrejas, setAvailableIgrejas] = useState<Igreja[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const isAdmin = user?.role === 'ADMIN'

  /**
   * Fetch list of available igrejas (ADMIN only, else user's single igreja)
   */
  const fetchAvailableIgrejas = useCallback(async () => {
    if (!isAuthenticated || !user) return

    setIsLoading(true)
    try {
      if (isAdmin) {
        const response = await apiClient.get<Igreja[]>('/igrejas')
        setAvailableIgrejas(response.data)
      } else if (user.igrejaId) {
        const response = await apiClient.get<Igreja>(`/igrejas/${user.igrejaId}`)
        setAvailableIgrejas([response.data])
      } else {
        setAvailableIgrejas([])
      }
    } catch (error) {
      console.error('Failed to fetch igrejas:', error)
      setAvailableIgrejas([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, isAdmin])

   /**
   * Load current igreja details when ID changes
   */
  const loadCurrentIgreja = useCallback(async (igrejaId: string | null) => {
    if (!igrejaId) {
      setCurrentIgleja(null)
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.get<Igreja>(`/igrejas/${igrejaId}`)
      setCurrentIgleja(response.data)
    } catch (error) {
      console.error('Failed to fetch current igreja:', error)
      setCurrentIgleja(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

   /**
   * Set current igreja (switch tenant)
   */
  const setCurrentIgreja = useCallback(async (igrejaId: string) => {
    if (!isAdmin && igrejaId !== user?.igrejaId) {
      throw new Error('Não tem permissão para mudar de igreja')
    }

    setCurrentIglejaId(igrejaId)
    localStorage.setItem(IGREJA_STORAGE_KEY, igrejaId)
    await loadCurrentIgreja(igrejaId)
  }, [isAdmin, user?.igrejaId, loadCurrentIgreja])

  /**
   * Refresh available igrejas list
   */
  const refreshAvailableIgrejas = useCallback(async () => {
    await fetchAvailableIgrejas()
  }, [fetchAvailableIgrejas])

  /**
   * Initialize on mount:
   * 1. Fetch available igrejas
   * 2. Determine current igreja ID:
      - Use stored ID if exists and user has access
    - Else use user's default igreja_id
    - Else null (user without church, like admin)
   */
  useEffect(() => {
    if (!isAuthenticated || !user) return

    const initialize = async () => {
      await fetchAvailableIgrejas()

      let targetIgrejaId: string | null = currentIgrejaId

      if (!targetIgrejaId && user.igrejaId) {
        targetIgrejaId = user.igrejaId
        setCurrentIglejaId(user.igrejaId)
        localStorage.setItem(IGREJA_STORAGE_KEY, user.igrejaId)
      }

      if (targetIgrejaId) {
        await loadCurrentIgreja(targetIgrejaId)
      }
    }

    initialize()
  }, [isAuthenticated, user, fetchAvailableIgrejas, loadCurrentIgreja, currentIgrejaId])

  const value: IgrejaContextType = {
    currentIgrejaId,
    currentIgreja,
    isLoading,
    isAdmin,
    availableIgrejas,
    setCurrentIgreja,
    refreshAvailableIgrejas,
  }

  return <IgrejaContext.Provider value={value}>{children}</IgrejaContext.Provider>
}

/**
 * Hook to use igreja context
 */
export function useIgreja(): IgrejaContextType {
  const context = useContext(IgrejaContext)
  if (context === undefined) {
    throw new Error('useIgreja must be used within an IgrejaProvider')
  }
  return context
}
