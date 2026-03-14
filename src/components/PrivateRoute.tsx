import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { tokenManager } from '@/utils/token-manager';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Verifica se existe token válido
    const accessToken = tokenManager.getAccessToken();
    
    if (!isLoading) {
      if (!isAuthenticated || !accessToken) {
        // Não está autenticado ou não tem token
        navigate({ to: '/login' });
      } else if (tokenManager.isTokenExpiredOrExpiringSoon(accessToken)) {
        // Token expirado, redireciona para login
        navigate({ to: '/login' });
      }
      setIsValidating(false);
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading || isValidating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  // Só renderiza children se estiver autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Redirecionando para login...</div>
      </div>
    );
  }

  return <>{children}</>;
};
