import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  Users, 
  DollarSign, 
  Heart, 
  BarChart3,
  Activity 
} from 'lucide-react';

export const Route = createFileRoute('/relatorios/')({
  component: RelatoriosIndex,
});

function RelatoriosIndex() {
  const categories = [
    {
      title: 'Membros',
      description: 'Estatísticas de crescimento, demografia e distribuição de status.',
      icon: Users,
      href: '/relatorios/membros',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Financeiro',
      description: 'Balancete mensal, entradas vs saídas e histórico de tendências.',
      icon: DollarSign,
      href: '/relatorios/financeiro',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pastoral',
      description: 'Resumo de acompanhamentos, visitas e monitoramento de casos.',
      icon: Heart,
      href: '/relatorios/pastoral',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Células',
      description: 'Métricas de pequenos grupos, frequência e conversões.',
      icon: Activity,
      href: '/relatorios/celulas',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-8 h-8" />
          Relatórios e Dashboards
        </h1>
        <p className="text-gray-600 mt-2">
          Acompanhe os principais indicadores de saúde e crescimento da sua igreja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            to={cat.href}
            className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className={`w-12 h-12 ${cat.bgColor} ${cat.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{cat.title}</h2>
            <p className="text-gray-500 text-sm">{cat.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center text-center">
        <Activity className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Novos Módulos em Breve</h3>
        <p className="text-gray-500 max-w-md mx-auto mt-2">
          Estamos trabalhando em novos relatórios para Eventos e Ministérios. Fique atento às atualizações!
        </p>
      </div>
    </div>
  );
}
