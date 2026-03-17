import { ReactNode, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  Church, 
  Shield, 
  Settings, 
  Database,
  Activity,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const adminMenuItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Usuários', href: '/admin/usuarios', icon: Users },
  { label: 'Igrejas', href: '/admin/igrejas', icon: Church },
  { label: 'Permissões', href: '/admin/permissoes', icon: Shield },
  { label: 'Sistema', href: '/admin/sistema', icon: Settings },
  { label: 'Backup', href: '/admin/sistema/backup', icon: Database },
  { label: 'Logs', href: '/admin/logs', icon: Activity },
  { label: 'Métricas', href: '/admin/metrics', icon: BarChart3 },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredMenuItems = adminMenuItems.filter(() => {
    // Admin vê todos os itens
    return true;
  });

  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex h-full">
        {/* Sidebar Admin */}
        <aside className={`${isExpanded ? 'w-64' : 'w-16'} bg-gray-900 border-r border-gray-700 flex flex-col transition-all duration-300`}>
          <div className="p-4 border-b border-gray-700 flex items-center justify-between shrink-0">
            {isExpanded && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-white font-bold">Admin Panel</span>
              </div>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
            >
              {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isExpanded && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-700 shrink-0">
            <div className={`flex items-center gap-3 ${!isExpanded ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {user?.email}
                  </p>
                  <p className="text-gray-400 text-xs truncate">{user?.role}</p>
                </div>
              )}
            </div>
            {isExpanded && (
              <button
                onClick={() => logout()}
                className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            )}
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
