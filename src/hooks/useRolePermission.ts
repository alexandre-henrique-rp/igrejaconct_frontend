import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { ROLE_PERMISSIONS, type Role, type Permission } from '@/constants/permission.constants'

/**
 * Hook para verificar permissões baseado na role do usuário
 *
 * @param resource - Nome do recurso (ex: 'membros', 'financeiro', 'eventos')
 * @param action - Ação solicitada ('read' | 'create' | 'update' | 'delete' | '*')
 * @returns true se o usuário tem permissão, false caso contrário
 *
 * @example
 * ```tsx
 * const canCreateMembros = useRolePermission('membros', 'create')
 * const canViewFinanceiro = useRolePermission('financeiro', 'read')
 *
 * // Uso em componente:
 * {canCreateMembros && <ButtonNew nav="/membros/new" />}
 * ```
 *
 * Baseado na matriz de permissões em docs/rotas-permissoes-matrix.md
 */
export function useRolePermission(
  resource: string,
  action: 'read' | 'create' | 'update' | 'delete' | '*'
): boolean {
  const { user, isAuthenticated } = useAuth()

  return useMemo(() => {
    // Não autenticado = sem permissão
    if (!isAuthenticated || !user) {
      return false
    }

    // ADMIN tem todas as permissões
    if (user.role === 'ADMIN') {
      return true
    }

    // Busca permissões da role
    const permissions = ROLE_PERMISSIONS[user.role as Role]
    if (!permissions) {
      return false
    }

    // Verifica se existe pelo menos uma permissão que corresponda
    return permissions.some(
      p =>
        (p.resource === resource || p.resource === '*') &&
        (p.action === action || p.action === '*')
    )
  }, [user?.role, resource, action, isAuthenticated])
}

/**
 * Hook alternativo que retorna a lista de permissões da role
 * útil para debugging ou componentes mais complexos
 */
export function useRolePermissions(): Permission[] {
  const { user } = useAuth()

  return useMemo(() => {
    if (!user) return []
    return ROLE_PERMISSIONS[user.role as Role] || []
  }, [user?.role])
}

/**
 * Hook que verifica múltiplas permissões simultaneamente
 */
export function useMultiplePermissions(
  checks: Array<{ resource: string; action: string }>
): boolean {
  return useMemo(() => {
    return checks.every(check => useRolePermission(check.resource, check.action as any))
  }, [])
}
