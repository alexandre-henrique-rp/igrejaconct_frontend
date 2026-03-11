import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ministeriosService, type CreateMinisterioDto } from '../../ministerios-service'
import { membrosService } from '@/features/membros/membros-service'
import { useToast } from '@/contexts/ToastContext'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export function MinisterioForm() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/ministerios/$id/edit' })
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState<CreateMinisterioDto>({
    nome: '',
    descricao: '',
    responsavel_id: '',
  })

  const { data: ministerio, isLoading: loadingMinisterio } = useQuery({
    queryKey: ['ministerio', id],
    queryFn: () => ministeriosService.getById(id),
    enabled: isEditing,
  })

  const { data: membros } = useQuery({
    queryKey: ['membros'],
    queryFn: membrosService.getAll,
  })

  useEffect(() => {
    if (ministerio) {
      setFormData({
        nome: ministerio.nome,
        descricao: ministerio.descricao || '',
        responsavel_id: ministerio.responsavel_id || '',
      })
    }
  }, [ministerio])

  const createMutation = useMutation({
    mutationFn: ministeriosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministerios'] })
      success('Ministério criado com sucesso!')
      navigate({ to: '/ministerios' })
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao criar ministério')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CreateMinisterioDto) => ministeriosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministerios'] })
      queryClient.invalidateQueries({ queryKey: ['ministerio', id] })
      success('Ministério atualizado com sucesso!')
      navigate({ to: '/ministerios/$id', params: { id } })
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao atualizar ministério')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
  }

  if (loadingMinisterio && isEditing) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--lagoon)]" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate({ to: '/ministerios' })}
        className="mb-4 flex items-center gap-2 text-sm text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-6">
        {isEditing ? 'Editar Ministério' : 'Novo Ministério'}
      </h1>

      <div className="bg-white border border-[var(--line)] rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--sea-ink)]">
              Nome *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              className="w-full px-4 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
              placeholder="Ex: Ministério de Louvor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--sea-ink)]">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
              placeholder="Descreva o propósito deste ministério..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--sea-ink)]">
              Responsável
            </label>
            <select
              value={formData.responsavel_id || ''}
              onChange={(e) => setFormData({ ...formData, responsavel_id: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
            >
              <option value="">Selecione um membro</option>
              {membros?.map((membro) => (
                <option key={membro.id} value={membro.id}>
                  {membro.nome_completo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] disabled:opacity-50 transition-colors"
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: '/ministerios' })}
              className="px-6 py-2 border border-[var(--line)] rounded-lg hover:bg-[var(--lagoon)]/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
