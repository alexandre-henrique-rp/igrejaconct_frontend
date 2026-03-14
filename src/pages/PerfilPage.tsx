import { TitleComponent } from '#/components/TitleComponent';
import { FC } from 'react';

const PerfilPage: FC = () => {
  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6">
        <TitleComponent title="Perfil" description="Gerencie suas informações pessoais" />
      </div>

      <div className="space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-600 rounded-full" />
            Dados Pessoais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Nome Completo</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">Seu Nome</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">seu@email.com</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Telefone</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">+55 (11) 91234-5678</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Endereço</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">Rua Exemplo, 123</p>
            </div>
          </div>
        </div>

        {/* Configurações de Segurança */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-600 rounded-full" />
            Configurações de Segurança
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              <span>🔒</span>
              <span className="text-sm font-medium">Alterar Senha</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              <span>👤</span>
              <span className="text-sm font-medium">Gerenciar Dispositivos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilPage;