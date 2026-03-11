import apiClient from '#/services/api-client'
import type { Membro, MembroSummary, CreateMembroDto, UpdateMembroDto, MembrosListResponse } from './types'

export const membrosService = {
  async getAll(): Promise<Membro[]> {
    const response = await apiClient.get<Membro[]>('/membros')
    return response.data
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
    const response = await apiClient.get<Membro[]>('/membros/search', {
      params: { q: query },
    })
    return response.data
  },

  async getByType(tipo: string): Promise<Membro[]> {
    const response = await apiClient.get<Membro[]>(`/membros/tipo/${tipo}`)
    return response.data
  },

  async getDiscipulos(discipuladorId: string): Promise<MembroSummary[]> {
    const response = await apiClient.get<MembroSummary[]>(
      `/membros/${discipuladorId}/discipulos`,
    )
    return response.data
  },
}
