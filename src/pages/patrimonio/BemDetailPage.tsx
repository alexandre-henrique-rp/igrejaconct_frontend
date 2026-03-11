import { FC, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { patrimonioService } from '@/features/patrimonio/patrimonio-service';
import { useToast } from '@/contexts/ToastContext';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  MapPin,
  TrendingUp,
  Camera,
  History,
  Wrench,
  Plus,
  Loader2,
  AlertTriangle,
  Clock
} from 'lucide-react';

const statusColors: Record<string, string> = {
  DISPONIVEL: 'bg-green-100 text-green-700',
  EMPRESTADO: 'bg-yellow-100 text-yellow-700',
  EM_MANUTENCAO: 'bg-orange-100 text-orange-700',
  MANUTENCAO_AGENDADA: 'bg-blue-100 text-blue-700',
  BAIXADO: 'bg-red-100 text-red-700',
  PERDIDO: 'bg-gray-100 text-gray-700',
};

export const BemDetailPage: FC = () => {
  const { id } = useParams({ from: '/patrimonio/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('info');

  const { data: bem, isLoading } = useQuery({
    queryKey: ['bem', id],
    queryFn: () => patrimonioService.getBemById(id!),
  });

  const deleteMutation = useMutation({
    mutationFn: () => patrimonioService.deleteBem(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bens'] });
      success('Bem removido com sucesso!');
       navigate({ to: '/patrimonio' });
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao remover bem');
    },
  });

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  const isOverdue = (dataDevolucaoPrevista?: string) => {
    if (!dataDevolucaoPrevista) return false;
    return new Date(dataDevolucaoPrevista) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--lagoon)]" />
      </div>
    );
  }

  if (!bem) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--sea-ink-soft)]">Bem não encontrado</p>
        <button
           onClick={() => navigate({ to: '/patrimonio' })}
          className="mt-4 text-[var(--lagoon)] hover:underline"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: 'Informações' },
    { id: 'fotos', label: 'Fotos', count: bem.fotos?.length || 0 },
    { id: 'emprestimos', label: 'Empréstimos', count: bem.emprestimos?.length || 0 },
    { id: 'manutencoes', label: 'Manutenções', count: bem.manutencoes?.length || 0 },
    { id: 'historico', label: 'Histórico' },
  ];

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="py-8">
          <button
            onClick={() => navigate({ to: '/patrimonio' })}
            className="flex items-center gap-2 text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[var(--sea-ink)]">{bem.nome}</h1>
              <p className="text-sm text-[var(--sea-ink-soft)] mt-1">
                {bem.numero_patrimonio || 'Sem número'} • {bem.tipo}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate({ to: `/patrimonio/${id}/editar` })}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--line)] rounded-lg hover:bg-[var(--line)] transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este bem?')) {
                    deleteMutation.mutate();
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

        {/* Tabs */}
        <div className="mb-6 border-b border-[var(--line)]">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-[var(--lagoon)] text-[var(--lagoon)]'
                    : 'border-transparent text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] hover:border-gray-300'
                  }
                `}
              >
                {tab.id === 'info' && <Package className="w-4 h-4" />}
                {tab.id === 'fotos' && <Camera className="w-4 h-4" />}
                {tab.id === 'emprestimos' && <Calendar className="w-4 h-4" />}
                {tab.id === 'manutencoes' && <Wrench className="w-4 h-4" />}
                {tab.id === 'historico' && <History className="w-4 h-4" />}
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-[var(--lagoon)]/20 text-[var(--lagoon)]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-[var(--line)]">
                  <h3 className="font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Identificação
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-[var(--sea-ink-soft)]">Número Patrimonial</dt>
                      <dd className="font-medium text-[var(--sea-ink)]">{bem.numero_patrimonio || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--sea-ink-soft)]">Código de Barras</dt>
                      <dd className="font-medium text-[var(--sea-ink)]">{bem.codigo_barras || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--sea-ink-soft)]">Status</dt>
                      <dd className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[bem.status]}`}>
                          {getStatusLabel(bem.status)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[var(--line)]">
                  <h3 className="font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Localização
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-[var(--sea-ink-soft)]">Local</dt>
                      <dd className="font-medium text-[var(--sea-ink)]">{bem.localizacao || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--sea-ink-soft)]">Responsável</dt>
                      <dd className="font-medium text-[var(--sea-ink)]">
                        {bem.responsavel?.nome_completo || '-'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[var(--line)]">
                  <h3 className="font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Aquisição
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-[var(--sea-ink-soft)]">Data</dt>
                      <dd className="font-medium text-[var(--sea-ink)]">
                        {bem.data_aquisicao ? new Date(bem.data_aquisicao).toLocaleDateString('pt-BR') : '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--sea-ink-soft)]">Valor</dt>
                      <dd className="font-medium text-[var(--sea-ink)]">
                        {bem.valor_aquisicao ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bem.valor_aquisicao) : '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--sea-ink-soft)]">Fonte</dt>
                      <dd className="font-medium text-[var(--sea-ink)]">{bem.fonte || '-'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {bem.descricao && (
                <div className="bg-white p-6 rounded-xl border border-[var(--line)]">
                  <h3 className="font-semibold text-[var(--sea-ink)] mb-2">Descrição</h3>
                  <p className="text-sm text-[var(--sea-ink-soft)]">{bem.descricao}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fotos' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--sea-ink)]">Fotos do Bem</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors">
                  <Plus className="w-4 h-4" />
                  Adicionar Foto
                </button>
              </div>
              {bem.fotos?.length === 0 ? (
                <div className="text-center py-12 text-[var(--sea-ink-soft)]">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma foto cadastrada</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bem.fotos?.map((foto) => (
                    <div key={foto.id} className="relative group">
                      <img
                        src={`/api/arquivos/${foto.arquivo.id}/download`}
                        alt={foto.descricao || 'Foto'}
                        className="w-full h-32 object-cover rounded-lg border border-[var(--line)]"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {foto.descricao || 'Sem descrição'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'emprestimos' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--sea-ink)]">Histórico de Empréstimos</h2>
                <button
                   onClick={() => navigate({ to: '/patrimonio/emprestimos/novo' })}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Novo Empréstimo
                </button>
              </div>
              <div className="space-y-4">
                {bem.emprestimos?.map((emprestimo) => (
                  <div key={emprestimo.id} className="bg-white p-6 rounded-xl border border-[var(--line)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[var(--sea-ink)]">
                          {emprestimo.membro.nome_completo}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-[var(--sea-ink-soft)] mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {emprestimo.data_emprestimo ? new Date(emprestimo.data_emprestimo).toLocaleDateString('pt-BR') : ''}
                          </span>
                          {emprestimo.data_devolucao_prevista && (
                            <span className={`flex items-center gap-1 ${isOverdue(emprestimo.data_devolucao_prevista) ? 'text-red-600' : ''}`}>
                              <Clock className="w-3 h-3" />
                               Devolver até: {emprestimo.data_devolucao_prevista ? new Date(emprestimo.data_devolucao_prevista).toLocaleDateString('pt-BR') : ''}
                              {isOverdue(emprestimo.data_devolucao_prevista) && (
                                <AlertTriangle className="w-3 h-3 text-red-600" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        emprestimo.status === 'DEVOLVIDO' 
                          ? 'bg-green-100 text-green-700' 
                          : emprestimo.status === 'CANCELADO'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {emprestimo.status}
                      </span>
                    </div>
                  </div>
                ))}
                {bem.emprestimos?.length === 0 && (
                  <div className="text-center py-12 text-[var(--sea-ink-soft)]">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum empréstimo registrado</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'manutencoes' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--sea-ink)]">Manutenções</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors">
                  <Plus className="w-4 h-4" />
                  Agendar Manutenção
                </button>
              </div>
              <div className="space-y-4">
                {bem.manutencoes?.map((manutencao) => (
                  <div key={manutencao.id} className="bg-white p-6 rounded-xl border border-[var(--line)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {manutencao.tipo}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            manutencao.status === 'CONCLUIDA' 
                              ? 'bg-green-100 text-green-700'
                              : manutencao.status === 'CANCELADA'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {manutencao.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            manutencao.prioridade === 'URGENTE' 
                              ? 'bg-red-100 text-red-700'
                              : manutencao.prioridade === 'ALTA'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {manutencao.prioridade}
                          </span>
                        </div>
                        <p className="font-medium text-[var(--sea-ink)]">{manutencao.descricao}</p>
                        <div className="flex items-center gap-4 text-sm text-[var(--sea-ink-soft)] mt-2">
                          {manutencao.data_agendada && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                               {manutencao.data_agendada ? new Date(manutencao.data_agendada).toLocaleDateString('pt-BR') : ''}
                            </span>
                          )}
                          {manutencao.custo && (
                            <span className="font-semibold text-[var(--sea-ink)]">
                              R$ {manutencao.custo.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {bem.manutencoes?.length === 0 && (
                  <div className="text-center py-12 text-[var(--sea-ink-soft)]">
                    <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma manutenção registrada</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Histórico de Movimentações
              </h2>
              <div className="space-y-4">
                {bem.movimentacoes?.map((mov) => (
                  <div key={mov.id} className="bg-white p-4 rounded-xl border border-[var(--line)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-[var(--sea-ink)]">{mov.tipo}</p>
                        <p className="text-sm text-[var(--sea-ink-soft)]">{mov.descricao}</p>
                        {mov.emprestimo && (
                          <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
                            Empréstimo ID: {mov.emprestimo.id}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--sea-ink-soft)]">
                          {new Date(mov.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-[var(--sea-ink-soft)]">
                          por {mov.responsavel.nome_completo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {bem.movimentacoes?.length === 0 && (
                  <div className="text-center py-12 text-[var(--sea-ink-soft)]">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma movimentação registrada</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BemDetailPage;