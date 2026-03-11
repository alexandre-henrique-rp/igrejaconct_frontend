import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patrimonioService } from '@/features/patrimonio/patrimonio-service'
import { membrosService } from '@/features/membros/membros-service'
import { useToast } from '@/contexts/ToastContext'
import { 
  Save,
  X,
  Loader2,
  Calendar,
  Package,
  User,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/patrimonio/emprestimos/novo')({
  component: EmprestimoFormPage,
})

function EmprestimoFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()
  
  const [formData, setFormData] = useState({
    bem_id: '',
    membro_id: '',
    tipo: 'TEMPORARIO',
    data_devolucao_prevista: '',
    motivo: '',
    observacoes: '',
  })

  const { data: bensDisponiveis } = useQuery({
    queryKey: ['bens', 'disponiveis'],
    queryFn: () => patrimonioService.getBens({ status: 'DISPONIVEL' }),
  })

  const { data: membros } = useQuery({
    queryKey: ['membros', 'select'],
    queryFn: () => membrosService.getMembros({ page: 1, limit: 1000 }),
  })

  const createMutation = useMutation({
    mutationFn: patrimonioService.createEmprestimo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprestimos'] })
      queryClient.invalidateQueries({ queryKey: ['bens'] })
      success('Empréstimo criado com sucesso!')
      navigate({ to: '/patrimonio' })
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao criar empréstimo')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate({ to: '/patrimonio' })}
              className="p-2 hover:bg-[var(--line)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[var(--sea-ink)]">Novo Empréstimo</h1>
              <p className="text-sm text-[var(--sea-ink-soft)] mt-1">
                Registre um novo empréstimo de bem patrimonial
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-[var(--line)]">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Selecionar Bem
              </h2>
              <div>
                <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Bem *</label>
                <select
                  value={formData.bem_id}
                  onChange={(e) => setFormData({ ...formData, bem_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  required
                >
                  <option value="">Selecione um bem disponível</option>
                  {bensDisponiveis?.map((bem: any) => (
                    <option key={bem.id} value={bem.id}>
                      {bem.nome} - {bem.numero_patrimonio || 'Sem número'}
                    </option>
                  ))}
                </select>
                {bensDisponiveis?.length === 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Nenhum bem disponível para empréstimo
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[var(--line)]">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Mutuário
              </h2>
              <div>
                <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Membro *</label>
                <select
                  value={formData.membro_id}
                  onChange={(e) => setFormData({ ...formData, membro_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  required
                >
                  <option value="">Selecione um membro</option>
                  {membros?.map((membro: any) => (
                    <option key={membro.id} value={membro.id}>
                      {membro.nome_completo} - {membro.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[var(--line)]">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Detalhes do Empréstimo
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  >
                    <option value="TEMPORARIO">Temporário</option>
                    <option value="INTERNO">Interno</option>
                    <option value="EXTERNO">Externo</option>
                    <option value="PERMANENTE">Permanente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">
                    Data de Devolução Prevista
                  </label>
                  <input
                    type="date"
                    value={formData.data_devolucao_prevista}
                    onChange={(e) => setFormData({ ...formData, data_devolucao_prevista: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Motivo</label>
                  <textarea
                    value={formData.motivo}
                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Observações</label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate({ to: '/patrimonio' })}
                className="px-6 py-2 border border-[var(--line)] rounded-lg text-[var(--sea-ink)] hover:bg-[var(--line)] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Criar Empréstimo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}