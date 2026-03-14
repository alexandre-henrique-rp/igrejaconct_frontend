import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Sun, Moon, Users, DollarSign, BarChart3, BookOpen, Home, Settings, ChevronUp, ChevronDown, Cross, Search } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeProvider';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const { resolvedMode, toggleMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = window.location.pathname;

  const items: NavItem[] = [
    { label: 'Home', href: '/dashboard', icon: <Sun className="h-5 w-5" /> },
    { label: 'Membros', href: '/membros', icon: <Users className="h-5 w-5" /> },
    { label: 'Ministérios', href: '/ministerios', icon: <Cross className="h-5 w-5" /> },
    { label: 'Financeiro', href: '/financeiro', icon: <DollarSign className="h-5 w-5" /> },
    { label: 'Relatórios', href: '/relatorios', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'Escola Bíblica', href: '/escola-biblica', icon: <BookOpen className="h-5 w-5" /> },
    { label: 'Células', href: '/celulas', icon: <Home className="h-5 w-5" /> },
    { label: 'Grupos', href: '/grupos', icon: <Users className="h-5 w-5" /> },
    { label: 'Configurações', href: '/configuracoes', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex w-full justify-between">
            <div className="flex">
              <div className="shrink-0">
                <a href="/dashboard" className="self-center">
                  <span className="text-gray-900 font-semibold text-xl">IgrejaConnect</span>
                </a>
              </div>
            </div>
          </div>

          <div className="hidden md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
              aria-label="Abrir menu"
            >
              {isMenuOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            <div className={isMenuOpen ? 'md:hidden' : 'absolute right-0 top-full mt-2 w-64 bg-background border border-gray-200 rounded-md shadow-lg py-1'}>
              <div className="py-1" role="menu">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    role="menuitem"
                    className={`
                      block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 
                      :target-blank :hover:bg-gray-100 
                      ${isActive === item.href ? 'text-teal-600 font-medium' : ''}
                      focus:bg-gray-100 focus:outline-none
                    `}
                  >
                    {item.icon}
                    <span className="hidden md:inline"> {item.label} </span>
                    </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMode}
                className="flex items-center space-x-1 px-3 py-1.5 border border-gray-200 rounded-md text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                aria-label="Alternar tema"
              >
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              <div className="flex items-center space-x-2">
                {/* Search Icon */}
                <Search className="h-5 w-5 text-gray-600 hover:text-teal-600" />
                {/* User Avatar or Name */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">I</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};