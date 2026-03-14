import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ministeriosService, type CreateDisponibilidadeDto } from '@/features/ministerios/ministerios-service'
import { igrejasService } from '@/services/igrejas-service'
import { membrosService } from '@/services/membros-service'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Save, Calendar, Check, ArrowLeft, User, Building2 } from 'lucide-react'
import { TitleComponent } from '#/components/TitleComponent'
import { PermissionGuard } from '@/components/PermissionGuard'

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

export const Route = createFileRoute('/ministerios/admin/disponibilidade')({
  component: AdminDisponibilidadePage,
})

function AdminDisponibilidadePage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <PermissionGuard requiredRoles={['ADMIN', 'ADMIN_MASTER', 'PASTOR']}>
          <AdminDisponibilidade />
        </PermissionGuard>
      </DashboardLayout>
    </PrivateRoute>
  )
}

function AdminDisponibilidade() {
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()
  const [selectedIgrejaId, setSelectedIgrejaId] = useState<string>('')
  const [selectedMembroId, setSelectedMembroId] = useState<string>('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  // Buscar igrejas (apenas para ADMIN/ADMIN_MASTER)
  const { data: igrejas, isLoading: loadingIgrejas } = useQuery({
    queryKey: ['igrejas-select'],
    queryFn: () => igrejasService.getAll(),
    enabled: user?.role === 'ADMIN' || user?.role === 'ADMIN_MASTER',
  })

  // Buscar membros da igreja selecionada
  const { data: membros, isLoading: loadingMembros } = useQuery({
    queryKey: ['membros', selectedIgrejaId],
    queryFn: () => membrosService.getByIgreja(selectedIgrejaId),
    enabled: !!selectedIgrejaId,
  })

  // Buscar disponibilidade do membro selecionado
  const { data: disponibilidades, isLoading: loadingDisponibilidade } = useQuery({
    queryKey: ['disponibilidade', selectedMembroId],
    queryFn: () => ministeriosService.getDisponibilidade(selectedMembroId),
    enabled: !!selectedMembroId,
  })

  // Atualizar estado quando disponibilidades mudam
  useState(() => {
    if (disponibilidades) {
      const initial: Record<string, boolean> = {}
      disponibilidades.forEach(d => {
        const key = `${d.dia_semana}-${d.hora_inicio}`
        initial[key] = true
      })
      setSelected(initial)
    }
  })

  const mutation = useMutation({
    mutationFn: (data: CreateDisponibilidadeDto[]) => 
      ministeriosService.updateDisponibilidade(selectedMembroId, data),
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

  const membroSelecionado = membros?.find(m => m.id === selectedMembroId)

  return (
    <div className="page-wrap py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate({ to: '/ministerios' })}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Ministérios
        </button>
        
        <TitleComponent
          title="Gerenciar Disponibilidade"
          description="Selecione uma igreja e um membro para gerenciar sua disponibilidade para os ministérios."
        />
      </div>

      {/* Seleção de Igreja e Membro */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selecionar Igreja */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              Selecionar Igreja
            </label>
            {loadingIgrejas ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando igrejas...
              </div>
            ) : (
              <select
                value={selectedIgrejaId}
                onChange={(e) => {
                  setSelectedIgrejaId(e.target.value)
                  setSelectedMembroId('')
                  setSelected({})
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all"
              >
                <option value="">Selecione uma igreja...</option>
                {igrejas?.map((igreja) => (
                  <option key={igreja.id} value={igreja.id}>
                    {igreja.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selecionar Membro */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Selecionar Membro
            </label>
            {loadingMembros ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando membros...
              </div>
            ) : !selectedIgrejaId ? (
              <div className="text-sm text-gray-500 italic">
                Selecione uma igreja primeiro
              </div>
            ) : (
              <select
                value={selectedMembroId}
                onChange={(e) => setSelectedMembroId(e.target.value)}
                disabled={!selectedIgrejaId}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Selecione um membro...</option>
                {membros?.map((membro) => (
                  <option key={membro.id} value={membro.id}>
                    {membro.nome_completo}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Info do membro selecionado */}
        {membroSelecionado && (
          <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                {membroSelecionado.nome_completo.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{membroSelecionado.nome_completo}</p>
                <p className="text-sm text-gray-600">{membroSelecionado.email || 'Sem email'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabela de Disponibilidade */}
      {selectedMembroId && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Disponibilidade de {membroSelecionado?.nome_completo}
            </h3>
            <button
              onClick={handleSave}
              disabled={mutation.isPending || loadingDisponibilidade}
              className="flex items-center gap-2 px-6 py-3.5 bg-(--lagoon) text-white rounded-xl hover:bg-(--lagoon-deep) shadow-lg shadow-(--lagoon)/20 hover:shadow-xl hover:scale-[1.02] transition-all text-sm font-bold disabled:opacity-70"
            >
              {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Salvar Alterações
            </button>
          </div>

          {loadingDisponibilidade ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : (
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
          )}

          <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
            <Calendar className="w-5 h-5 shrink-0" />
            <p>
              <strong>Dica:</strong> As alterações serão levadas em conta na próxima vez que um líder gerar uma escala automática. 
              Certifique-se de salvar as alterações antes de sair.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
