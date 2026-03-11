import { FC, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patrimonioService } from '@/features/patrimonio/patrimonio-service';
import { membrosService } from '@/features/membros/membros-service';
import { useToast } from '@/contexts/ToastContext';
import { 
  Plus, 
  Calendar,
  User,
  Package,
  Clock,
  Check,
  X,
  Loader2,
  Search,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const EmprestimosPage: FC = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const { data: emprestimos, isLoading } = useQuery({
    queryKey: ['emprestimos', showOnlyActive],
    queryFn: () => patrimonioService.getEmprestimosAtivos(),
  });

  const devolucaoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      patrimonioService.registerReturn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprestimos'] });
      queryClient.invalidateQueries({ queryKey: ['bens'] });
      success('Devolução registrada com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao registrar devolução');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: patrimonioService.cancelEmprestimo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprestimos'] });
      queryClient.invalidateQueries({ queryKey: ['bens'] });
      success('Empréstimo cancelado com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao cancelar empréstimo');
    },
  });

  const handleDevolucao = (id: string) => {
    if (confirm('Confirmar devolução?')) {
      devolucaoMutation.mutate({ id, data: {} });
    }
  };

  const handleCancel = (id: string) => {
    if (confirm('Tem certeza que deseja cancelar este empréstimo?')) {
      cancelMutation.mutate(id);
    }
  };

  const isOverdue = (dataDevolucaoPrevista?: string) => {
    if (!dataDevolucaoPrevista) return false;
    return new Date(dataDevolucaoPrevista) < new Date();
  };

  const getStatusColor = (status: string, dataDevolucaoPrevista?: string) => {
    if (status === 'DEVOLVIDO') return 'bg-green-100 text-green-700';
    if (status === 'CANCELADO') return 'bg-gray-100 text-gray-700';
    if (isOverdue(dataDevolucaoPrevista)) return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--lagoon)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4">
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--sea-ink)]">Empréstimos</h1>
              <p className="text-sm text-[var(--sea-ink-soft)] mt-1">
                {emprestimos?.length || 0} empréstimos ativos
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/patrimonio/emprestimos/novo'}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Empréstimo
            </button>
          </div>

          {/* Filtro */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setShowOnlyActive(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showOnlyActive 
                  ? 'bg-[var(--lagoon)] text-white' 
                  : 'bg-[var(--line)] text-[var(--sea-ink)] hover:bg-[var(--lagoon)]/10'
              }`}
            >
              Apenas Ativos
            </button>
            <button
              onClick={() => setShowOnlyActive(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !showOnlyActive 
                  ? 'bg-[var(--lagoon)] text-white' 
                  : 'bg-[var(--line)] text-[var(--sea-ink)] hover:bg-[var(--lagoon)]/10'
              }`}
            >
              Todos
            </button>
          </div>

          {/* Lista de Empréstimos */}
          <div className="space-y-4">
            {emprestimos?.map((emprestimo) => (
              <div
                key={emprestimo.id}
                className="bg-white border border-[var(--line)] rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--lagoon)]/10 rounded-lg">
                      <Package className="w-6 h-6 text-[var(--lagoon)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--sea-ink)] text-lg">
                        {emprestimo.bem?.nome}
                      </h3>
                      <p className="text-sm text-[var(--sea-ink-soft)]">
                        {emprestimo.bem?.tipo} • {emprestimo.bem?.numero_patrimonio}
                      </p>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[var(--sea-ink-soft)]" />
                          <span className="text-[var(--sea-ink-soft)]">Mutuário:</span>
                          <span className="font-medium text-[var(--sea-ink)]">
                            {emprestimo.membro?.nome_completo}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[var(--sea-ink-soft)]" />
                          <span className="text-[var(--sea-ink-soft)]">Empréstimo:</span>
                          <span className="font-medium text-[var(--sea-ink)]">
                            {format(new Date(emprestimo.data_emprestimo), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[var(--sea-ink-soft)]" />
                          <span className="text-[var(--sea-ink-soft)]">Devolução:</span>
                          <span className={`font-medium ${isOverdue(emprestimo.data_devolucao_prevista) ? 'text-red-600' : 'text-[var(--sea-ink)]'}`}>
                            {emprestimo.data_devolucao_prevista 
                              ? format(new Date(emprestimo.data_devolucao_prevista), 'dd/MM/yyyy', { locale: ptBR })
                              : 'Sem prazo'}
                          </span>
                        </div>
                      </div>

                      {emprestimo.motivo && (
                        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
                          <strong>Motivo:</strong> {emprestimo.motivo}
                        </p>
                      )}

                      {emprestimo.observacoes && (
                        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
                          <strong>Observações:</strong> {emprestimo.observacoes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(emprestimo.status, emprestimo.data_devolucao_prevista)}`}>
                      {emprestimo.status === 'ATIVO' && isOverdue(emprestimo.data_devolucao_prevista) && (
                        <AlertTriangle className="inline w-3 h-3 mr-1" />
                      )}
                      {emprestimo.status === 'ATIVO' ? 'Emprestado' : emprestimo.status}
                    </span>

                    {emprestimo.status === 'ATIVO' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleDevolucao(emprestimo.id)}
                          disabled={devolucaoMutation.isPending}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" />
                          Devolver
                        </button>
                        <button
                          onClick={() => handleCancel(emprestimo.id)}
                          disabled={cancelMutation.isPending}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <X className="w-3 h-3" />
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {emprestimos?.length === 0 && (
              <div className="text-center py-12 text-[var(--sea-ink-soft)]">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum empréstimo encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmprestimosPage;