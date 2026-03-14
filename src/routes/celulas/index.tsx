import { createFileRoute, Link } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api-client'
import { Home, Plus, Users, Search, ChevronRight } from 'lucide-react'
import { TitleComponent } from '#/components/TitleComponent';
import { ButtonNew } from '#/components/button_new';

export const Route = createFileRoute('/celulas/')({
  component: CelulasPage,
})

function CelulasPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <CelulasList />
      </DashboardLayout>
    </PrivateRoute>
  )
}

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
          <TitleComponent title="Células e Grupos" description="Gerencie os pequenos grupos e reuniões da igreja." />
        </div>
        <ButtonNew nav="/celulas/new" label="Nova Célula" />
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Buscar por nome ou líder..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {celulas?.map((celula: any) => (
            <Link
              key={celula.id}
              to="/celulas/$id"
              params={{ id: celula.id }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-teal-50 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-teal-600">
                  <Home className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  <Users className="h-3 w-3" />
                  {celula._count?.membros || 0} Membros
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-gray-900 group-hover:text-teal-700">
                  {celula.nome}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {celula.descricao || 'Sem descrição definida.'}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {celula.responsavel?.nome_completo?.charAt(0) || 'L'}
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    {celula.responsavel?.nome_completo || 'Sem líder'}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
