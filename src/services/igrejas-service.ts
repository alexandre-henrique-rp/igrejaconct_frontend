import apiClient from './api-client'

export interface Igreja {
  id: string
  nome: string
  cnpj?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  telefone?: string
  email?: string
  pastor?: string
  logo_url?: string
  status: string
  created_at: string
  updated_at: string
}

export const igrejasService = {
  async getAll(): Promise<Igreja[]> {
    const response = await apiClient.get<Igreja[]>('/igrejas')
    return response.data
  },

  async getById(id: string): Promise<Igreja> {
    const response = await apiClient.get<Igreja>(`/igrejas/${id}`)
    return response.data
  },
}
