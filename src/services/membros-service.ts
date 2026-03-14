import apiClient from './api-client'

export interface Membro {
  id: string
  nome_completo: string
  email?: string
  telefone?: string
  foto_url?: string
  status?: string
  tipo_membro?: string
  igreja_id?: string
  created_at?: string
  updated_at?: string
}

export interface FilterMembrosDto {
  page?: number
  limit?: number
  search?: string
  status?: string
  tipo?: string
}

export const membrosService = {
  async getAll(filter?: FilterMembrosDto): Promise<{ data: Membro[]; total: number; page: number; limit: number }> {
    const response = await apiClient.get('/membros', { params: filter })
    return response.data
  },

  async getById(id: string): Promise<Membro> {
    const response = await apiClient.get<Membro>(`/membros/${id}`)
    return response.data
  },

  async getByIgreja(igrejaId: string): Promise<Membro[]> {
    // Busca membros filtrando por igreja
    const response = await apiClient.get('/membros', { 
      params: { igreja_id: igrejaId, limit: 1000 } 
    })
    return response.data.data || []
  },

  async search(query: string, limit?: number): Promise<Membro[]> {
    const response = await apiClient.get('/membros/search', { 
      params: { q: query, limit } 
    })
    return response.data
  },
}
