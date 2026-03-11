import { FC, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patrimonioService } from '@/features/patrimonio/patrimonio-service';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Package,
  Search
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { SkeletonCard } from '@/components/skeleton/SkeletonCard';

interface BensListPageProps {}

const statusColors: Record<string, string> = {
  DISPONIVEL: 'bg-green-100 text-green-700',
  EMPRESTADO: 'bg-yellow-100 text-yellow-700',
  EM_MANUTENCAO: 'bg-orange-100 text-orange-700',
  MANUTENCAO_AGENDADA: 'bg-blue-100 text-blue-700',
  BAIXADO: 'bg-red-100 text-red-700',
  PERDIDO: 'bg-gray-100 text-gray-700',
};

export const BensListPage: FC<BensListPageProps> = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [tipoFilter, setTipoFilter] = useState<string>('');

  const { data: bens, isLoading } = useQuery({
    queryKey: ['bens', { search, status: statusFilter, tipo: tipoFilter }],
    queryFn: () => patrimonioService.getBens({
      search: search || undefined,
      status: statusFilter || undefined,
      tipo: tipoFilter || undefined,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: patrimonioService.deleteBem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bens'] });
      success('Bem removido com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao remover bem');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este bem?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--sea-ink)]">Patrimônio</h1>
          <p className="text-sm text-[var(--sea-ink-soft)] mt-1">
            {bens?.length || 0} bens cadastrados
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/patrimonio/novo'}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Bem
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-[var(--line)] mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, número ou código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
          >
            <option value="">Todos os status</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
          >
            <option value="">Todos os tipos</option>
            <option value="EQUIPAMENTO">Equipamento</option>
            <option value="MOBILIARIO">Mobiliário</option>
            <option value="INSTRUMENTO">Instrumento</option>
            <option value="VEICULO">Veículo</option>
            <option value="IMOVEL">Imóvel</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
      </div>

      {/* Grid de Bens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bens?.map((bem) => (
          <div
            key={bem.id}
            className="bg-white border border-[var(--line)] rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = `/patrimonio/${bem.id}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[var(--lagoon)]/10 rounded-lg">
                  <Package className="w-5 h-5 text-[var(--lagoon)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--sea-ink)] line-clamp-1">{bem.nome}</h3>
                  <p className="text-xs text-[var(--sea-ink-soft)]">{bem.numero_patrimonio || 'Sem número'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); window.location.href = `/patrimonio/${bem.id}/editar`; }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(bem.id); }}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[var(--sea-ink-soft)]">
                  <TrendingUp className="w-3 h-3" />
                  Tipo
                </span>
                <span className="font-medium text-[var(--sea-ink)]">{bem.tipo}</span>
              </div>
              
              {bem.localizacao && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[var(--sea-ink-soft)]">
                    <MapPin className="w-3 h-3" />
                    Local
                  </span>
                  <span className="font-medium text-[var(--sea-ink)]">{bem.localizacao}</span>
                </div>
              )}

              {bem.responsavel && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[var(--sea-ink-soft)]">
                    <User className="w-3 h-3" />
                    Responsável
                  </span>
                  <span className="font-medium text-[var(--sea-ink)]">{bem.responsavel.nome_completo}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[var(--line)]">
                <span className="text-[var(--sea-ink-soft)]">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[bem.status] || 'bg-gray-100 text-gray-700'}`}>
                  {getStatusLabel(bem.status)}
                </span>
              </div>

              {bem.emprestimos?.[0] && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-orange-600">
                    <Calendar className="w-3 h-3" />
                    Emprestado
                  </span>
                  <span className="font-medium text-orange-600">
                    {bem.emprestimos[0].membro?.nome_completo}
                  </span>
                </div>
              )}
            </div>

            {/* Fotos thumbnails */}
            {bem.fotos?.length > 0 && (
              <div className="flex gap-1 mt-3 overflow-x-auto">
                {bem.fotos.slice(0, 3).map((foto) => (
                  <img
                    key={foto.id}
                    src={`/api/arquivos/${foto.arquivo.id}/download`}
                    alt=""
                    className="w-12 h-12 object-cover rounded border border-[var(--line)] flex-shrink-0"
                  />
                ))}
                {bem.fotos?.length > 3 && (
                  <div className="w-12 h-12 bg-gray-100 rounded border border-[var(--line)] flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                    +{bem.fotos.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {bens?.length === 0 && (
          <div className="col-span-full text-center py-12 text-[var(--sea-ink-soft)]">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum bem encontrado.</p>
            <button
              onClick={() => window.location.href = '/patrimonio/novo'}
              className="mt-4 px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors"
            >
              Cadastrar primeiro bem
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BensListPage;