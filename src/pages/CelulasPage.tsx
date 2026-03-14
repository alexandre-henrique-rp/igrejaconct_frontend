import { FC } from 'react';

const CelulasPage: FC = () => {
  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="display-title text-gray-900">Células</h1>
          <p className="text-sm text-gray-600 mt-1">Gerencie as células da igreja</p>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Células Ativas</p>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">12</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Células Filhas</p>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">8</span>
        </div>
      </div>

      {/* Lista de células */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Minhas Células</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-200">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-700 font-semibold">L</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Liderança</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 ring-1 ring-green-400">ATIVA</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-semibold">F</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Família</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 ring-1 ring-yellow-400">AGUARDANDO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CelulasPage;