import { FC } from 'react';

const CelulasPage: FC = () => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-6">Células</h1>
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-4 shadow-sm border border-[var(--line)] flex justify-between">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Células Ativas</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[var(--sea-ink-soft)] text-xs">
                  12
                </span>
              </div>
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Células Filhas</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[var(--sea-ink-soft)] text-xs">
                  8
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm border border-[var(--line)] mt-4">
              <h2 className="text-2xl font-semibold text-[var(--sea-ink)]">Minhas Células</h2>
              <div className="mt-2 space-y-2">
                <div className="rounded-md bg-[var(--lagoon)] p-2 text-[var(--sea-ink-soft)] text-sm">Liderança - ATIVA</div>
                <div className="rounded-md bg-white p-2 border border-[var(--line)] rounded-md">Família - AGUARDANDO</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CelulasPage;