import { Link, useLocation } from "@tanstack/react-router";
import { ReactNode } from "react";
import {
  Home,
  Users,
  Cross,
  Calendar,
  DollarSign,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const menuItems: NavItem[] = [
  { label: "Início", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
  { label: "Membros", href: "/membros", icon: <Users className="w-5 h-5" /> },
  {
    label: "Ministérios",
    href: "/ministerios",
    icon: <Cross className="w-5 h-5" />,
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Escola Bíblica",
    href: "/escola-biblica",
    icon: <BookOpen className="w-5 h-5" />,
  },
  { label: "Células", href: "/celulas", icon: <Home className="w-5 h-5" /> },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: <Settings className="w-5 h-5" />,
  },
  { label: "Admin", href: "/admin", icon: <Shield className="w-5 h-5" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return currentPath === "/" || currentPath === "/dashboard";
    }
    // Handle disponibilidade routes - active for both admin and user routes
    if (href.includes("disponibilidade")) {
      return currentPath.includes("/disponibilidade");
    }
    return currentPath.startsWith(href);
  };

  // Determinar a rota correta de disponibilidade baseada no papel do usuário
  const getDisponibilidadeHref = () => {
    const isAdmin =
      user?.role === "ADMIN" ||
      user?.role === "ADMIN_MASTER" ||
      user?.role === "PASTOR";
    return isAdmin
      ? "/ministerios/admin/disponibilidade"
      : "/perfil/disponibilidade";
  };

  // Criar menu items com disponibilidade dinâmica
  const allMenuItems: NavItem[] = [
    ...menuItems.slice(0, 3), // Início, Membros, Ministérios
    {
      label: "Disponibilidade",
      href: getDisponibilidadeHref(),
      icon: <Calendar className="w-5 h-5" />,
    },
    ...menuItems.slice(3), // Restante dos itens
  ];

  return (
    <nav
      className={`${isExpanded ? "w-64" : "w-16"} bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 transition-all duration-300 flex flex-col shadow-lg shrink-0 h-screen sticky top-0`}
    >
      {/* Header com Logo e Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <span
          className={`${isExpanded ? "block" : "hidden"} text-blue-600 text-2xl text-bold  dark:text-white font-semibold `}
        >
          IgrejaConnect
        </span>

        {/* Toggle Menu Button */}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors"
          aria-label={isExpanded ? "Fechar menu" : "Abrir menu"}
        >
          {isExpanded ? (
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div
        className={`flex-1 py-2 overflow-y-auto ${isExpanded ? "block" : "hidden"}`}
      >
        <div className="px-2 space-y-1">
          {allMenuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "text-teal-600 font-medium bg-teal-50 dark:bg-teal-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="flex items-center justify-center w-5 h-5">
                {item.icon}
              </span>
              <span
                className={`${isExpanded ? "block" : "hidden"} text-sm font-medium`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="border-t border-gray-300 dark:border-gray-700 p-4">
        {/* Theme Toggler - acima do usuário */}
        <div
          className={`flex items-center gap-2 mb-3 ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          {isExpanded && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Tema
            </span>
          )}
          <AnimatedThemeToggler className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" />
        </div>

        <div
          className={`flex items-center gap-3 ${isExpanded ? "flex-row" : "flex-col"}`}
        >
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className={`${isExpanded ? "block" : "hidden"} flex-1 min-w-0`}>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.firstName || user?.email?.split("@")[0] || "Usuário"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role || "Membro"}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
