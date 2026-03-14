import { FC } from 'react';

const NotificacoesPage: FC = () => {
  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="display-title text-gray-900">Notificações</h1>
          <p className="text-sm text-gray-600 mt-1">Central de notificações e avisos</p>
        </div>
      </div>

      {/* Lista de notificações */}
      <div className="space-y-3">
        {['Evento de Louvor', 'Reunião de Célula', 'Prazo de Oferta', 'Anúncio Importante'].map((title) => (
          <div key={title} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer">
            <p className="font-semibold text-gray-900">{title}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 ring-1 ring-gray-300">
              Ago 12
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificacoesPage;