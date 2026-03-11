import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Sun, Moon, Users, DollarSign, BarChart3, BookOpen, Home, Settings, ChevronUp, ChevronDown, Cross } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
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
    <nav className="bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex w-full justify-between">
            <div className="flex">
              <div className="flex-shrink-0">
                <a href="/dashboard" className="self-center">
                  <span className="text-[var(--sea-ink)] font-semibold text-xl">IgrejaConnect</span>
                </a>
              </div>
            </div>
          </div>

          <div className="hidden md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[var(--sea-ink)] hover:bg-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
              aria-label="Abrir menu"
            >
              {isMenuOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            <div className={isMenuOpen ? 'md:hidden' : 'absolute right-0 top-full mt-2 w-64 bg-background border border-[var(--line)] rounded-md shadow-lg py-1'}>
              <div className="py-1" role="menu">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    role="menuitem"
                    className={`
                      block px-4 py-2 rounded-md text-[var(--sea-ink-soft)] hover:bg-[var(--line)] 
                      :target-blank :hover:bg-[var(--line)] 
                      ${isActive === item.href ? 'text-[var(--lagoon)] font-medium' : ''}
                      focus:bg-[var(--line)] focus:outline-none
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
                onClick={toggleTheme}
                className="flex items-center space-x-1 px-3 py-1.5 border border-[var(--line)] rounded-md text-[var(--sea-ink)] hover:bg-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
                aria-label="Alternar tema"
              >
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              <div className="flex items-center space-x-2">
                {/* Search Icon */}
                <svg
                  className="h-5 w-5 text-[var(--sea-ink-soft)] hover:text-[var(--lagoon)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.754c.755-1.708 1.246-3.585 1.246-5.33a2.25.25 round{...}..."
                  />
                </svg>
                {/* User Avatar or Name */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--lagoon)] flex items-center justify-center">
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