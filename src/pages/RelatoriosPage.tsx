import { FC } from 'react';

export const RelatoriosPage: FC = () => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-6">Relatórios</h1>
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-4 shadow-sm border border-[var(--line)] flex justify-between">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Membros por Célula</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[var(--sea-ink-soft)] text-xs">
                  42
                </span>
              </div>
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Diversidade</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[var(--sea-ink-soft)] text-xs">
                  86%
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm border border-[var(--line)] flex justify-between">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Financeiro - Mês Atual</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[var(--sea-ink-soft)] text-xs">
                  R$ 12.345,67
                </span>
              </div>
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)]">Meta</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[var(--sea-ink-soft)] text-xs">
                  R$ 15.000,00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};