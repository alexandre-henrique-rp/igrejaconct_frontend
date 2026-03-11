import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api-client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Heart, 
  Calendar, 
  AlertCircle, 
  Clock,
  Loader2,
  FileText,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Route = createFileRoute('/relatorios/pastoral')({
  component: PastoralDashboard,
});

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#6366f1', '#f472b6'];

function PastoralDashboard() {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['pastoral-dashboard'],
    queryFn: async () => {
      const response = await api.get('/relatorios/pastoral/dashboard');
      return response.data;
    },
  });

  const handleExportPDF = async () => {
    try {
      const response = await api.get('/relatorios/pastoral/export/pdf', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio_pastoral.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Carregando dados pastorais...</p>
    </div>
  );

  if (error) return <div className="p-8 text-red-600">Erro ao carregar relatório pastoral.</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-600" />
            Dashboard Pastoral
          </h1>
          <p className="text-gray-500">Acompanhamento de visitas, aconselhamentos e cuidado aos membros.</p>
        </div>
        
        <button 
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Exportar Relatório (PDF)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Calendar className="w-6 h-6" /></div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Mês Atual</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{dashboard.summary.totalAtividades}</h3>
          <p className="text-sm text-gray-500 mt-1">Total de Atividades</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pendentes</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{dashboard.summary.casosAbertos}</h3>
          <p className="text-sm text-gray-500 mt-1">Casos em Acompanhamento</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Clock className="w-6 h-6" /></div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Recente</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{dashboard.recent.length}</h3>
          <p className="text-sm text-gray-500 mt-1">Últimos registros públicos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Distribuição por Tipo */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Tipos de Atendimento</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.summary.distribuicaoTipo}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="tipo" fontSize={10} angle={-15} textAnchor="end" height={60} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} name="Atividades" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por Status */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Status dos Casos</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboard.summary.distribuicaoStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {dashboard.summary.distribuicaoStatus.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Atividades Recentes (Públicas)</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {dashboard.recent.length > 0 ? (
            dashboard.recent.map((activity: any) => (
              <div key={activity.id} className="p-6 flex items-start gap-4">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-full">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{activity.membro.nome_completo}</h4>
                    <span className="text-sm text-gray-500">
                      {format(new Date(activity.data_ocorrencia), "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {activity.tipo}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{activity.descricao}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">Nenhuma atividade recente registrada.</div>
          )}
        </div>
      </div>
    </div>
  );
}
