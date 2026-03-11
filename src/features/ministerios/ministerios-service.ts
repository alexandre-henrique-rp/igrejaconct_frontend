import apiClient from '#/services/api-client'

export interface Ministerio {
  id: string
  nome: string
  descricao?: string
  responsavel_id?: string
  responsavel?: {
    id: string
    nome_completo: string
  }
  membros?: MinisterioMembro[]
  _count?: {
    membros: number
  }
  created_at: string
  updated_at: string
}

export interface MinisterioMembro {
  id: string
  membro_id: string
  ministerio_id: string
  funcao?: string
  data_entrada: string
  membro: {
    id: string
    nome_completo: string
    telefone?: string
    foto_url?: string
  }
}

export interface CreateMinisterioDto {
  nome: string
  descricao?: string
  responsavel_id?: string
}

export interface AddMembroDto {
  membro_id: string
  funcao?: string
}

export interface Escala {
  id: string
  ministerio_id: string
  data: string
  titulo?: string
  descricao?: string
  membros?: EscalaMembro[]
  created_at: string
}

export interface EscalaMembro {
  id: string
  escala_id: string
  membro_id: string
  funcao?: string
  status: string
  justificativa?: string
  membro: {
    id: string
    nome_completo: string
    telefone?: string
    foto_url?: string
  }
}

export interface CreateEscalaDto {
  ministerio_id: string
  data: string
  titulo?: string
  descricao?: string
  membros: { membro_id: string; funcao?: string }[]
}

export interface Disponibilidade {
  id?: string
  membro_id: string
  dia_semana: number
  hora_inicio: string
  hora_fim: string
}

export interface CreateDisponibilidadeDto {
  dia_semana: number
  hora_inicio: string
  hora_fim: string
}

export const ministeriosService = {
  async getAll(): Promise<Ministerio[]> {
    const response = await apiClient.get<Ministerio[]>('/ministerios')
    return response.data
  },

  async getById(id: string): Promise<Ministerio> {
    const response = await apiClient.get<Ministerio>(`/ministerios/${id}`)
    return response.data
  },

  async create(data: CreateMinisterioDto): Promise<Ministerio> {
    const response = await apiClient.post<Ministerio>('/ministerios', data)
    return response.data
  },

  async update(id: string, data: Partial<CreateMinisterioDto>): Promise<Ministerio> {
    const response = await apiClient.patch<Ministerio>(`/ministerios/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/ministerios/${id}`)
  },

  async addMembro(ministerioId: string, data: AddMembroDto): Promise<MinisterioMembro> {
    const response = await apiClient.post<MinisterioMembro>(`/ministerios/${ministerioId}/membros`, data)
    return response.data
  },

  async removeMembro(ministerioId: string, membroId: string): Promise<void> {
    await apiClient.delete(`/ministerios/${ministerioId}/membros/${membroId}`)
  },

  async getEscalas(ministerioId: string): Promise<Escala[]> {
    const response = await apiClient.get<Escala[]>(`/ministerios/${ministerioId}/escalas`)
    return response.data
  },

  async createEscala(data: CreateEscalaDto): Promise<Escala> {
    const response = await apiClient.post<Escala>('/ministerios/escalas', data)
    return response.data
  },

  async autoFillEscala(escalaId: string): Promise<Escala> {
    const response = await apiClient.post<Escala>(`/ministerios/escalas/${escalaId}/auto-fill`)
    return response.data
  },

  async notificarEscala(escalaId: string): Promise<void> {
    await apiClient.post(`/ministerios/escalas/${escalaId}/notificar`)
  },

  async confirmarEscala(escalaMembroId: string, status: string, justificativa?: string): Promise<EscalaMembro> {
    const response = await apiClient.patch<EscalaMembro>(`/ministerios/escalas/${escalaMembroId}/confirmar`, {
      status,
      justificativa,
    })
    return response.data
  },

  async getFrequencia(ministerioId: string): Promise<any> {
    const response = await apiClient.get(`/ministerios/${ministerioId}/frequencia`)
    return response.data
  },

  async getDisponibilidade(membroId: string): Promise<Disponibilidade[]> {
    const response = await apiClient.get<Disponibilidade[]>(`/ministerios/membros/${membroId}/disponibilidade`)
    return response.data
  },

  async updateDisponibilidade(membroId: string, data: CreateDisponibilidadeDto[]): Promise<void> {
    await apiClient.post(`/ministerios/membros/${membroId}/disponibilidade`, data)
  },
}
