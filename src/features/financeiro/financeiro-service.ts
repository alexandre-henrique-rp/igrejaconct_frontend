import api from '../../services/api-client';
import type { 
  Conta, CreateContaDto, UpdateContaDto,
  Categoria, CreateCategoriaDto, UpdateCategoriaDto,
  Lancamento, CreateLancamentoDto, UpdateLancamentoDto
} from './types';

export const financeiroService = {
  // Contas
  async getContas(includeInactive = false) {
    const response = await api.get<Conta[]>(`/financeiro/contas?includeInactive=${includeInactive}`);
    return response.data;
  },

  async getConta(id: string) {
    const response = await api.get<Conta>(`/financeiro/contas/${id}`);
    return response.data;
  },

  async createConta(data: CreateContaDto) {
    const response = await api.post<Conta>('/financeiro/contas', data);
    return response.data;
  },

  async updateConta(id: string, data: UpdateContaDto) {
    const response = await api.patch<Conta>(`/financeiro/contas/${id}`, data);
    return response.data;
  },

  async deleteConta(id: string) {
    await api.delete(`/financeiro/contas/${id}`);
  },

  // Categorias
  async getCategorias(tipo?: 'RECEITA' | 'DESPESA') {
    const params = tipo ? `?tipo=${tipo}` : '';
    const response = await api.get<Categoria[]>(`/financeiro/categorias${params}`);
    return response.data;
  },

  async getCategoria(id: string) {
    const response = await api.get<Categoria>(`/financeiro/categorias/${id}`);
    return response.data;
  },

  async createCategoria(data: CreateCategoriaDto) {
    const response = await api.post<Categoria>('/financeiro/categorias', data);
    return response.data;
  },

  async updateCategoria(id: string, data: UpdateCategoriaDto) {
    const response = await api.patch<Categoria>(`/financeiro/categorias/${id}`, data);
    return response.data;
  },

  async deleteCategoria(id: string) {
    await api.delete(`/financeiro/categorias/${id}`);
  },

  // Lançamentos
  async getLancamentos(filters?: {
    conta_id?: string;
    categoria_id?: string;
    tipo?: 'RECEITA' | 'DESPESA';
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.conta_id) params.append('conta_id', filters.conta_id);
    if (filters?.categoria_id) params.append('categoria_id', filters.categoria_id);
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const response = await api.get<Lancamento[]>(`/financeiro/lancamentos?${params.toString()}`);
    return response.data;
  },

  async getLancamento(id: string) {
    const response = await api.get<Lancamento>(`/financeiro/lancamentos/${id}`);
    return response.data;
  },

  async createLancamento(data: CreateLancamentoDto) {
    const response = await api.post<Lancamento>('/financeiro/lancamentos', data);
    return response.data;
  },

  async updateLancamento(id: string, data: UpdateLancamentoDto) {
    const response = await api.patch<Lancamento>(`/financeiro/lancamentos/${id}`, data);
    return response.data;
  },

  async deleteLancamento(id: string) {
    await api.delete(`/financeiro/lancamentos/${id}`);
  },

  async approveLancamento(id: string, p0: string) {
    const response = await api.post<Lancamento>(`/financeiro/lancamentos/${id}/aprovar`);
    return response.data;
  },

  async rejectLancamento(id: string, motivo: string) {
    const response = await api.post<Lancamento>(`/financeiro/lancamentos/${id}/rejeitar`, { motivo });
    return response.data;
  },
};
