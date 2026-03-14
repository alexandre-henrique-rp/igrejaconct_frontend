import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '@/services/api-client'
import { 
  ArrowLeft, 
  Calendar, 
  UserPlus, 
  ClipboardCheck, 
  MoreVertical,
  ChevronRight,
  User,
  X,
  Plus,
  Save,
  Loader2,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/celulas/$id')({
  component: CelulaDetailsPage,
})

function CelulaDetailsPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <CelulaDetails />
      </DashboardLayout>
    </PrivateRoute>
  )
}

function CelulaDetails() {
  const { id } = useParams({ from: '/celulas/$id' })
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'membros' | 'reunioes'>('membros')
  
  // Modais
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)

  // Forms
  const memberForm = useForm()
  const meetingForm = useForm()

  const { data: celula, isLoading } = useQuery({
    queryKey: ['celula', id],
    queryFn: async () => {
      const response = await api.get(`/celulas/${id}`)
      return response.data
    },
  })

  const { data: reunioes } = useQuery({
    queryKey: ['celula-reunioes', id],
    queryFn: async () => {
      const response = await api.get(`/celulas/${id}/reunioes`)
      return response.data
    },
    enabled: !!id
  })

  const { data: todosMembros } = useQuery({
    queryKey: ['membros-select'],
    queryFn: async () => {
      const response = await api.get('/membros')
      return response.data
    },
    enabled: showMemberModal
  })

  // MUTAÇÕES
  const addMemberMutation = useMutation({
    mutationFn: (data: any) => api.post(`/celulas/${id}/membros`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celula', id] })
      setShowMemberModal(false)
      memberForm.reset()
    },
  })

  const addMeetingMutation = useMutation({
    mutationFn: (data: any) => api.post(`/celulas/${id}/reunioes`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celula-reunioes', id] })
      setShowMeetingModal(false)
      meetingForm.reset()
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: (membroId: string) => api.delete(`/celulas/${id}/membros/${membroId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celula', id] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="page-wrap py-8 relative">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/celulas"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {celula.nome}
              </h1>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Célula Ativa
              </span>
            </div>
            <p className="mt-1 text-gray-600">
              Liderada por <span className="font-semibold text-teal-700">{celula.responsavel?.nome_completo || 'Sem líder'}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">Informações Gerais</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <ClipboardCheck className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Descrição</p>
                  <p className="mt-0.5 text-sm text-gray-900">{celula.descricao || 'Nenhuma descrição fornecida.'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Criada em</p>
                  <p className="mt-0.5 text-sm text-gray-900">{new Date(celula.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('membros')}
              className={`pb-4 text-sm font-bold transition-all ${activeTab === 'membros' ? 'border-b-2 border-teal-600 text-teal-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Membros ({celula.membros?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('reunioes')}
              className={`pb-4 text-sm font-bold transition-all ${activeTab === 'reunioes' ? 'border-b-2 border-teal-600 text-teal-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Reuniões ({reunioes?.length || 0})
            </button>
          </div>

          {activeTab === 'membros' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Lista de Membros</h2>
                <button 
                  onClick={() => setShowMemberModal(true)}
                  className="flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 hover:bg-teal-600 hover:text-white transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  Adicionar Membro
                </button>
              </div>
              
              <div className="grid gap-3">
                {celula.membros?.map((item: any) => (
                  <div key={item.membro.id} className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-teal-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.membro.nome_completo}</p>
                        <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-600">
                          {item.papel}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeMemberMutation.mutate(item.membro.id)}
                      className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Histórico de Reuniões</h2>
                <button 
                  onClick={() => setShowMeetingModal(true)}
                  className="flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-all"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Nova Reunião
                </button>
              </div>

              <div className="grid gap-3">
                {reunioes?.map((reuniao: any) => (
                  <div key={reuniao.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-gray-50 text-teal-600">
                        <span className="text-[10px] font-bold uppercase leading-none">{new Date(reuniao.data_reuniao).toLocaleString('pt-BR', { month: 'short' })}</span>
                        <span className="text-lg font-bold leading-none">{new Date(reuniao.data_reuniao).getDate()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{reuniao.tema || 'Reunião Sem Tema'}</p>
                        <p className="text-xs text-gray-600">
                          {reuniao._count?.presencas || 0} Presentes • {reuniao.visitantes || 0} Visitantes
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADICIONAR MEMBRO */}
      {showMemberModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Adicionar Membro</h2>
              <button onClick={() => setShowMemberModal(false)} className="rounded-full p-2 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={memberForm.handleSubmit((data) => addMemberMutation.mutate(data))} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-600">Selecionar Membro</label>
                <select
                  {...memberForm.register('membro_id', { required: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                >
                  <option value="">Selecione...</option>
                  {todosMembros?.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.nome_completo}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-600">Papel na Célula</label>
                <select
                  {...memberForm.register('papel')}
                  defaultValue="MEMBRO"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                >
                  <option value="MEMBRO">Membro</option>
                  <option value="LIDER">Líder</option>
                  <option value="VICE_LIDER">Vice-Líder</option>
                  <option value="ANFITRIAO">Anfitrião</option>
                  <option value="LIDER_EM_TREINAMENTO">Líder em Treinamento</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={addMemberMutation.isPending}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 disabled:opacity-50"
              >
                {addMemberMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                Vincular à Célula
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVA REUNIÃO */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Registrar Reunião</h2>
              <button onClick={() => setShowMeetingModal(false)} className="rounded-full p-2 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={meetingForm.handleSubmit((data) => addMeetingMutation.mutate(data))} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-600">Data da Reunião</label>
                  <input
                    type="datetime-local"
                    {...meetingForm.register('data_reunioes', { required: true })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-600">Tema</label>
                  <input
                    type="text"
                    placeholder="Ex: Gratidão"
                    {...meetingForm.register('tema')}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-600">Visitantes</label>
                  <input
                    type="number"
                    defaultValue={0}
                    {...meetingForm.register('visitantes')}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-600">Conversões</label>
                  <input
                    type="number"
                    defaultValue={0}
                    {...meetingForm.register('conversoes')}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-600">Observações</label>
                <textarea
                  placeholder="Relato da reunião..."
                  {...meetingForm.register('observacoes')}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={addMeetingMutation.isPending}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 disabled:opacity-50"
              >
                {addMeetingMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Salvar Reunião
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
