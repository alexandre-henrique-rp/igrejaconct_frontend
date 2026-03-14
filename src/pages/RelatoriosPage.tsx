import { FC } from 'react';

export const RelatoriosPage: FC = () => {
  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="display-title text-gray-900">Relatórios</h1>
          <p className="text-sm text-gray-600 mt-1">Análises e estatísticas da igreja</p>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Membros por Célula</p>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">42</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Diversidade</p>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">86%</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Financeiro - Mês Atual</p>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">R$ 12.345,67</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Meta</p>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">R$ 15.000,00</span>
        </div>
      </div>
    </div>
  );
};