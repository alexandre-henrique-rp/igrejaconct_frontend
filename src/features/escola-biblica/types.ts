export interface Curso {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  categoria?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCursoDto {
  codigo: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  categoria?: string;
}

export interface UpdateCursoDto {
  nome?: string;
  descricao?: string;
  cargaHoraria?: number;
  categoria?: string;
  ativo?: boolean;
}

export interface Turma {
  id: string;
  curso_id: string;
  curso?: Curso;
  codigo: string;
  professor_id?: string;
  dataInicio: string;
  dataFim?: string;
  horario?: string;
  local?: string;
  capacidade?: number;
  vagasDisponiveis?: number;
  status: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  observacoes?: string;
  ativo: boolean;
  created_at: string;
}

export interface CreateTurmaDto {
  curso_id: string;
  codigo: string;
  professor_id?: string;
  dataInicio: string;
  dataFim?: string;
  horario?: string;
  local?: string;
  capacidade?: number;
  observacoes?: string;
}

export interface UpdateTurmaDto {
  codigo?: string;
  professor_id?: string;
  dataInicio?: string;
  dataFim?: string;
  horario?: string;
  local?: string;
  capacidade?: number;
  vagasDisponiveis?: number;
  status?: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  observacoes?: string;
  ativo?: boolean;
}

export interface Matricula {
  id: string;
  turma_id: string;
  turma?: Turma;
  membro_id: string;
  dataMatricula: string;
  status: 'ATIVA' | 'CONCLUIDA' | 'CANCELADA';
  notaFinal?: number;
  percentualFrequencia?: number;
  dataConclusao?: string;
  created_at: string;
}

export interface CreateMatriculaDto {
  turma_id: string;
  membro_id: string;
}

export interface Frequencia {
  id: string;
  turma_id: string;
  dataAula: string;
  membro_id: string;
  presente: boolean;
  observacao?: string;
  created_at: string;
}

export interface CreateFrequenciaDto {
  turma_id: string;
  membro_id: string;
  dataAula: string;
  presente: boolean;
  observacao?: string;
}

export interface Certificado {
  id: string;
  matricula_id: string;
  numero: string;
  dataEmissao: string;
  arquivo_url?: string;
  hashValidacao: string;
  assinado_por?: string;
  cargo_assinante?: string;
  observacao?: string;
  enviado_para?: string;
  enviado_em?: string;
  created_at: string;
}

export interface CreateCertificadoDto {
  matricula_id: string;
  email?: string;
  telefone?: string;
}
