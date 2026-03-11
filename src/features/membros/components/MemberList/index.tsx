import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { membrosService } from '../../membros-service'
import type { TipoMembro } from '../../types'
import { useToast } from '@/contexts/ToastContext'
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  User,
  Mail,
  Phone
} from 'lucide-react'
import { SkeletonCard } from '@/components/skeleton/SkeletonCard'

const tipoLabels: Record<TipoMembro, string> = {
  ATIVO: 'Ativo',
  CONGREGADO: 'Congregado',
  VISITANTE: 'Visitante',
  AFASTADO: 'Afastado',
  TRANSFERIDO: 'Transferido',
  FALECIDO: 'Falecido',
}

const tipoColors: Record<TipoMembro, string> = {
  ATIVO: 'bg-green-100 text-green-700',
  CONGREGADO: 'bg-blue-100 text-blue-700',
  VISITANTE: 'bg-purple-100 text-purple-700',
  AFASTADO: 'bg-yellow-100 text-yellow-700',
  TRANSFERIDO: 'bg-gray-100 text-gray-700',
  FALECIDO: 'bg-red-100 text-red-700',
}

export function MemberList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()
  
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState<TipoMembro | ''>('')

  const { data: membros, isLoading } = useQuery({
    queryKey: ['membros', { search, tipo: tipoFilter }],
    queryFn: () => {
      if (search) {
        return membrosService.search(search)
      } else if (tipoFilter) {
        return membrosService.getByType(tipoFilter)
      }
      return membrosService.getAll()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: membrosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membros'] })
      success('Membro removido com sucesso!')
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao remover membro')
    },
  })

   const handleDelete = (id: string, e: React.MouseEvent) => {
     e.stopPropagation()
     if (confirm('Tem certeza que deseja excluir este membro?')) {
       deleteMutation.mutate(id)
     }
   }

   if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--sea-ink)]">Membros</h1>
          <p className="text-sm text-[var(--sea-ink-soft)] mt-1">
            {membros?.length || 0} membros cadastrados
          </p>
        </div>
        <button
          onClick={() => navigate({ to: '/membros/new' })}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Membro
        </button>
      </div>

       <div className="flex gap-4 mb-6">
         <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input
             type="text"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Buscar por nome, email ou telefone..."
             className="w-full pl-10 pr-4 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
           />
         </div>
         <select
           value={tipoFilter}
           onChange={(e) => setTipoFilter(e.target.value as TipoMembro | '')}
           className="px-4 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
         >
           <option value="">Todos os tipos</option>
           <option value="ATIVO">Ativo</option>
           <option value="CONGREGADO">Congregado</option>
           <option value="VISITANTE">Visitante</option>
           <option value="AFASTADO">Afastado</option>
           <option value="TRANSFERIDO">Transferido</option>
           <option value="FALECIDO">Falecido</option>
         </select>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {membros?.map((membro) => (
          <div
            key={membro.id}
            onClick={() => navigate({ to: '/membros/$id', params: { id: membro.id } })}
            className="bg-white border border-[var(--line)] rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[var(--lagoon)]/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[var(--lagoon)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--sea-ink)] line-clamp-1">
                    {membro.nome_completo}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tipoColors[membro.tipo_membro]}`}>
                    {tipoLabels[membro.tipo_membro]}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate({ to: '/membros/$id/edit', params: { id: membro.id } }); }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(membro.id, e)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {membro.email && (
                <div className="flex items-center gap-2 text-[var(--sea-ink-soft)]">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{membro.email}</span>
                </div>
              )}
              {membro.telefone && (
                <div className="flex items-center gap-2 text-[var(--sea-ink-soft)]">
                  <Phone className="w-3 h-3" />
                  <span>{membro.telefone}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t border-[var(--line)]">
                <span className="text-xs text-[var(--sea-ink-soft)]">
                  Data de cadastro
                </span>
                <span className="text-xs font-medium text-[var(--sea-ink)]">
                  {membro.created_at ? new Date(membro.created_at).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {membros?.length === 0 && (
          <div className="col-span-full text-center py-12 text-[var(--sea-ink-soft)]">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum membro encontrado.</p>
            <button
              onClick={() => navigate({ to: '/membros/new' })}
              className="mt-4 px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors"
            >
              Cadastrar primeiro membro
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
