import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ministeriosService, type CreateDisponibilidadeDto } from '@/features/ministerios/ministerios-service'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Save, Calendar, Check } from 'lucide-react'
import { TitleComponent } from '#/components/TitleComponent'

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
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <TitleComponent
          title="Minha Disponibilidade"
          description="Selecione os dias e turnos que você está disponível para servir."
        />
        <button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="flex items-center gap-2 px-6 py-3.5 bg-(--lagoon) text-white rounded-xl hover:bg-(--lagoon-deep) shadow-lg shadow-(--lagoon)/20 hover:shadow-xl hover:scale-[1.02] transition-all text-sm font-bold"
        >
          {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar Alterações
        </button>
      </div>

      <div className="bg-gray-50/95 rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/90 border-b border-gray-300">
                <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wider">Dia da Semana</th>
                {TURNOS.map(turno => (
                  <th key={turno.label} className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
                    {turno.label}
                    <span className="block text-[10px] font-normal lowercase mt-1">{turno.inicio} - {turno.fim}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {DIAS_SEMANA.map(dia => (
                <tr key={dia.id} className="bg-white/80 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-2.5 text-sm font-semibold text-gray-900">{dia.label}</td>
                  {TURNOS.map(turno => {
                    const isActive = selected[`${dia.id}-${turno.inicio}`]
                    return (
                      <td key={turno.label} className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => toggleTurno(dia.id, turno.inicio)}
                          className={`
                            w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center mx-auto
                            ${isActive 
                              ? 'bg-teal-600 border-teal-600 text-white shadow-inner scale-95' 
                              : 'bg-white border-gray-300 text-transparent hover:border-teal-600/50'
                            }
                          `}
                        >
                          <Check className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
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

      <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
        <Calendar className="w-5 h-5 shrink-0" />
        <p>
          <strong>Dica:</strong> Suas alterações serão levadas em conta na próxima vez que um líder gerar uma escala automática. 
          Se você precisar cancelar uma escala já confirmada, entre em contato direto com o líder do ministério.
        </p>
      </div>
    </div>
  )
}
