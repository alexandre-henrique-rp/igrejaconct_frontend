import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escolaBiblicaService } from '../../features/escola-biblica/escola-biblica-service';
import type { Curso, CreateCursoDto } from '../../features/escola-biblica/types';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  BookOpen,
  Clock,
  Tag
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { SkeletonCard } from '@/components/skeleton/SkeletonCard';

function CursosList() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<CreateCursoDto>({
    codigo: '',
    nome: '',
    descricao: '',
    cargaHoraria: 0,
    categoria: '',
  });

  const { data: cursos, isLoading } = useQuery({
    queryKey: ['cursos'],
    queryFn: () => escolaBiblicaService.getCursos(),
  });

  const createMutation = useMutation({
    mutationFn: escolaBiblicaService.createCurso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      setIsModalOpen(false);
      resetForm();
      success('Curso criado com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao criar curso');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      escolaBiblicaService.updateCurso(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      setIsModalOpen(false);
      setEditingCurso(null);
      resetForm();
      success('Curso atualizado com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao atualizar curso');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: escolaBiblicaService.deleteCurso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      success('Curso excluído com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao excluir curso');
    },
  });

  const resetForm = () => {
    setFormData({ codigo: '', nome: '', descricao: '', cargaHoraria: 0, categoria: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCurso) {
      updateMutation.mutate({ id: editingCurso.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (curso: Curso) => {
    setEditingCurso(curso);
    setFormData({
      codigo: curso.codigo,
      nome: curso.nome,
      descricao: curso.descricao || '',
      cargaHoraria: curso.cargaHoraria,
      categoria: curso.categoria || '',
    });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Cursos</h2>
        <button
          onClick={() => { resetForm(); setEditingCurso(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cursos?.map((curso) => (
          <div
            key={curso.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(curso)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja inativar este curso?')) {
                      deleteMutation.mutate(curso.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mt-4">{curso.nome}</h3>
            <p className="text-sm text-gray-500 mt-1">{curso.codigo}</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {curso.cargaHoraria}h
              </span>
              {curso.categoria && (
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {curso.categoria}
                </span>
              )}
            </div>
            {!curso.ativo && (
              <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                Inativo
              </span>
            )}
          </div>
        ))}

        {cursos?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum curso cadastrado.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingCurso ? 'Editar Curso' : 'Novo Curso'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={!!editingCurso}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carga Horária (h)</label>
                  <input
                    type="number"
                    value={formData.cargaHoraria}
                    onChange={(e) => setFormData({ ...formData, cargaHoraria: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Teologia, Liderança..."
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingCurso(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : editingCurso ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/escola-biblica/cursos')({
  component: CursosList,
});