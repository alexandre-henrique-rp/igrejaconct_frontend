import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escolaBiblicaService } from '../../escola-biblica-service';
import type { CreateMatriculaDto } from '../../types';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  Search,
  X
} from 'lucide-react';

export function MatriculasContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatriculaId, setEditingMatriculaId] = useState<string | null>(null);
  const [filterTurma, setFilterTurma] = useState('');
  const [searchMembro, setSearchMembro] = useState('');
  const [formData, setFormData] = useState<CreateMatriculaDto>({
    turma_id: '',
    membro_id: '',
    dataMatricula: new Date().toISOString().split('T')[0],
  });

  const { data: matriculas, isLoading } = useQuery({
    queryKey: ['matriculas'],
    queryFn: () => escolaBiblicaService.getMatriculas(),
  });

  const { data: turmas } = useQuery({
    queryKey: ['turmas'],
    queryFn: () => escolaBiblicaService.getTurmas(),
  });

  const { data: membros } = useQuery({
    queryKey: ['membros'],
    queryFn: () => escolaBiblicaService.getMembrosDisponiveis(),
  });

  const { data: editingMatricula } = useQuery({
    queryKey: ['matricula', editingMatriculaId],
    queryFn: () => escolaBiblicaService.getMatriculaById(editingMatriculaId!),
    enabled: !!editingMatriculaId,
  });

  const createMutation = useMutation({
    mutationFn: escolaBiblicaService.createMatricula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      escolaBiblicaService.updateMatricula(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: escolaBiblicaService.deleteMatricula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
    },
  });

  const resetForm = () => {
    setFormData({ turma_id: '', membro_id: '', dataMatricula: new Date().toISOString().split('T')[0] });
    setEditingMatriculaId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMatriculaId) {
      updateMutation.mutate({ id: editingMatriculaId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (matricula: any) => {
    setEditingMatriculaId(matricula.id);
    setFormData({
      turma_id: matricula.turma_id,
      membro_id: matricula.membro_id,
      dataMatricula: matricula.dataMatricula.split('T')[0],
    });
    setIsModalOpen(true);
  };

  const filteredMatriculas = matriculas?.filter(m => {
    if (filterTurma && m.turma_id !== filterTurma) return false;
    if (searchMembro && !m.membro?.nome_completo.toLowerCase().includes(searchMembro.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="display-title">Matrículas</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie matrículas da escola bíblica</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 hover:shadow-xl hover:scale-[1.02] transition-all text-sm font-bold"
        >
          <Plus className="w-4 h-4" />
          Nova Matrícula
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por membro..."
            value={searchMembro}
            onChange={(e) => setSearchMembro(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={filterTurma}
          onChange={(e) => setFilterTurma(e.target.value)}
          className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Todas as turmas</option>
          {turmas?.map((turma: any) => (
            <option key={turma.id} value={turma.id}>{turma.codigo}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Membro</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Turma</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Data Matrícula</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMatriculas?.map((mat: any) => (
              <tr key={mat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase">
                      {mat.membro?.nome_completo?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{mat.membro?.nome_completo || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{mat.membro?.email || 'Sem email'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{mat.turma?.codigo || 'N/A'}</span>
                </td>
                <td className="px-6 py-4 text-gray-800">
                  {new Date(mat.dataMatricula).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(mat)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir esta matrícula?')) {
                          deleteMutation.mutate(mat.id);
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredMatriculas?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                  Nenhuma matrícula encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingMatriculaId ? 'Editar Matrícula' : 'Nova Matrícula'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">

                {/* Turma */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Turma</label>
                  <select
                    value={formData.turma_id}
                    onChange={(e) => setFormData({ ...formData, turma_id: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Selecione uma turma</option>
                    {turmas?.map((turma: any) => (
                      <option key={turma.id} value={turma.id}>{turma.codigo}</option>
                    ))}
                  </select>
                </div>

                {/* Membro */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Aluno (Membro)</label>
                  <select
                    value={formData.membro_id}
                    onChange={(e) => setFormData({ ...formData, membro_id: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Selecione um membro</option>
                    {membros?.map((membro: any) => (
                      <option key={membro.id} value={membro.id}>{membro.nome_completo}</option>
                    ))}
                  </select>
                </div>

                {/* Data */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Data da Matrícula</label>
                  <input
                    type="date"
                    value={formData.dataMatricula}
                    onChange={(e) => setFormData({ ...formData, dataMatricula: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 rounded-xl bg-blue-600 text-white px-4 py-2.5 text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : editingMatriculaId ? 'Atualizar' : 'Matricular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
