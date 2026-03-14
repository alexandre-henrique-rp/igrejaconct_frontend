import { useQuery } from '@tanstack/react-query'
import { ministeriosService } from '@/features/ministerios/ministerios-service'
import { Loader2, TrendingUp, Users, Award, AlertCircle } from 'lucide-react'

interface FrequenciaTabProps {
  ministerioId: string
}

export function FrequenciaTab({ ministerioId }: FrequenciaTabProps) {
  const { data: report, isLoading } = useQuery({
    queryKey: ['frequencia', ministerioId],
    queryFn: () => ministeriosService.getFrequencia(ministerioId),
  })

   if (isLoading) {
     return (
       <div className="flex items-center justify-center p-12">
         <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
       </div>
     )
   }

   return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total de Voluntários</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{report?.membros?.length || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-600">Taxa Média de Presença</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {(report?.membros?.reduce((acc: number, m: any) => acc + m.taxa_presenca, 0) / (report?.membros?.length || 1)).toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-600">Engajamento</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {report?.membros?.filter((m: any) => m.taxa_presenca >= 80).length} Ativos 80%+
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Desempenho por Voluntário</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Membro</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">Escalas</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">Presenças</th>
                <th className="p-4 text-xs font-bold text-gray-600 uppercase">Frequência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report?.membros?.map((m: any) => (
                <tr key={m.membro_id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 text-sm">{m.nome}</td>
                  <td className="p-4 text-center text-sm text-gray-600">{m.total_escalas}</td>
                  <td className="p-4 text-center text-sm text-gray-600">{m.confirmadas}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[100px]">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            m.taxa_presenca >= 80 ? 'bg-green-500' : 
                            m.taxa_presenca >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${m.taxa_presenca}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-900 w-10">{m.taxa_presenca.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}

              {(!report?.membros || report.membros.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-600">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p>Nenhum dado de frequência disponível.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
