import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';

const ConfiguracoesPage = () => (
  <div className="min-h-screen bg-background text-primary">
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-6">Configurações</h1>
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-4 shadow-sm border border-[var(--line)]">
          <h2 className="text-2xl font-semibold text-[var(--sea-ink)]">Preferências do Sistema</h2>
          <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">Ajuste o comportamento da aplicação conforme sua necessidade.</p>
        </div>
      </div>
    </div>
  </div>
);

export const Route = createFileRoute('/configuracoes/' as any)({
  component: () => (
    <PrivateRoute>
      <ConfiguracoesPage />
    </PrivateRoute>
  ),
});