import { Link } from '@tanstack/react-router';
import { useSidebarVisibility } from '@/hooks/useSidebarVisibility';
import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

const menuItems: NavItem[] = [
  { label: 'Início', href: '/dashboard', icon: '🏠' },
  { label: 'Membros', href: '/membros', icon: '👥' },
  { label: 'Ministérios', href: '/ministerios', icon: '✝️' },
  { label: 'Disponibilidade', href: '/perfil/disponibilidade', icon: '📅' },
  { label: 'Financeiro', href: '/financeiro', icon: '💰' },
  { label: 'Relatórios', href: '/relatorios', icon: '📊' },
  { label: 'Escola Bíblica', href: '/escola-biblica', icon: '📚' },
  { label: 'Células', href: '/celulas', icon: '🏠' },
  { label: 'Grupos', href: '/grupos', icon: '🤝' },
  { label: 'Configurações', href: '/configuracoes', icon: '⚙️' },
];

export const Sidebar: React.FC = () => {
  const { isExpanded, toggleExpand } = useSidebarVisibility();
  const isActive = window.location.pathname;

  return (
    <nav className={`${isExpanded ? 'w-64' : 'w-16'} bg-background border-r border-[var(--line)] transition-all duration-300 fixed inset-y-0 left-0 flex flex-col shadow-lg`}>
      <div className="flex items-center justify-between p-4 border-b border-[var(--line)]">
        <span className="text-[var(--sea-ink)] font-semibold">IgrejaConnect</span>
        <button
          onClick={toggleExpand}
          className="ml-2 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
          aria-label={isExpanded ? 'Fechar menu' : 'Abrir menu'}
        >
          {isExpanded ? <ChevronRight className="h-4 w-4 text-[var(--sea-ink)]" /> : <ChevronLeft className="h-4 w-4 text-[var(--sea-ink)]" />}
        </button>
      </div>
      <div className={isExpanded ? 'flex-1 py-2' : 'hidden overflow-y-auto py-2'}>
        <div className="px-2 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={
                isActive === item.href
                  ? 'text-[var(--lagoon)] font-medium flex items-center gap-2 py-1.5 rounded-md hover:bg-[var(--line)] transition-colors'
                  : 'text-[var(--sea-ink-soft)] flex items-center gap-2 py-1.5 rounded-md hover:bg-[var(--line)] transition-colors'
              }
              onClick={() => {
                if (!isExpanded) toggleExpand();
              }}
            >
              <span className="mr-2">{item.icon}</span>
              <span className="hidden ${!isExpanded ? 'block' : 'hidden'}">${item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};