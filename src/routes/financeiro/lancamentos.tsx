import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeiroService } from '../../features/financeiro/financeiro-service';
import { arquivosService } from '../../features/arquivos/arquivos-service';
import type { Lancamento, CreateLancamentoDto } from '../../features/financeiro/types';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  Receipt,
  TrendingUp,
  TrendingDown,
  Check,
  X,
  Calendar,
  Upload,
  Paperclip
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

function LancamentosList() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(null);
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);
  const [filters, setFilters] = useState({
    tipo: '' as '' | 'RECEITA' | 'DESPESA',
    status: '' as '' | 'PENDENTE_APROVACAO' | 'APROVADO' | 'REJEITADO',
  });
  const [formData, setFormData] = useState<CreateLancamentoDto>({
    tipo: 'DESPESA',
    valor: 0,
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    conta_id: '',
    categoria_id: '',
  });

  const { data: lancamentos, isLoading } = useQuery({
    queryKey: ['lancamentos', filters],
    queryFn: () => financeiroService.getLancamentos({
      tipo: filters.tipo || undefined,
      status: filters.status || undefined,
    }),
  });

  const { data: contas } = useQuery({
    queryKey: ['contas'],
    queryFn: () => financeiroService.getContas(),
  });

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => financeiroService.getCategorias(),
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateLancamentoDto) => {
      if (comprovanteFile) {
        const uploadResult = await arquivosService.upload(comprovanteFile, 'lancamento');
        data.comprovante_id = uploadResult.id;
      }
      return financeiroService.createLancamento(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      setIsModalOpen(false);
      resetForm();
      success('Lançamento criado com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao criar lançamento');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      if (comprovanteFile) {
        const uploadResult = await arquivosService.upload(comprovanteFile, 'lancamento');
        data.comprovante_id = uploadResult.id;
      }
      return financeiroService.updateLancamento(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      setIsModalOpen(false);
      setEditingLancamento(null);
      resetForm();
      success('Lançamento atualizado com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao atualizar lançamento');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: financeiroService.deleteLancamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      success('Lançamento excluído com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao excluir lançamento');
    },
  });

    const approvalMutation = useMutation({
      mutationFn: ({ id, aprovado }: { id: string; aprovado: boolean }) =>
        financeiroService.approveLancamento(id, aprovado ? 'APROVADO' : 'REJEITADO'),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        success(variables.aprovado ? 'Lançamento aprovado!' : 'Lançamento rejeitado!');
      },
      onError: (err: any) => {
        showError(err.response?.data?.message || 'Erro ao processar aprovação');
      },
    });

  const resetForm = () => {
    setFormData({
      tipo: 'DESPESA',
      valor: 0,
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      conta_id: '',
      categoria_id: '',
    });
    setComprovanteFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLancamento) {
      updateMutation.mutate({ id: editingLancamento.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (lancamento: Lancamento) => {
    setEditingLancamento(lancamento);
    setFormData({
      tipo: lancamento.tipo,
      valor: lancamento.valor,
      descricao: lancamento.descricao || '',
      data: lancamento.data.split('T')[0],
      conta_id: lancamento.conta_id,
      categoria_id: lancamento.categoria_id || '',
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><Check className="w-3 h-3" /> Aprovado</span>;
      case 'REJEITADO':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><X className="w-3 h-3" /> Rejeitado</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Calendar className="w-3 h-3" /> Pendente</span>;
    }
  };

   if (isLoading) {
     return (
       <div className="space-y-4">
         <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
         <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
         <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
       </div>
     );
   }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Lançamentos Financeiros</h2>
        <button
          onClick={() => { resetForm(); setEditingLancamento(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Lançamento
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilters({ ...filters, tipo: '' })}
          className={`px-3 py-1 rounded-full text-sm ${filters.tipo === '' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilters({ ...filters, tipo: 'RECEITA' })}
          className={`px-3 py-1 rounded-full text-sm ${filters.tipo === 'RECEITA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
        >
          Receitas
        </button>
        <button
          onClick={() => setFilters({ ...filters, tipo: 'DESPESA' })}
          className={`px-3 py-1 rounded-full text-sm ${filters.tipo === 'DESPESA' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
        >
          Despesas
        </button>
      </div>

      <div className="space-y-4">
        {lancamentos?.map((lancamento) => (
          <div
            key={lancamento.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${lancamento.tipo === 'RECEITA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {lancamento.tipo === 'RECEITA' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{lancamento.descricao || 'Sem descrição'}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                       {new Date(lancamento.data).toLocaleDateString('pt-BR')}
                    </span>
                    <span>{contas?.find(c => c.id === lancamento.conta_id)?.nome}</span>
                    {lancamento.categoria_id && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {categorias?.find(c => c.id === lancamento.categoria_id)?.nome}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-lg font-semibold ${lancamento.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                    {lancamento.tipo === 'RECEITA' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lancamento.valor)}
                  </p>
                  {getStatusBadge(lancamento.status)}
                </div>
                <div className="flex gap-1">
                  {lancamento.status === 'PENDENTE_APROVACAO' && (
                    <>
                      <button
                        onClick={() => approvalMutation.mutate({ id: lancamento.id, aprovado: true })}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Aprovar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => approvalMutation.mutate({ id: lancamento.id, aprovado: false })}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Rejeitar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {lancamento.comprovante_id && (
                    <a
                      href={`/arquivos/${lancamento.comprovante_id}/download`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download comprovante"
                    >
                      <Paperclip className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(lancamento)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este lançamento?')) {
                        deleteMutation.mutate(lancamento.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {lancamentos?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum lançamento encontrado.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'RECEITA' | 'DESPESA' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="RECEITA">Receita</option>
                  <option value="DESPESA">Despesa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conta</label>
                <select
                  value={formData.conta_id}
                  onChange={(e) => setFormData({ ...formData, conta_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione uma conta</option>
                  {contas?.map((conta) => (
                    <option key={conta.id} value={conta.id}>{conta.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias
                    ?.filter(cat => cat.tipo === formData.tipo)
                    .map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comprovante</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    <span>{comprovanteFile ? comprovanteFile.name : 'Escolher arquivo'}</span>
                    <input
                      type="file"
                      onChange={(e) => setComprovanteFile(e.target.files?.[0] || null)}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                  </label>
                  {comprovanteFile && (
                    <button
                      type="button"
                      onClick={() => setComprovanteFile(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingLancamento(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : editingLancamento ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/financeiro/lancamentos')({
  component: LancamentosList,
});