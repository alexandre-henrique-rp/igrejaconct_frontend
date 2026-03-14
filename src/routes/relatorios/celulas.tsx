import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api-client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Home, 
  Users, 
  Loader2,
  Calendar,
  Zap
} from 'lucide-react';

export const Route = createFileRoute('/relatorios/celulas')({
  component: CelulasPage,
});

function CelulasPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <CelulasDashboard />
      </DashboardLayout>
    </PrivateRoute>
  )
}

function CelulasDashboard() {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['celulas-dashboard'],
    queryFn: async () => {
      const response = await api.get('/relatorios/celulas/dashboard');
      return response.data;
    },
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Carregando métricas de células...</p>
    </div>
  );

  if (error) return <div className="p-8 text-red-600">Erro ao carregar relatório de células.</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Home className="w-7 h-7 text-teal-600" />
          Dashboard de Células
        </h1>
        <p className="text-gray-600">Análise de crescimento, frequência e saúde dos pequenos grupos.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl"><Home className="w-6 h-6" /></div>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{dashboard.summary.totalCelulas}</h3>
          <p className="text-xs text-gray-600 mt-1 font-medium">Células Ativas</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl"><Users className="w-6 h-6" /></div>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Alcance</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{dashboard.summary.totalMembrosEmCelulas}</h3>
          <p className="text-xs text-gray-600 mt-1 font-medium">Membros em Células</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-50 text-gray-900 rounded-xl"><Calendar className="w-6 h-6" /></div>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Frequência</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{dashboard.meetingStats.mediaPresenca}</h3>
          <p className="text-xs text-gray-600 mt-1 font-medium">Média de Presença</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl"><Zap className="w-6 h-6" /></div>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Impacto</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">+{dashboard.meetingStats.totalConversoes}</h3>
          <p className="text-xs text-gray-600 mt-1 font-medium">Conversões no Mês</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Histórico de Frequência */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Média de Frequência Mensal</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.meetingHistory}>
                <defs>
                  <linearGradient id="colorPresenca" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--lagoon)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--lagoon)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                <XAxis dataKey="monthYear" fontSize={11} axisLine={false} tickLine={false} tick={{fill: 'var(--sea-ink-soft)'}} />
                <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{fill: 'var(--sea-ink-soft)'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="mediaPresentes" 
                  stroke="var(--lagoon)" 
                  fillOpacity={1} 
                  fill="url(#colorPresenca)" 
                  strokeWidth={3} 
                  name="Média de Presentes" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Histórico de Visitantes */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Total de Visitantes (6 meses)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.meetingHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                <XAxis dataKey="monthYear" fontSize={11} axisLine={false} tickLine={false} tick={{fill: 'var(--sea-ink-soft)'}} />
                <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{fill: 'var(--sea-ink-soft)'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="totalVisitantes" fill="var(--lagoon-soft)" radius={[6, 6, 0, 0]} name="Visitantes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resumo do Período */}
        <div className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Resumo Detalhado (Mês Atual)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600 uppercase">Reuniões Realizadas</p>
              <p className="text-3xl font-bold text-gray-900">{dashboard.meetingStats.totalReunioes}</p>
              <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600 uppercase">Total de Presentes</p>
              <p className="text-3xl font-bold text-gray-900">{dashboard.meetingStats.totalPresentes}</p>
              <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600 uppercase">Saúde da Célula (Média Membros)</p>
              <p className="text-3xl font-bold text-gray-900">{dashboard.summary.mediaMembrosPorCelula}</p>
              <p className="text-xs text-gray-600 font-medium">Ideal: 8 a 12 membros</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
