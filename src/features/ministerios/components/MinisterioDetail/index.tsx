import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ministeriosService } from '@/features/ministerios/ministerios-service'
import { membrosService } from '@/features/membros/membros-service'
import { useToast } from '@/contexts/ToastContext'
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Users,
  User,
  Loader2,
  Plus,
  Check,
  X
} from 'lucide-react'

import { EscalasTab } from './EscalasTab'
import { FrequenciaTab } from './FrequenciaTab'

export function MinisterioDetail() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/ministerios/$id' })
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()
  const [activeTab, setActiveTab] = useState<'membros' | 'escalas' | 'frequencia'>('membros')
  const [showAddMember, setShowAddMember] = useState(false)
  const [selectedMembroId, setSelectedMembroId] = useState('')
  const [selectedFuncao, setSelectedFuncao] = useState('')

  const { data: ministerio, isLoading } = useQuery({
    queryKey: ['ministerio', id],
    queryFn: () => ministeriosService.getById(id),
  })

  const { data: todosMembros } = useQuery({
    queryKey: ['membros'],
    queryFn: membrosService.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: ministeriosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministerios'] })
      success('Ministério removido com sucesso!')
      navigate({ to: '/ministerios' })
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao remover ministério')
    },
  })

  const addMembroMutation = useMutation({
    mutationFn: (data: { membro_id: string; funcao?: string }) => 
      ministeriosService.addMembro(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministerio', id] })
      setShowAddMember(false)
      setSelectedMembroId('')
      setSelectedFuncao('')
      success('Membro adicionado com sucesso!')
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao adicionar membro')
    },
  })

  const removeMembroMutation = useMutation({
    mutationFn: (membroId: string) => ministeriosService.removeMembro(id, membroId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministerio', id] })
      success('Membro removido com sucesso!')
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao remover membro')
    },
  })

  const handleAddMembro = () => {
    if (selectedMembroId) {
      addMembroMutation.mutate({ 
        membro_id: selectedMembroId, 
        funcao: selectedFuncao || undefined 
      })
    }
  }

  const membrosIds = ministerio?.membros?.map(m => m.membro_id) || []
  const membrosDisponiveis = todosMembros?.filter(m => !membrosIds.includes(m.id)) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!ministerio) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Ministério não encontrado</p>
        <button
          onClick={() => navigate({ to: '/ministerios' })}
          className="mt-4 text-teal-600 hover:underline"
        >
          Voltar para lista
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate({ to: '/ministerios' })}
        className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-600/10 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ministerio.nome}</h1>
              {ministerio.descricao && (
                <p className="text-sm text-gray-600 mt-1">{ministerio.descricao}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate({ to: '/ministerios/$id/edit', params: { id } })}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => {
                 if (confirm('Tem certeza que deseja excluir este ministério?')) {
                   deleteMutation.mutate(id)
                 }
              }}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('membros')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'membros' 
              ? 'text-teal-600 border-b-2 border-teal-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Membros ({ministerio.membros?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('escalas')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'escalas' 
              ? 'text-teal-600 border-b-2 border-teal-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Escalas
        </button>
        <button
          onClick={() => setActiveTab('frequencia')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'frequencia' 
              ? 'text-teal-600 border-b-2 border-teal-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Frequência
        </button>
      </div>

      {activeTab === 'membros' && (
        <div>
          {/* ... existing membros code ... */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Membros do Ministério</h2>
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Membro
            </button>
          </div>

          {showAddMember && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-3">Adicionar novo membro</h3>
              <div className="flex gap-4">
                <select
                  value={selectedMembroId}
                  onChange={(e) => setSelectedMembroId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Selecione um membro</option>
                  {membrosDisponiveis.map((membro) => (
                    <option key={membro.id} value={membro.id}>
                      {membro.nome_completo}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={selectedFuncao}
                  onChange={(e) => setSelectedFuncao(e.target.value)}
                  placeholder="Função (opcional)"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                />
                <button
                  onClick={handleAddMembro}
                  disabled={!selectedMembroId || addMembroMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowAddMember(false)
                    setSelectedMembroId('')
                    setSelectedFuncao('')
                  }}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {ministerio.membros?.map((m) => (
              <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{m.membro.nome_completo}</p>
                    {m.funcao && (
                      <p className="text-xs text-gray-600">{m.funcao}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Remover este membro do ministério?')) {
                      removeMembroMutation.mutate(m.membro_id)
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {ministerio.membros?.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum membro cadastrado</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'escalas' && <EscalasTab ministerioId={id} />}
      
      {activeTab === 'frequencia' && <FrequenciaTab ministerioId={id} />}
    </div>
  )
}
