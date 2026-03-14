import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escolaBiblicaService } from '../../escola-biblica-service';
import type { Curso, CreateCursoDto } from '../../types';
import {
  Pencil,
  Trash2,
  Loader2,
  BookOpen,
  Clock,
  Tag,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export function CursosContent() {
  const navigate = useNavigate();
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
      <div className="flex items-center justify-center p-16">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="display-title">Cursos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os cursos da escola bíblica</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingCurso(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 hover:shadow-xl hover:scale-[1.02] transition-all text-sm font-bold"
        >
          <Plus className="w-4 h-4" />
          Novo Curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cursos?.map((curso) => (
          <div
            key={curso.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(curso)}
                  className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este curso?')) {
                      deleteMutation.mutate(curso.id);
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="mt-3 font-semibold text-gray-900 line-clamp-1">{curso.nome}</h3>
            <p className="text-xs font-mono text-purple-600 mt-1">{curso.codigo}</p>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{curso.descricao || 'Sem descrição'}</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>{curso.cargaHoraria} horas</span>
              </div>
              {curso.categoria && (
                <div className="flex items-center gap-2 text-sm text-gray-800">
                  <Tag className="h-4 w-4 text-purple-600" />
                  <span>{curso.categoria}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {cursos?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum curso cadastrado.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCurso ? 'Editar Curso' : 'Novo Curso'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setEditingCurso(null); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">

                {/* Código + Carga Horária */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Código</label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      placeholder="Ex: EB001"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Carga Horária</label>
                    <input
                      type="number"
                      value={formData.cargaHoraria}
                      onChange={(e) => setFormData({ ...formData, cargaHoraria: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      placeholder="Horas"
                    />
                  </div>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Curso</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                    placeholder="Nome completo do curso"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Teologia">Teologia</option>
                    <option value="Bíblia">Bíblia</option>
                    <option value="Discipulado">Discipulado</option>
                    <option value="Liderança">Liderança</option>
                    <option value="Evangelismo">Evangelismo</option>
                    <option value="Família">Família</option>
                    <option value="Básico">Básico</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Descreva o propósito e conteúdo do curso..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingCurso(null); }}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 rounded-xl bg-purple-600 text-white px-4 py-2.5 text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-70"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
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
