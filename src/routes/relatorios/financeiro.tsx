import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api-client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet,
  Loader2,
  FileText,
  TrendingUp
} from 'lucide-react';

export const Route = createFileRoute('/relatorios/financeiro')({
  component: FinanceiroDashboard,
});

function FinanceiroDashboard() {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['financeiro-dashboard'],
    queryFn: async () => {
      const response = await api.get('/relatorios/financeiro/dashboard');
      return response.data;
    },
  });

  const handleExportPDF = async () => {
    try {
      const response = await api.get('/relatorios/financeiro/export/pdf', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'balancete_financeiro.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Carregando balancete financeiro...</p>
    </div>
  );

  if (error) return <div className="p-8 text-red-600">Erro ao carregar relatório financeiro.</div>;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-green-600" />
            Dashboard Financeiro
          </h1>
          <p className="text-gray-500">Acompanhe as receitas, despesas e o saldo da igreja.</p>
        </div>
        
        <button 
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Exportar Balancete (PDF)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><ArrowUpCircle className="w-6 h-6" /></div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Mês Atual</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(dashboard.summary.totalEntradas)}</h3>
          <p className="text-sm text-gray-500 mt-1">Total de Entradas</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><ArrowDownCircle className="w-6 h-6" /></div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Mês Atual</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(dashboard.summary.totalSaidas)}</h3>
          <p className="text-sm text-gray-500 mt-1">Total de Saídas</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Wallet className="w-6 h-6" /></div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Saldo</span>
          </div>
          <h3 className={`text-2xl font-bold ${dashboard.summary.saldo >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
            {formatCurrency(dashboard.summary.saldo)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Resultado do mês</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Histórico</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">6 Meses</h3>
          <p className="text-sm text-gray-500 mt-1">Período analisado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Tendência (Área) */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Tendência Financeira (Últimos 6 meses)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.history}>
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="monthYear" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="entradas" stroke="#16a34a" fillOpacity={1} fill="url(#colorEntradas)" name="Entradas" />
                <Area type="monotone" dataKey="saidas" stroke="#dc2626" fillOpacity={1} fill="url(#colorSaidas)" name="Saídas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por Categoria (Barras) */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Detalhamento por Categoria (Mês Atual)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.summary.detalhamento} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="nome" type="category" width={100} fontSize={10} />
                <Tooltip />
                <Bar dataKey="total" fill="#2563eb" radius={[0, 4, 4, 0]} name="Valor (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
