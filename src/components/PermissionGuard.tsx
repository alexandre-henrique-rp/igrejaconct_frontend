import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRolePermission } from '@/hooks/useRolePermission';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  resource: string;
  action: 'read' | 'create' | 'update' | 'delete' | '*';
}

/**
 * Componente que protege rotas baseado em permissões de role.
 * Se o usuário não tiver permissão, redireciona para /403.
 */
export const PermissionGuard = ({ children, resource, action }: PermissionGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const hasPermission = useRolePermission(resource, action);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasPermission) {
      navigate({ to: '/403' });
    }
  }, [hasPermission, isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // PrivateRoute deve tratar a autenticação
  }

  if (!hasPermission) {
    return null; // Redirecionando para /403
  }

  return <>{children}</>;
};
