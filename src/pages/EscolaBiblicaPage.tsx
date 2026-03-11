import { FC } from 'react';

export const EscolaBiblicaPage: FC = () => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-6">Escola Bíblica</h1>
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-4 shadow-sm border border-[var(--line)]">
              <h2 className="text-2xl font-semibold text-[var(--sea-ink)]">Cursos Disponíveis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="rounded-md bg-[var(--lagoon)] p-3 text-center">
                  <span className="text-[var(--sea-ink-soft)]">Bíblia básica</span>
                </div>
                <div className="rounded-md bg-[var(--lagoon)] p-3 text-center">
                  <span className="text-[var(--sea-ink-soft)]">Teologia I</span>
                </div>
                <div className="rounded-md bg-[var(--lagoon)] p-3 text-center">
                  <span className="text-[var(--sea-ink-soft)]">Louvor & Culto</span>
                </div>
                <div className="rounded-md bg-white p-3 text-center">
                  <span className="text-[var(--sea-ink)]">Aconselhamento</span>
                </div>
                <div className="rounded-md bg-white p-3 text-center">
                  <span className="text-[var(--sea-ink)]">Missões</span>
                </div>
                <div className="rounded-md bg-white p-3 text-center">
                  <span className="text-[var(--sea-ink)]">Evitamento de Cultos</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm border border-[var(--line)] mt-6">
              <h2 className="text-2xl font-semibold text-[var(--sea-ink)]">Minhas Matrículas</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-md bg-[var(--lagoon)] p-2 text-[var(--sea-ink-soft)] text-sm">Bíblia básica - ATIVA</div>
                <div className="rounded-md bg-white p-2 border border-[var(--line)] rounded-md">Teologia I - AGUARDANDO</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};