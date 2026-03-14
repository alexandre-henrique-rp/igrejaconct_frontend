import { Link } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';

/**
 * Página de erro 403 - Acesso Negado
 * Exibida quando o usuário não tem permissão para acessar um recurso
 */
export const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
        <div className="text-yellow-500 mb-4">
          <ShieldAlert className="h-16 w-16 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Acesso Negado</h1>
        <p className="text-gray-400 mb-6">
          Você não tem permissão para acessar esta página. Entre em contato com o administrador se achar que isso é um erro.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
          >
            Voltar ao Dashboard
          </Link>
          <Link
            to="/perfil"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            Meu Perfil
          </Link>
        </div>
      </div>
    </div>
  );
};
