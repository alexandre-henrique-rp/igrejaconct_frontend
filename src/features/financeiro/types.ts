export interface Conta {
  id: string;
  nome: string;
  tipo: 'CORRENTE' | 'POUPANCA' | 'DINHEIRO' | 'CARTAO' | 'OUTRO';
  saldo: number;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContaDto {
  nome: string;
  tipo: 'CORRENTE' | 'POUPANCA' | 'DINHEIRO' | 'CARTAO' | 'OUTRO';
  descricao?: string;
}

export interface UpdateContaDto {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: 'RECEITA' | 'DESPESA';
  cor?: string;
  parent_id?: string;
  ativo: boolean;
  created_at: string;
}

export interface CreateCategoriaDto {
  nome: string;
  tipo: 'RECEITA' | 'DESPESA';
  cor?: string;
  parent_id?: string;
}

export interface UpdateCategoriaDto {
  nome?: string;
  cor?: string;
  parent_id?: string;
  ativo?: boolean;
}

export interface Lancamento {
  id: string;
  tipo: 'RECEITA' | 'DESPESA';
  valor: number;
  descricao: string;
  data: string;
  status: 'PENDENTE_APROVACAO' | 'APROVADO' | 'REJEITADO';
  conta_id: string;
  conta?: Conta;
  categoria_id: string;
  categoria?: Categoria;
  membro_id?: string;
  comprovante_id?: string;
  created_at: string;
}

export interface CreateLancamentoDto {
  tipo: 'RECEITA' | 'DESPESA';
  valor: number;
  descricao: string;
  data: string;
  conta_id: string;
  categoria_id: string;
  membro_id?: string;
  comprovante_id?: string;
}

export interface UpdateLancamentoDto {
  descricao?: string;
  valor?: number;
  data?: string;
  status?: 'PENDENTE_APROVACAO' | 'APROVADO' | 'REJEITADO';
}
