import type { Role } from '@/types/auth'

export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | '*'

export interface Permission {
  resource: string
  action: PermissionAction
}

/**
 * ROLE_PERMISSIONS - Matriz completa de permissões por role
 * Baseado em: docs/rotas-permissoes-matrix.md
 *
 * Formato: Record<Role, Permission[]>
 * - resource: nome do módulo (membros, celulas, financeiro, etc)
 * - action: 'read' | 'create' | 'update' | 'delete' | '*'
 *
 * Observações:
 * - ADMIN tem todas as permissões (recurso '*', ação '*')
 * - Outras roles listam apenas permissões específicas
 * - Controle de tenant (own vs all) é tratado no backend, não aqui
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    { resource: '*', action: '*' },
  ],

  PASTOR: [
    // Membros: leitura e edição (não criar/excluir)
    { resource: 'membros', action: 'read' },
    { resource: 'membros', action: 'update' },
    // Células: CRUD completo
    { resource: 'celulas', action: 'read' },
    { resource: 'celulas', action: 'create' },
    { resource: 'celulas', action: 'update' },
    { resource: 'celulas', action: 'delete' },
    // Ministérios: CRUD completo
    { resource: 'ministerios', action: 'read' },
    { resource: 'ministerios', action: 'create' },
    { resource: 'ministerios', action: 'update' },
    { resource: 'ministerios', action: 'delete' },
    // Eventos: CRUD completo
    { resource: 'eventos', action: 'read' },
    { resource: 'eventos', action: 'create' },
    { resource: 'eventos', action: 'update' },
    { resource: 'eventos', action: 'delete' },
    // Financeiro: CRUD completo
    { resource: 'financeiro', action: 'read' },
    { resource: 'financeiro', action: 'create' },
    { resource: 'financeiro', action: 'update' },
    { resource: 'financeiro', action: 'delete' },
    // Escola Bíblica: CRUD completo
    { resource: 'escola-biblica', action: 'read' },
    { resource: 'escola-biblica', action: 'create' },
    { resource: 'escola-biblica', action: 'update' },
    { resource: 'escola-biblica', action: 'delete' },
    // Relatórios: todos
    { resource: 'relatorios', action: 'read' },
    { resource: 'relatorios', action: '*' },
    // Patrimônio: CRUD completo
    { resource: 'patrimonio', action: 'read' },
    { resource: 'patrimonio', action: 'create' },
    { resource: 'patrimonio', action: 'update' },
    { resource: 'patrimonio', action: 'delete' },
    // Arquivos: CRUD completo
    { resource: 'arquivos', action: 'read' },
    { resource: 'arquivos', action: 'create' },
    { resource: 'arquivos', action: 'update' },
    { resource: 'arquivos', action: 'delete' },
    // Notificações: ler
    { resource: 'notificacoes', action: 'read' },
    // Admin: leitura apenas
    { resource: 'admin', action: 'read' },
  ],

  SECRETARIO: [
    // Membros: CRUD completo
    { resource: 'membros', action: 'read' },
    { resource: 'membros', action: 'create' },
    { resource: 'membros', action: 'update' },
    { resource: 'membros', action: 'delete' },
    // Células: apenas leitura
    { resource: 'celulas', action: 'read' },
    // Ministérios: apenas leitura
    { resource: 'ministerios', action: 'read' },
    // Eventos: CRUD completo
    { resource: 'eventos', action: 'read' },
    { resource: 'eventos', action: 'create' },
    { resource: 'eventos', action: 'update' },
    { resource: 'eventos', action: 'delete' },
    // Financeiro: CRUD completo
    { resource: 'financeiro', action: 'read' },
    { resource: 'financeiro', action: 'create' },
    { resource: 'financeiro', action: 'update' },
    { resource: 'financeiro', action: 'delete' },
    // Escola Bíblica: CRUD completo
    { resource: 'escola-biblica', action: 'read' },
    { resource: 'escola-biblica', action: 'create' },
    { resource: 'escola-biblica', action: 'update' },
    { resource: 'escola-biblica', action: 'delete' },
    // Relatórios: apenas leitura
    { resource: 'relatorios', action: 'read' },
    // Arquivos: CRUD completo
    { resource: 'arquivos', action: 'read' },
    { resource: 'arquivos', action: 'create' },
    { resource: 'arquivos', action: 'update' },
    { resource: 'arquivos', action: 'delete' },
    // Notificações: ler
    { resource: 'notificacoes', action: 'read' },
  ],

  TESOUREIRO: [
    // Dashboard
    { resource: 'dashboard', action: 'read' },
    // Financeiro: CRUD completo
    { resource: 'financeiro', action: 'read' },
    { resource: 'financeiro', action: 'create' },
    { resource: 'financeiro', action: 'update' },
    { resource: 'financeiro', action: 'delete' },
    // Relatórios financeiros apenas
    { resource: 'relatorios', action: 'read' },
    // Notificações: ler
    { resource: 'notificacoes', action: 'read' },
  ],

  LIDER_MINISTERIO: [
    // Dashboard
    { resource: 'dashboard', action: 'read' },
    // Ministérios: leitura e edição do próprio (backend valida)
    { resource: 'ministerios', action: 'read' },
    { resource: 'ministerios', action: 'update' },
    // Membros: leitura apenas do próprio ministério
    { resource: 'membros', action: 'read' },
    // Eventos: criar e editar eventos do próprio ministério
    { resource: 'eventos', action: 'read' },
    { resource: 'eventos', action: 'create' },
    { resource: 'eventos', action: 'update' },
    // Escola Bíblica: apenas leitura
    { resource: 'escola-biblica', action: 'read' },
    // Notificações: ler
    { resource: 'notificacoes', action: 'read' },
  ],

  LIDER_CELULA: [
    // Dashboard
    { resource: 'dashboard', action: 'read' },
    // Células: leitura e edição da própria (backend valida)
    { resource: 'celulas', action: 'read' },
    { resource: 'celulas', action: 'update' },
    // Membros: leitura apenas da própria célula
    { resource: 'membros', action: 'read' },
    // Eventos: criar e editar eventos da própria célula
    { resource: 'eventos', action: 'read' },
    { resource: 'eventos', action: 'create' },
    { resource: 'eventos', action: 'update' },
    // Notificações: ler
    { resource: 'notificacoes', action: 'read' },
  ],

  DISCIPULADOR: [
    // Dashboard
    { resource: 'dashboard', action: 'read' },
    // Membros: leitura apenas dos próprios discípulos (backend valida)
    { resource: 'membros', action: 'read' },
    // Histórico pastoral: CRUD dos discípulos
    { resource: 'historico-pastoral', action: 'read' },
    { resource: 'historico-pastoral', action: 'create' },
    { resource: 'historico-pastoral', action: 'update' },
    { resource: 'historico-pastoral', action: 'delete' },
    // Notificações: ler
    { resource: 'notificacoes', action: 'read' },
  ],

  MEMBRO: [
    // Dashboard
    { resource: 'dashboard', action: 'read' },
    // Eventos: leitura e inscrição
    { resource: 'eventos', action: 'read' },
    { resource: 'eventos', action: 'create' }, // inscrição
    // Células: leitura apenas da própria (se participa)
    { resource: 'celulas', action: 'read' },
    // Escola Bíblica: leitura de cursos/turmas matriculados, auto-matrícula
    { resource: 'escola-biblica', action: 'read' },
    { resource: 'escola-biblica', action: 'create' }, // matrícula própria
    // Perfil próprio
    { resource: 'perfil', action: 'read' },
    { resource: 'perfil', action: 'update' },
    // Notificações: ler
    { resource: 'notificacoes', action: 'read' },
  ],

  MODERADOR: [
    // Dashboard
    { resource: 'dashboard', action: 'read' },
    // Arquivos: CRUD completo
    { resource: 'arquivos', action: 'read' },
    { resource: 'arquivos', action: 'create' },
    { resource: 'arquivos', action: 'update' },
    { resource: 'arquivos', action: 'delete' },
    // Notificações: ler
    { resource: 'notificacoes', action: 'read' },
    // Membros: leitura da lista
    { resource: 'membros', action: 'read' },
  ],
}

/**
 * Verifica se uma role tem permissão para um recurso e ação
 */
export function roleHasPermission(
  role: Role,
  resource: string,
  action: string
): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  if (!permissions) return false

  // ADMIN é superusuário (já tratado na constante, mas mantido por clareza)
  if (role === 'ADMIN') return true

  return permissions.some(
    p =>
      (p.resource === resource || p.resource === '*') &&
      (p.action === action || p.action === '*')
  )
}
