export const users = {
  admin: {
    email: 'admin@test.com',
    password: 'password123',
    role: 'ADMIN',
    nome: 'Administrador Teste',
  },
  pastor: {
    email: 'pastor@test.com',
    password: 'password123',
    role: 'PASTOR',
    nome: 'Pastor Teste',
  },
  secretario: {
    email: 'secretario@test.com',
    password: 'password123',
    role: 'SECRETARIO',
    nome: 'Secretário Teste',
  },
  membro: {
    email: 'membro@test.com',
    password: 'password123',
    role: 'MEMBRO',
    nome: 'Membro Teste',
  },
}

export const churches = {
  churchA: {
    nome: 'Igreja Teste A',
    endereco: 'Rua A, 123',
    cidade: 'São Paulo',
    estado: 'SP',
  },
  churchB: {
    nome: 'Igreja Teste B',
    endereco: 'Rua B, 456',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
  },
}

export const members = {
  member1: {
    nome_completo: 'João Silva',
    email: 'joao@test.com',
    telefone: '11999999999',
    tipo_membro: 'REGULAR',
    status: 'ATIVO',
  },
}

export const events = {
  event1: {
    nome: 'Culto de Domingo',
    data_inicio: '2024-12-01T10:00:00Z',
    data_fim: '2024-12-01T12:00:00Z',
    categoria_id: 'categoria-culto',
  },
}
