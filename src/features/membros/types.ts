export type TipoMembro = 'ATIVO' | 'CONGREGADO' | 'VISITANTE' | 'AFASTADO' | 'TRANSFERIDO' | 'FALECIDO'

export type StatusMembro = 'ATIVO' | 'INATIVO'

export type Genero = 'MASCULINO' | 'FEMININO' | 'OUTRO'

export type EstadoCivil = 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'UNIAO_ESTAVEL'

export interface Membro {
  id: string
  nome_completo: string
  cpf?: string | null
  email?: string | null
  telefone: string
  whatsapp?: string | null
  foto_url?: string | null
  data_nascimento?: string | null
  genero?: string | null
  estado_civil?: string | null
  profissao?: string | null
  cep?: string | null
  endereco?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  tipo_membro: TipoMembro
  data_conversao?: string | null
  local_conversao?: string | null
  data_batismo?: string | null
  local_batismo?: string | null
  data_membro: string
  discipulador_id?: string | null
  discipulador?: MembroSummary | null
  discipulos?: MembroSummary[]
  historicos?: HistoricoMembro[]
  telegram?: MembroTelegram | null
  status: StatusMembro
  created_at: string
  updated_at: string
  igreja?: {
    id: string
    nome: string
  } | null
}

export interface MembroSummary {
  id: string
  nome_completo: string
  tipo_membro: TipoMembro
  telefone?: string | null
  email?: string | null
}

export interface CreateMembroDto {
  nome_completo: string
  cpf?: string
  email?: string
  telefone: string
  whatsapp?: string
  foto_url?: string
  data_nascimento?: string
  genero?: string
  estado_civil?: string
  profissao?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  tipo_membro?: TipoMembro
  data_conversao?: string
  local_conversao?: string
  data_batismo?: string
  local_batismo?: string
  discipulador_id?: string
}

export type UpdateMembroDto = Partial<CreateMembroDto>

export interface MembroFilters {
  tipo?: TipoMembro
  status?: StatusMembro
  search?: string
}

export interface MembrosListResponse {
  data: Membro[]
  pagination: {
    total: number
    limit: number
    offset: number
    page: number
    totalPages: number
  }
}

export interface HistoricoMembro {
  id: string
  membro_id: string
  tipo: HistoricoTipo
  descricao: string
  responsavel?: string | null
  data_ocorrencia: string
  confidencialidade: HistoricoConfidencialidade
  status: HistoricoStatus
  created_at: string
  created_by?: string | null
}

export type HistoricoTipo =
  | 'VISITA_PASTORAL'
  | 'DOENCA'
  | 'INTERNACAO'
  | 'ACONSELHAMENTO'
  | 'ORACAO'
  | 'PROBLEMA_FAMILIAR'
  | 'LUTO'
  | 'TESTEMUNHO'
  | 'PEDIDO_ORACAO'
  | 'MUDANCA_ENDERECO'
  | 'AFASTAMENTO'
  | 'RETORNO'
  | 'BATISMO'
  | 'RECONCILIACAO'
  | 'OUTRO'

export type HistoricoConfidencialidade = 'PUBLICO' | 'RESTRITO' | 'PRIVADO'

export type HistoricoStatus = 'ABERTO' | 'EM_ACOMPANHAMENTO' | 'ENCERRADO'

export interface MembroTelegram {
  id: string
  membro_id: string
  chat_id: string
  username?: string | null
  primeiro_nome?: string | null
  ultimo_nome?: string | null
  preferencias?: Record<string, unknown> | null
  vinculado_em: string
}
