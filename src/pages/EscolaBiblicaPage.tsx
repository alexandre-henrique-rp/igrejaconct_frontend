import { FC } from 'react';

export const EscolaBiblicaPage: FC = () => {
  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="display-title text-gray-900">Escola Bíblica</h1>
          <p className="text-sm text-gray-600 mt-1">Cursos e matrículas</p>
        </div>
      </div>

      {/* Cursos Disponíveis */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Cursos Disponíveis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl bg-teal-50 p-4 text-center border border-teal-200">
            <span className="text-teal-800 font-medium">Bíblia básica</span>
          </div>
          <div className="rounded-xl bg-teal-50 p-4 text-center border border-teal-200">
            <span className="text-teal-800 font-medium">Teologia I</span>
          </div>
          <div className="rounded-xl bg-teal-50 p-4 text-center border border-teal-200">
            <span className="text-teal-800 font-medium">Louvor & Culto</span>
          </div>
          <div className="rounded-xl bg-white p-4 text-center border border-gray-200">
            <span className="text-gray-700 font-medium">Aconselhamento</span>
          </div>
          <div className="rounded-xl bg-white p-4 text-center border border-gray-200">
            <span className="text-gray-700 font-medium">Missões</span>
          </div>
          <div className="rounded-xl bg-white p-4 text-center border border-gray-200">
            <span className="text-gray-700 font-medium">Evangelismo</span>
          </div>
        </div>
      </div>

      {/* Minhas Matrículas */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Minhas Matrículas</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-200">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-700 font-semibold">B</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Bíblia básica</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 ring-1 ring-green-400">ATIVA</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-semibold">T</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Teologia I</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 ring-1 ring-yellow-400">AGUARDANDO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};