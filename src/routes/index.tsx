import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export const Route = createFileRoute('/')({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
        <main className="page-wrap px-4 pb-8 pt-14">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-6">Painel Principal</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-[var(--line)] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-6 w-6 text-[var(--lagoon)]">👥</span>
                  <span className="text-[var(--sea-ink)] font-medium">Membros Ativos</span>
                </div>
                <div className="h-8 rounded-full bg-[var(--line)]"></div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-[var(--line)] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-6 w-6 text-[var(--lagoon)]">💰</span>
                  <span className="text-[var(--sea-ink)] font-medium">Doações Mensais</span>
                </div>
                <div className="h-8 rounded-full bg-[var(--line)]"></div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-[var(--line)] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-6 w-6 text-[var(--lagoon)]">📅</span>
                  <span className="text-[var(--sea-ink)] font-medium">Eventos Próximos</span>
                </div>
                <div className="h-8 rounded-full bg-[var(--line)]"></div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-[var(--line)] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-6 w-6 text-[var(--lagoon)]">📈</span>
                  <span className="text-[var(--sea-ink)] font-medium">Crescimento</span>
                </div>
                <div className="h-8 rounded-full bg-[var(--line)]"></div>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    </PrivateRoute>
  ),
});