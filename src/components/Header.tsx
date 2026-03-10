import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            IgrejaConnect
          </Link>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0 sm:ml-4">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Sobre
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-[var(--sea-ink-soft)] sm:block">
                Olá, {user?.email.split('@')[0]}
              </span>
              <button
                onClick={() => logout()}
                className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-4 py-1.5 text-xs font-semibold text-[var(--sea-ink)] hover:bg-white transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-[var(--lagoon)] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[var(--lagoon-deep)] transition-colors"
            >
              Entrar
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
