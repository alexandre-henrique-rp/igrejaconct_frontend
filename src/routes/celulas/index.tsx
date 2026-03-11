import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api-client'
import { Home, Plus, Users, Search, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/celulas/')({
  component: CelulasList,
})

function CelulasList() {
  const { data: celulas, isLoading } = useQuery({
    queryKey: ['celulas'],
    queryFn: async () => {
      const response = await api.get('/celulas')
      return response.data
    },
  })

  return (
    <div className="page-wrap py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
            Células e Grupos
          </h1>
          <p className="mt-1 text-[var(--sea-ink-soft)]">
            Gerencie os pequenos grupos e reuniões da igreja.
          </p>
        </div>
        <Link
          to="/celulas/new"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--lagoon)]/20 hover:bg-[var(--lagoon-deep)] transition-all"
        >
          <Plus className="h-4 w-4" />
          Nova Célula
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
          <input
            type="text"
            placeholder="Buscar por nome ou líder..."
            className="w-full rounded-xl border border-[var(--line)] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--lagoon)] border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {celulas?.map((celula: any) => (
            <Link
              key={celula.id}
              to="/celulas/$id"
              params={{ id: celula.id }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white p-5 transition-all hover:border-[var(--lagoon-soft)] hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-[var(--sand-soft)] flex items-center justify-center text-[var(--lagoon)]">
                  <Home className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-[var(--lagoon-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--lagoon-deep)]">
                  <Users className="h-3 w-3" />
                  {celula._count?.membros || 0} Membros
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)]">
                  {celula.nome}
                </h3>
                <p className="mt-1 text-sm text-[var(--sea-ink-soft)] line-clamp-2">
                  {celula.descricao || 'Sem descrição definida.'}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[var(--lagoon)] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {celula.responsavel?.nome_completo?.charAt(0) || 'L'}
                  </div>
                  <span className="text-xs font-medium text-[var(--sea-ink)]">
                    {celula.responsavel?.nome_completo || 'Sem líder'}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--sea-ink-soft)] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
