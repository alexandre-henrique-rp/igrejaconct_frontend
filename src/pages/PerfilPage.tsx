import { FC } from 'react';

const PerfilPage: FC = () => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-6">Perfil</h1>
          <div className="space-y-6">
            <div className="rounded-lg bg-background p-6 shadow-sm border border-[var(--line)]">
              <h2 className="text-2xl font-semibold text-[var(--sea-ink)]">Dados Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-[var(--sea-ink-soft)]">Nome Completo</p>
                  <p className="font-medium text-[var(--sea-ink)]">Seu Nome</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--sea-ink-soft)]">Email</p>
                  <p className="font-medium text-[var(--sea-ink)]">seu@email.com</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--sea-ink-soft)]">Telefone</p>
                  <p className="font-medium text-[var(--sea-ink)]">+55 (11) 91234-5678</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--sea-ink-soft)]">Endereço</p>
                  <p className="font-medium text-[var(--sea-ink)]">Rua Exemplo, 123</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-background p-6 shadow-sm border border-[var(--line)]">
              <h2 className="text-2xl font-semibold text-[var(--sea-ink)]">Configurações de Segurança</h2>
              <div className="mt-4 space-y-3">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--line)] text-[var(--sea-ink)] hover:bg-[var(--line)] transition-colors">
                  <span className="h-4 w-4 text-[var(--lagoon)]">🔒</span>
                  <span className="hidden md:inline">Alterar Senha</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--line)] text-[var(--sea-ink)] hover:bg-[var(--line)] transition-colors">
                  <span className="h-4 w-4 text-[var(--lagoon)]">👤</span>
                  <span className="hidden md:inline">Gerenciar Dispositivos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilPage;