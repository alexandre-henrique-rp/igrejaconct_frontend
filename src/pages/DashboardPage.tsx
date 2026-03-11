import { ReactNode } from 'react';
import { ChartsCard } from '@/components/charts/Card';

interface DashboardPageProps {
  children?: ReactNode;
}

const DashboardPage: React.FC<DashboardPageProps> = () => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-6">Painel Principal</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ChartsCard title="Membros Ativos" icon="users" />
            <ChartsCard title="Donações Mensais" icon="money" />
            <ChartsCard title="EventosPróximos" icon="calendar" />
            <ChartsCard title="Crescimento" icon="trending-up" />
          </div>
        </div>
        <div className="mt-12">
          <div className="rounded-lg bg-white p-4 shadow-sm border border-[var(--line)]">
            <p className="text-sm text-[var(--sea-ink-soft)]">Estatísticas detalhadas em breve.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
