import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { PrivateRoute } from '@/components/PrivateRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PermissionGuard } from '@/components/PermissionGuard';
import api from '@/services/api-client';
import {
  BarChart3,
  Users,
  Church,
  Database,
  Activity,
  TrendingUp,
} from 'lucide-react';

export const Route = createFileRoute('/admin/')({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
      <PermissionGuard resource="admin" action="read">
          <AdminDashboardPage />
      </PermissionGuard>
    </DashboardLayout>
    </PrivateRoute>
  ),
});

function AdminDashboardPage() {
  const { data: igrejas } = useQuery({
    queryKey: ['admin-igrejas'],
    queryFn: async () => {
      const res = await api.get('/igrejas');
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
  });

  const { data: membrosDash } = useQuery({
    queryKey: ['admin-membros-dashboard'],
    queryFn: async () => {
      const res = await api.get('/relatorios/membros/dashboard');
      return res.data;
    },
  });

  const { data: financeiroDash } = useQuery({
    queryKey: ['admin-financeiro-dashboard'],
    queryFn: async () => {
      const res = await api.get('/relatorios/financeiro/dashboard');
      return res.data;
    },
  });

  const { data: recentActivities = [] } = useQuery({
    queryKey: ['admin-recent-activities'],
    queryFn: async () => {
      const res = await api.get('/admin/activities');
      return res.data;
    },
  });

  const totalIgrejas = igrejas?.length ?? '–';
  const totalMembros = membrosDash?.statusDistribution
    ? membrosDash.statusDistribution.reduce((acc: number, s: any) => acc + (s._count ?? s.count ?? 0), 0).toLocaleString('pt-BR')
    : '–';
  const saldo = financeiroDash?.summary?.saldo;
  const saldoStr = saldo != null
    ? `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    : '–';

  const stats = [
    {
      title: 'Total de Igrejas',
      value: String(totalIgrejas),
      change: 'igrejas ativas',
      icon: Church,
      color: 'bg-blue-500',
    },
    {
      title: 'Membros',
      value: totalMembros,
      change: 'total cadastrados',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Saldo do Mês',
      value: saldoStr,
      change: 'financeiro atual',
      icon: BarChart3,
      color: 'bg-yellow-500',
    },
    {
      title: 'Sistema',
      value: '99.9%',
      change: 'uptime',
      icon: Activity,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-400">Visão geral do sistema e métricas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Grid de gráficos e informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-700 last:border-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-white">{activity.action}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status do Sistema */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Status do Sistema</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Servidor API</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Banco de Dados</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400">Conectado</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Cache Redis</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400">Ativo</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Armazenamento</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-yellow-400">75% usado</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-white mb-2">Igrejas</h3>
            <div className="space-y-2 text-sm max-h-36 overflow-y-auto pr-1">
              {igrejas?.length ? igrejas.slice(0, 5).map((ig: any) => (
                <div key={ig.id} className="flex justify-between">
                  <span className="text-gray-400 truncate">{ig.nome}</span>
                  <span className={`ml-2 shrink-0 text-xs ${ig.ativo !== false ? 'text-green-400' : 'text-gray-500'}`}>
                    {ig.ativo !== false ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              )) : (
                <span className="text-gray-500">–</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/usuarios/novo" className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition-colors">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <span className="text-white text-sm">Novo Usuário</span>
          </a>
          <a href="/admin/igrejas/nova" className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition-colors">
            <Church className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <span className="text-white text-sm">Nova Igreja</span>
          </a>
          <a href="/admin/sistema/backup" className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition-colors">
            <Database className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
            <span className="text-white text-sm">Fazer Backup</span>
          </a>
          <a href="/admin/logs" className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition-colors">
            <Activity className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <span className="text-white text-sm">Ver Logs</span>
          </a>
        </div>
      </div>
    </div>
  );
}
