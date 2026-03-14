import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeiroService } from '../../features/financeiro/financeiro-service';
import type { Categoria, CreateCategoriaDto } from '../../features/financeiro/types';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  Tags,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

function CategoriasPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <CategoriasList />
      </DashboardLayout>
    </PrivateRoute>
  )
}

function CategoriasList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [filterTipo, setFilterTipo] = useState<'RECEITA' | 'DESPESA' | 'all'>('all');
  const [formData, setFormData] = useState<CreateCategoriaDto>({
    nome: '',
    tipo: 'DESPESA',
    cor: '#2563eb',
  });

  const { data: categorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => financeiroService.getCategorias(),
  });

  const createMutation = useMutation({
    mutationFn: financeiroService.createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      financeiroService.updateCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      setIsModalOpen(false);
      setEditingCategoria(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: financeiroService.deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  const resetForm = () => {
    setFormData({ nome: '', tipo: 'DESPESA', cor: '#2563eb' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategoria) {
      updateMutation.mutate({ id: editingCategoria.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormData({
      nome: categoria.nome,
      tipo: categoria.tipo,
      cor: categoria.cor || '#2563eb',
    });
    setIsModalOpen(true);
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
        <h2 className="text-lg font-semibold text-gray-900">Categorias</h2>
        <button
          onClick={() => { resetForm(); setEditingCategoria(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterTipo('all')}
          className={`px-3 py-1 rounded-full text-sm ${filterTipo === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilterTipo('RECEITA')}
          className={`px-3 py-1 rounded-full text-sm ${filterTipo === 'RECEITA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
        >
          Receitas
        </button>
        <button
          onClick={() => setFilterTipo('DESPESA')}
          className={`px-3 py-1 rounded-full text-sm ${filterTipo === 'DESPESA' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
        >
          Despesas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias
          ?.filter(cat => filterTipo === 'all' || cat.tipo === filterTipo)
          .map((categoria) => (
          <div
            key={categoria.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${categoria.cor}20`, color: categoria.cor }}
              >
                <Tags className="w-5 h-5" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(categoria)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
                      deleteMutation.mutate(categoria.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mt-4">{categoria.nome}</h3>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-600">
              <span className={`flex items-center gap-1 ${categoria.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                {categoria.tipo === 'RECEITA' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {categoria.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}
              </span>
            </div>
            <div 
              className="mt-2 w-full h-2 rounded-full"
              style={{ backgroundColor: categoria.cor }}
            />
          </div>
        ))}

        {categorias?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Tags className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma categoria cadastrada.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
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
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'RECEITA' | 'DESPESA' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="RECEITA">Receita</option>
                  <option value="DESPESA">Despesa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                <input
                  type="color"
                  value={formData.cor}
                  onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingCategoria(null); }}
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
                  ) : editingCategoria ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/financeiro/categorias')({
  component: CategoriasPage,
});