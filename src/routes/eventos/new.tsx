import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api-client'
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Plus
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/eventos/new')({
  component: NewEvento,
})

function NewEvento() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  // FETCH: CATEGORIAS E RESPONSÁVEIS
  const { data: categorias } = useQuery({
    queryKey: ['eventos-categorias'],
    queryFn: async () => {
      const response = await api.get('/eventos/categorias')
      return response.data
    }
  })

  const { data: membros } = useQuery({
    queryKey: ['membros-select'],
    queryFn: async () => {
      const response = await api.get('/membros')
      return response.data
    }
  })

  // MUTAÇÕES
  const createEventMutation = useMutation({
    mutationFn: (data: any) => api.post('/eventos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
      navigate({ to: '/eventos' })
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: (nome: string) => api.post('/eventos/categorias', { nome }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos-categorias'] })
      setShowNewCategory(false)
      setNewCatName('')
    },
  })

  const onSubmit = (data: any) => {
    // Converter campos numéricos
    const formattedData = {
      ...data,
      capacidade: data.capacidade ? parseInt(data.capacidade) : undefined,
      valor: data.valor ? parseFloat(data.valor) : 0,
    }
    createEventMutation.mutate(formattedData)
  }

  return (
    <div className="page-wrap py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/eventos"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--sea-ink-soft)] hover:bg-[var(--sand-soft)] transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
            Novo Evento
          </h1>
          <p className="mt-1 text-[var(--sea-ink-soft)]">
            Agende um novo culto, conferência ou curso.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Nome do Evento */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--sea-ink)]">Nome do Evento</label>
              <input
                {...register('nome', { required: 'Nome é obrigatório' })}
                type="text"
                placeholder="Ex: Conferência de Jovens 2026"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/10"
              />
              {errors.nome && <span className="text-xs text-red-500">{(errors.nome as any).message}</span>}
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--sea-ink)]">Categoria</label>
                <button 
                  type="button"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                  className="text-xs font-bold text-[var(--lagoon)] hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Nova Categoria
                </button>
              </div>
              {showNewCategory ? (
                <div className="flex gap-2">
                  <input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nome da categoria..."
                    className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-2 text-xs focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => createCategoryMutation.mutate(newCatName)}
                    className="rounded-xl bg-[var(--lagoon)] px-4 text-xs font-bold text-white"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <select
                  {...register('categoria_id', { required: 'Categoria é obrigatória' })}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/10 appearance-none"
                >
                  <option value="">Selecione...</option>
                  {categorias?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              )}
              {errors.categoria_id && <span className="text-xs text-red-500">{(errors.categoria_id as any).message}</span>}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Data Início */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--sea-ink)] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[var(--lagoon)]" /> Início
              </label>
              <input
                {...register('data_inicio', { required: true })}
                type="datetime-local"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:outline-none"
              />
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--sea-ink)] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[var(--lagoon)]" /> Término
              </label>
              <input
                {...register('data_fim', { required: true })}
                type="datetime-local"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Local */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--sea-ink)] flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--lagoon)]" /> Local
              </label>
              <input
                {...register('local')}
                placeholder="Auditório Principal"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:outline-none"
              />
            </div>

            {/* Capacidade */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--sea-ink)] flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--lagoon)]" /> Capacidade
              </label>
              <input
                {...register('capacidade')}
                type="number"
                placeholder="Sem limite"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:outline-none"
              />
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--sea-ink)] flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[var(--lagoon)]" /> Valor Inscrição
              </label>
              <input
                {...register('valor')}
                type="number"
                step="0.01"
                placeholder="0.00 (Grátis)"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--sea-ink)]">Responsável</label>
            <select
              {...register('responsavel_id')}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:outline-none appearance-none"
            >
              <option value="">Selecione um líder...</option>
              {membros?.map((m: any) => (
                <option key={m.id} value={m.id}>{m.nome_completo}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--sea-ink)]">Descrição</label>
            <textarea
              {...register('descricao')}
              rows={4}
              placeholder="Informações detalhadas sobre o evento..."
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--line)]">
            <Link
              to="/eventos"
              className="rounded-full px-8 py-3 text-sm font-semibold text-[var(--sea-ink-soft)] hover:bg-[var(--sand-soft)]"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={createEventMutation.isPending}
              className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--lagoon)]/20 hover:bg-[var(--lagoon-deep)] disabled:opacity-70"
            >
              {createEventMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
