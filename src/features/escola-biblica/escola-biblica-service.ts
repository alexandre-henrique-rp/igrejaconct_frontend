import api from '../../services/api-client';
import type { 
  Curso, CreateCursoDto, UpdateCursoDto,
  Turma, CreateTurmaDto, UpdateTurmaDto,
  Matricula, CreateMatriculaDto,
  Frequencia, CreateFrequenciaDto,
  Certificado, CreateCertificadoDto
} from './types';

export const escolaBiblicaService = {
  // Cursos
  async getCursos(includeInactive = false) {
    const response = await api.get<Curso[]>(`/escola/cursos?includeInactive=${includeInactive}`);
    return response.data;
  },

  async getCurso(id: string) {
    const response = await api.get<Curso>(`/escola/cursos/${id}`);
    return response.data;
  },

  async createCurso(data: CreateCursoDto) {
    const response = await api.post<Curso>('/escola/cursos', data);
    return response.data;
  },

  async updateCurso(id: string, data: UpdateCursoDto) {
    const response = await api.patch<Curso>(`/escola/cursos/${id}`, data);
    return response.data;
  },

  async deleteCurso(id: string) {
    await api.delete(`/escola/cursos/${id}`);
  },

  // Turmas
  async getTurmas(includeInactive = false) {
    const response = await api.get<Turma[]>(`/escola/turmas?includeInactive=${includeInactive}`);
    return response.data;
  },

  async getTurma(id: string) {
    const response = await api.get<Turma>(`/escola/turmas/${id}`);
    return response.data;
  },

  async createTurma(data: CreateTurmaDto) {
    const response = await api.post<Turma>('/escola/turmas', data);
    return response.data;
  },

  async updateTurma(id: string, data: UpdateTurmaDto) {
    const response = await api.patch<Turma>(`/escola/turmas/${id}`, data);
    return response.data;
  },

  async deleteTurma(id: string) {
    await api.delete(`/escola/turmas/${id}`);
  },

  async getTurmaMatriculas(turmaId: string) {
    const response = await api.get<Matricula[]>(`/escola/turmas/${turmaId}/matriculas`);
    return response.data;
  },

  // Matrículas
  async getMatriculas(filters?: { turmaId?: string; membroId?: string; status?: string }) {
    const params = new URLSearchParams();
    if (filters?.turmaId) params.append('turmaId', filters.turmaId);
    if (filters?.membroId) params.append('membroId', filters.membroId);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get<Matricula[]>(`/escola/matriculas?${params.toString()}`);
    return response.data;
  },

  async getMatricula(id: string) {
    const response = await api.get<Matricula>(`/escola/matriculas/${id}`);
    return response.data;
  },

  async createMatricula(data: CreateMatriculaDto) {
    const response = await api.post<Matricula>('/escola/matriculas', data);
    return response.data;
  },

  async updateMatricula(id: string, data: any) {
    const response = await api.patch<Matricula>(`/escola/matriculas/${id}`, data);
    return response.data;
  },

  async deleteMatricula(id: string) {
    await api.delete(`/escola/matriculas/${id}`);
  },

  async concluirMatricula(id: string) {
    const response = await api.post<Matricula>(`/escola/matriculas/${id}/concluir`);
    return response.data;
  },

  // Frequência
  async getFrequencias(turmaId: string, dataAula: string) {
    const response = await api.get<Frequencia[]>(`/escola/frequencia/turma/${turmaId}/data/${dataAula}`);
    return response.data;
  },

  async createFrequencia(data: CreateFrequenciaDto) {
    const response = await api.post<Frequencia>('/escola/frequencia', data);
    return response.data;
  },

  async updateFrequencia(id: string, presente: boolean, observacao?: string) {
    const response = await api.patch<Frequencia>(`/escola/frequencia/${id}`, { presente, observacao });
    return response.data;
  },

  async deleteFrequencia(id: string) {
    await api.delete(`/escola/frequencia/${id}`);
  },

  async getPercentualFrequencia(turmaId: string, membroId: string) {
    const response = await api.get<number>(`/escola/frequencia/percentual/${turmaId}/${membroId}`);
    return response.data;
  },

  // Certificados
  async getCertificados(matriculaId?: string) {
    const params = matriculaId ? `?matriculaId=${matriculaId}` : '';
    const response = await api.get<Certificado[]>(`/escola/certificados${params}`);
    return response.data;
  },

  async getCertificado(id: string) {
    const response = await api.get<Certificado>(`/escola/certificados/${id}`);
    return response.data;
  },

  async getCertificadoByNumero(numero: string) {
    const response = await api.get<Certificado>(`/escola/certificados/numero/${numero}`);
    return response.data;
  },

  async generateCertificado(data: CreateCertificadoDto) {
    const response = await api.post<Certificado>('/escola/certificados/gerar', data);
    return response.data;
  },

  async verificarCertificado(id: string) {
    const response = await api.get(`/escola/certificados/${id}/verificar`);
    return response.data;
  },
};
