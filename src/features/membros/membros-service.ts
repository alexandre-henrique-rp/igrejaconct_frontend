import apiClient from '#/services/api-client'
import type { Membro, MembroSummary, CreateMembroDto, UpdateMembroDto, MembrosListResponse } from './types'

export interface AtividadeRecente {
  id: string
  type: string
  action: string
  user: string
  time: string
}

export const membrosService = {
  async getAll(params?: { page?: number; limit?: number; igreja_id?: string; tipo_membro?: string }): Promise<Membro[]> {
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      limit: params?.limit || 50,
    };
    
    if (params?.igreja_id) {
      queryParams.igreja_id = params.igreja_id;
    }
    
    if (params?.tipo_membro) {
      queryParams.tipo_membro = params.tipo_membro;
    }
    
    const response = await apiClient.get<MembrosListResponse>('/membros', {
      params: queryParams,
    })
    return response.data.data || response.data
  },

  async getMembros(params?: { page?: number; limit?: number }): Promise<Membro[]> {
    const response = await apiClient.get<MembrosListResponse>('/membros', {
      params: { page: params?.page || 1, limit: params?.limit || 50 },
    })
    return response.data.data || response.data
  },

  async getById(id: string): Promise<Membro> {
    const response = await apiClient.get<Membro>(`/membros/${id}`)
    return response.data
  },

  async create(data: CreateMembroDto): Promise<Membro> {
    const response = await apiClient.post<Membro>('/membros', data)
    return response.data
  },

  async update(id: string, data: UpdateMembroDto): Promise<Membro> {
    const response = await apiClient.patch<Membro>(`/membros/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/membros/${id}`)
  },

  async search(query: string): Promise<Membro[]> {
    const response = await apiClient.get<MembrosListResponse>('/membros/search', {
      params: { q: query },
    })
    return response.data.data || response.data
  },

  async getByType(tipo: string): Promise<Membro[]> {
    const response = await apiClient.get<MembrosListResponse>(`/membros/tipo/${tipo}`)
    return response.data.data || response.data
  },

  async getDiscipulos(discipuladorId: string): Promise<MembroSummary[]> {
    const response = await apiClient.get<MembroSummary[]>(
      `/membros/${discipuladorId}/discipulos`,
    )
    return response.data
  },

  async getDashboard(params?: string) {
    return apiClient.get(`/membros/dashboard${params ? `?${params}` : ''}`)
  },

  async getRecentActivities(params?: string) {
    return apiClient.get<AtividadeRecente[]>(`/membros/activities${params ? `?${params}` : ''}`)
  },
}
