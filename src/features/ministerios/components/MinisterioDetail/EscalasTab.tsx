import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ministeriosService } from '@/features/ministerios/ministerios-service'
import { useToast } from '@/contexts/ToastContext'
import { 
  Calendar, 
  Loader2, 
  Plus, 
  Sparkles, 
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface EscalasTabProps {
  ministerioId: string
}

export function EscalasTab({ ministerioId }: EscalasTabProps) {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  const { data: escalas, isLoading } = useQuery({
    queryKey: ['escalas', ministerioId],
    queryFn: () => ministeriosService.getEscalas(ministerioId),
  })

  const autoFillMutation = useMutation({
    mutationFn: (escalaId: string) => ministeriosService.autoFillEscala(escalaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalas', ministerioId] })
      success('Escala preenchida automaticamente com sucesso!')
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao preencher escala')
    },
  })

  const notificarMutation = useMutation({
    mutationFn: (escalaId: string) => ministeriosService.notificarEscala(escalaId),
    onSuccess: () => {
      success('Notificações enviadas via Telegram!')
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao enviar notificações')
    },
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMADO':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'RECUSADO':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-amber-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Escalas de Serviço</h2>
        <div className="flex gap-2">
           <button
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nova Escala
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {escalas?.map((escala) => (
          <div key={escala.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-teal-600 text-white p-2 rounded-lg text-center min-w-[60px]">
                  <span className="block text-xs uppercase font-bold">{format(new Date(escala.data), 'MMM', { locale: ptBR })}</span>
                  <span className="block text-xl font-black">{format(new Date(escala.data), 'dd')}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {format(new Date(escala.data), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {/* {format(new Date(escala.hora_inicio), 'HH:mm')} - {format(new Date(escala.hora_fim), 'HH:mm')} */}
                      Horário comercial
                    </div>
                    {/* {escala.local && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {escala.local}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => autoFillMutation.mutate(escala.id)}
                  disabled={autoFillMutation.isPending}
                  title="Preencher Automaticamente"
                  className="p-2 text-teal-600 hover:bg-teal-600/10 rounded-lg transition-colors border border-teal-600/20"
                >
                  <Sparkles className={`w-4 h-4 ${autoFillMutation.isPending ? 'animate-pulse' : ''}`} />
                </button>
                <button
                  onClick={() => notificarMutation.mutate(escala.id)}
                  disabled={notificarMutation.isPending}
                  title="Notificar Voluntários"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                >
                  <Send className={`w-4 h-4 ${notificarMutation.isPending ? 'animate-pulse' : ''}`} />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {escala.membros?.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                          {m.membro.foto_url ? (
                            <img src={m.membro.foto_url} alt={m.membro.nome_completo} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-gray-400">{m.membro.nome_completo[0]}</span>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          {getStatusIcon(m.status)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{m.membro.nome_completo}</p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">{m.funcao || 'Voluntário'}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!escala.membros || escala.membros.length === 0) && (
                  <div className="col-span-full py-6 text-center border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="text-sm text-gray-600">Nenhum voluntário escalado.</p>
                    <button 
                      onClick={() => autoFillMutation.mutate(escala.id)}
                      className="mt-2 text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 mx-auto"
                    >
                      <Sparkles className="w-3 h-3" />
                      Tentar Preenchimento Automático
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {escalas?.length === 0 && (
          <div className="text-center py-16 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20 text-gray-900" />
            <h3 className="text-lg font-bold text-gray-900">Nenhuma escala programada</h3>
            <p className="text-gray-600 max-w-xs mx-auto mt-2">
              Comece criando uma nova data de escala para este ministério.
            </p>
            <button className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg font-bold hover:shadow-lg transition-all">
              Criar Primeira Escala
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
