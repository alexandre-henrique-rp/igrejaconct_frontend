import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeiroService } from '../../features/financeiro/financeiro-service';
import type { Conta, CreateContaDto } from '../../features/financeiro/types';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  Wallet,
  Building2,
  PiggyBank,
  CreditCard,
} from 'lucide-react';

function ContasPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <ContasList />
      </DashboardLayout>
    </PrivateRoute>
  )
}

function ContasList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConta, setEditingConta] = useState<Conta | null>(null);
  const [formData, setFormData] = useState<CreateContaDto>({
    nome: '',
    tipo: 'CORRENTE',
    descricao: '',
  });

  const { data: contas, isLoading } = useQuery({
    queryKey: ['contas'],
    queryFn: () => financeiroService.getContas(),
  });

  const createMutation = useMutation({
    mutationFn: financeiroService.createConta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      financeiroService.updateConta(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] });
      setIsModalOpen(false);
      setEditingConta(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: financeiroService.deleteConta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] });
    },
  });

  const resetForm = () => {
    setFormData({ nome: '', tipo: 'CORRENTE', descricao: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingConta) {
      updateMutation.mutate({ id: editingConta.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (conta: Conta) => {
    setEditingConta(conta);
    setFormData({
      nome: conta.nome,
      tipo: conta.tipo,
      descricao: conta.descricao || '',
    });
    setIsModalOpen(true);
  };

  const getIconForTipo = (tipo: string) => {
    switch (tipo) {
      case 'CORRENTE': return Building2;
      case 'POUPANCA': return PiggyBank;
      case 'CREDITO': return CreditCard;
      default: return Wallet;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Contas Bancárias</h2>
        <button
          onClick={() => { resetForm(); setEditingConta(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Conta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contas?.map((conta) => {
          const Icon = getIconForTipo(conta.tipo);
          return (
            <div
              key={conta.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(conta)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir esta conta?')) {
                        deleteMutation.mutate(conta.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-4">{conta.nome}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {conta.tipo === 'CORRENTE' ? 'Conta Corrente' : 
                 conta.tipo === 'POUPANCA' ? 'Poupança' : 'Cartão de Crédito'}
              </p>
              {conta.descricao && (
                <p className="text-sm text-gray-500 mt-2">{conta.descricao}</p>
              )}
            </div>
          );
        })}

        {contas?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma conta cadastrada.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingConta ? 'Editar Conta' : 'Nova Conta'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Conta</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'CORRENTE' | 'POUPANCA' | 'CARTAO' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="CORRENTE">Conta Corrente</option>
                  <option value="POUPANCA">Poupança</option>
                   <option value="CARTAO">Cartão de Crédito</option>
                </select>
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
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingConta(null); }}
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
                  ) : editingConta ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/financeiro/contas')({
  component: ContasPage,
});