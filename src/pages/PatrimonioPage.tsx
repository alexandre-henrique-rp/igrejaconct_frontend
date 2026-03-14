import { FC } from 'react';

export const PatrimonioPage: FC = () => {
  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="display-title text-gray-900">Gestão de Patrimônio</h1>
          <p className="text-sm text-gray-600 mt-1">Controle de bens e ativos da igreja</p>
        </div>
      </div>

      {/* Card de aviso */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Módulo em Desenvolvimento</h2>
        <p className="text-sm text-gray-600">
          Esta funcionalidade está sendo implementada e estará disponível em breve.
        </p>
      </div>
    </div>
  );
};

export default PatrimonioPage;