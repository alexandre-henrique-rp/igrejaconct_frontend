import { FC } from 'react';

const NotificacoesPage: FC = () => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-6">Notificações</h1>
          <div className="space-y-6">
            {['Evento de Louvor', 'Reunião de Célula', 'Prazo de Oferta', 'Anúncio Importante'].map((title) => (
              <div key={title} className="rounded-lg bg-white p-4 shadow-sm border border-[var(--line)]">
                <p className="text-sm text-[var(--sea-ink-soft)]">{title}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[var(--sea-ink-soft)] text-xs">
                  Ago 12
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificacoesPage;