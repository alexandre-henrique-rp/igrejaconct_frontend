import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api-client'
import { ArrowLeft, Save, Loader2, Home, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/celulas/new')({
  component: NewCelula,
})

function NewCelula() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Buscar membros para selecionar o líder
  const { data: membros } = useQuery({
    queryKey: ['membros-select'],
    queryFn: async () => {
      const response = await api.get('/membros')
      return response.data
    }
  })

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/celulas', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celulas'] })
      navigate({ to: '/celulas' })
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <div className="page-wrap py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/celulas"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--sea-ink-soft)] hover:bg-[var(--sand-soft)] transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
            Nova Célula
          </h1>
          <p className="mt-1 text-[var(--sea-ink-soft)]">
            Cadastre um novo pequeno grupo na plataforma.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--sea-ink)] flex items-center gap-2">
                <Home className="h-4 w-4 text-[var(--lagoon)]" />
                Nome da Célula
              </label>
              <input
                {...register('nome', { required: 'Nome é obrigatório' })}
                type="text"
                placeholder="Ex: Célula Boas Novas"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/10 transition-all"
              />
              {errors.nome && (
                <span className="text-xs font-medium text-red-500">{(errors.nome as any).message}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--sea-ink)] flex items-center gap-2">
                <User className="h-4 w-4 text-[var(--lagoon)]" />
                Líder Responsável
              </label>
              <select
                {...register('responsavel_id')}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/10 transition-all appearance-none"
              >
                <option value="">Selecione um líder...</option>
                {membros?.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.nome_completo}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--sea-ink)]">
              Descrição / Objetivo
            </label>
            <textarea
              {...register('descricao')}
              rows={4}
              placeholder="Descreva o propósito desta célula ou informações importantes..."
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--sand-soft)]/30 px-4 py-3 text-sm focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/10 transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--line)]">
            <Link
              to="/celulas"
              className="rounded-full px-8 py-3 text-sm font-semibold text-[var(--sea-ink-soft)] hover:bg-[var(--sand-soft)] transition-all"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--lagoon)]/20 hover:bg-[var(--lagoon-deep)] transition-all disabled:opacity-70"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar Célula
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
