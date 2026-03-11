import apiClient from '#/services/api-client';

export interface BemPatrimonial {
  id: string;
  nome: string;
  descricao?: string;
  tipo: string;
  status: string;
  numero_patrimonio?: string;
  codigo_barras?: string;
  qr_code?: string;
  etiqueta?: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  estado_conservacao?: string;
  cor?: string;
  caracteristicas?: any;
  data_aquisicao?: string;
  valor_aquisicao?: number;
  fonte?: string;
  fornecedor?: string;
  nota_fiscal?: string;
  localizacao?: string;
  responsavel_id?: string;
  responsavel?: {
    id: string;
    nome_completo: string;
    email?: string;
  };
  ultima_manutencao?: string;
  proxima_manutencao?: string;
  vida_util_meses?: number;
  garantia_ate?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: string;
    email: string;
  };
  fotos?: FotoBem[];
  emprestimos?: Emprestimo[];
  manutencoes?: Manutencao[];
  movimentacoes?: MovimentacaoPatrimonio[];
  _count?: {
    emprestimos: number;
    manutencoes: number;
    fotos: number;
  };
}

export interface FotoBem {
  id: string;
  bem_id: string;
  arquivo_id: string;
  arquivo: {
    id: string;
    nome_original: string;
    path: string;
  };
  tipo: string;
  ordem: number;
  descricao?: string;
  principal: boolean;
  created_at: string;
}

export interface Emprestimo {
  id: string;
  bem_id: string;
  membro_id: string;
  tipo: string;
  status: string;
  data_emprestimo: string;
  data_devolucao_prevista?: string;
  data_devolucao_real?: string;
  motivo?: string;
  observacoes?: string;
  termos_aceitos: boolean;
  condicao_devolucao?: string;
  multa_aplicada?: number;
  responsavel_emprestimo_id?: string;
  bem: {
    id: string;
    nome: string;
    tipo: string;
    numero_patrimonio?: string;
  };
  membro: {
    id: string;
    nome_completo: string;
  };
  responsavel_emprestimo?: {
    id: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Manutencao {
  id: string;
  bem_id: string;
  tipo: string;
  descricao: string;
  data_agendada?: string;
  data_conclusao?: string;
  responsavel_id?: string;
  responsavel?: {
    id: string;
    nome_completo: string;
  };
  fornecedor?: string;
  custo?: number;
  status: string;
  prioridade: string;
  ordem_servico?: string;
  notas_tecnicas?: string;
  created_by_id?: string;
  created_by?: {
    id: string;
    email: string;
  };
  proxima_manutencao_id?: string;
  proxima_manutencao?: Manutencao;
  created_at: string;
  updated_at: string;
}

export interface MovimentacaoPatrimonio {
  id: string;
  bem_id: string;
  tipo: string;
  descricao: string;
  emprestimo_id?: string;
  emprestimo?: Emprestimo;
  localizacao_anterior?: string;
  localizacao_nova?: string;
  responsavel_id: string;
  responsavel: {
    id: string;
    email: string;
    nome_completo?: string;
  };
  observacoes?: string;
  created_at: string;
}

export interface PatrimonioStats {
  totalBens: number;
  bensDisponiveis: number;
  bensEmprestados: number;
  bensEmManutencao: number;
  emprestimosAtivos: number;
  emprestimosAtrasados: number;
  manutencoesPendentes: number;
  manutencoesAtrasadas: number;
  movimentacoesMes: number;
}

export class PatrimonioService {
  private baseUrl = '/api/patrimonio';

  async getBens(filters?: any): Promise<BemPatrimonial[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.localizacao) params.append('localizacao', filters.localizacao);
    if (filters?.responsavel_id) params.append('responsavel_id', filters.responsavel_id);
    if (filters?.search) params.append('search', filters.search);

    const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl;
    const response = await apiClient.get(url);
    return response.data;
  }

  async getBemById(id: string): Promise<BemPatrimonial> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createBem(data: FormData): Promise<BemPatrimonial> {
    const response = await apiClient.post(this.baseUrl, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateBem(id: string, data: FormData): Promise<BemPatrimonial> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteBem(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async addBemFoto(bemId: string, arquivo_id: string, tipo?: string, ordem?: number, descricao?: string) {
    const response = await apiClient.post(`${this.baseUrl}/${bemId}/fotos`, {
      arquivo_id,
      tipo: tipo || 'FOTO',
      ordem: ordem || 0,
      descricao,
    });
    return response.data;
  }

  async removeBemFoto(bemId: string, fotoId: string) {
    await apiClient.delete(`${this.baseUrl}/${bemId}/fotos/${fotoId}`);
  }

  // Empréstimos
  async getEmprestimosAtivos(): Promise<Emprestimo[]> {
    const response = await apiClient.get(`${this.baseUrl}/emprestimos?ativos=true`);
    return response.data;
  }

  async getEmprestimosByBem(bemId: string): Promise<Emprestimo[]> {
    const response = await apiClient.get(`${this.baseUrl}/${bemId}/emprestimos`);
    return response.data;
  }

  async createEmprestimo(data: any): Promise<Emprestimo> {
    const response = await apiClient.post(`${this.baseUrl}/emprestimos`, data);
    return response.data;
  }

  async registerReturn(emprestimoId: string, data: any): Promise<Emprestimo> {
    const response = await apiClient.post(`${this.baseUrl}/emprestimos/${emprestimoId}/devolucao`, data);
    return response.data;
  }

  async cancelEmprestimo(emprestimoId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/emprestimos/${emprestimoId}`);
  }

  // Manutenções
  async getManutencoes(filters?: any): Promise<Manutencao[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.prioridade) params.append('prioridade', filters.prioridade);
    if (filters?.bem_id) params.append('bem_id', filters.bem_id);

    const url = params.toString() ? `${this.baseUrl}/manutencoes?${params}` : `${this.baseUrl}/manutencoes`;
    const response = await apiClient.get(url);
    return response.data;
  }

  async getManutencoesByBem(bemId: string): Promise<Manutencao[]> {
    return this.getManutencoes({ bem_id: bemId });
  }

  async createManutencao(data: any): Promise<Manutencao> {
    const response = await apiClient.post(`${this.baseUrl}/manutencoes`, data);
    return response.data;
  }

  async completeManutencao(id: string, data: any): Promise<Manutencao> {
    const response = await apiClient.post(`${this.baseUrl}/manutencoes/${id}/completar`, data);
    return response.data;
  }

  // Movimentações
  async getMovimentacoes(bemId?: string, tipo?: string, limite: number = 50): Promise<MovimentacaoPatrimonio[]> {
    const params = new URLSearchParams();
    if (bemId) params.append('bem_id', bemId);
    if (tipo) params.append('tipo', tipo);
    params.append('limite', limite.toString());

    const url = `${this.baseUrl}/movimentacoes?${params.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  // Estatísticas
  async getEstatisticas(): Promise<PatrimonioStats> {
    const response = await apiClient.get(`${this.baseUrl}/estatisticas`);
    return response.data;
  }
}

export const patrimonioService = new PatrimonioService();