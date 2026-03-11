import { FC } from 'react';

export const PatrimonioPage: FC = () => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-6">Gestão de Patrimônio</h1>
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm border border-[var(--line)]">
              <h2 className="text-2xl font-semibold text-[var(--sea-ink)]">Módulo em Desenvolvimento</h2>
              <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
                Esta funcionalidade está sendo implementada e estará disponível em breve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatrimonioPage;