import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ministeriosService, type CreateDisponibilidadeDto } from '@/features/ministerios/ministerios-service'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Save, Calendar, Check } from 'lucide-react'

const DIAS_SEMANA = [
  { id: 0, label: 'Domingo' },
  { id: 1, label: 'Segunda' },
  { id: 2, label: 'Terça' },
  { id: 3, label: 'Quarta' },
  { id: 4, label: 'Quinta' },
  { id: 5, label: 'Sexta' },
  { id: 6, label: 'Sábado' },
]

const TURNOS = [
  { label: 'Manhã', inicio: '08:00', fim: '12:00' },
  { label: 'Tarde', inicio: '14:00', fim: '18:00' },
  { label: 'Noite', inicio: '19:00', fim: '22:00' },
]

export function UserAvailability() {
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const { data: disponibilidades, isLoading } = useQuery({
    queryKey: ['disponibilidade', user?.membro_id],
    queryFn: () => ministeriosService.getDisponibilidade(user!.membro_id!),
    enabled: !!user?.membro_id,
  })

  useEffect(() => {
    if (disponibilidades) {
      const initial: Record<string, boolean> = {}
      disponibilidades.forEach(d => {
        const key = `${d.dia_semana}-${d.hora_inicio}`
        initial[key] = true
      })
      setSelected(initial)
    }
  }, [disponibilidades])

  const mutation = useMutation({
    mutationFn: (data: CreateDisponibilidadeDto[]) => 
      ministeriosService.updateDisponibilidade(user!.membro_id!, data),
    onSuccess: () => {
      success('Disponibilidade atualizada com sucesso!')
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao salvar disponibilidade')
    },
  })

  const toggleTurno = (diaId: number, inicio: string) => {
    const key = `${diaId}-${inicio}`
    setSelected(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = () => {
    const data: CreateDisponibilidadeDto[] = []
    
    Object.entries(selected).forEach(([key, value]) => {
      if (value) {
        const [diaId, inicio] = key.split('-')
        const turno = TURNOS.find(t => t.inicio === inicio)
        if (turno) {
          data.push({
            dia_semana: parseInt(diaId),
            hora_inicio: turno.inicio,
            hora_fim: turno.fim
          })
        }
      }
    })

    mutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--lagoon)]" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--sea-ink)] flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[var(--lagoon)]" />
            Minha Disponibilidade
          </h1>
          <p className="text-[var(--sea-ink-soft)] mt-1">
            Selecione os dias e turnos que você está disponível para servir.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--lagoon)] text-white rounded-xl font-bold hover:bg-[var(--lagoon-deep)] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar Alterações
        </button>
      </div>

      <div className="bg-white border border-[var(--line)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[var(--line)]">
                <th className="p-6 text-sm font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider">Dia da Semana</th>
                {TURNOS.map(turno => (
                  <th key={turno.label} className="p-6 text-sm font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider text-center">
                    {turno.label}
                    <span className="block text-[10px] font-normal lowercase mt-1">{turno.inicio} - {turno.fim}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {DIAS_SEMANA.map(dia => (
                <tr key={dia.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-bold text-[var(--sea-ink)]">{dia.label}</td>
                  {TURNOS.map(turno => {
                    const isActive = selected[`${dia.id}-${turno.inicio}`]
                    return (
                      <td key={turno.label} className="p-4 text-center">
                        <button
                          onClick={() => toggleTurno(dia.id, turno.inicio)}
                          className={`
                            w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center mx-auto
                            ${isActive 
                              ? 'bg-[var(--lagoon)] border-[var(--lagoon)] text-white shadow-inner scale-95' 
                              : 'bg-white border-gray-200 text-transparent hover:border-[var(--lagoon)]/50'
                            }
                          `}
                        >
                          <Check className={`w-6 h-6 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
        <Calendar className="w-5 h-5 shrink-0" />
        <p>
          <strong>Dica:</strong> Suas alterações serão levadas em conta na próxima vez que um líder gerar uma escala automática. 
          Se você precisar cancelar uma escala já confirmada, entre em contato direto com o líder do ministério.
        </p>
      </div>
    </div>
  )
}
