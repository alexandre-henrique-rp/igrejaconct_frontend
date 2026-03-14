import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escolaBiblicaService } from '../../escola-biblica-service';
import type { Turma, CreateTurmaDto } from '../../types';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  GraduationCap,
  Calendar,
  MapPin,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TurmasContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [formData, setFormData] = useState<CreateTurmaDto>({
    curso_id: '',
    codigo: '',
    dataInicio: '',
    dataFim: '',
    horario: '',
    local: '',
    capacidade: 0,
  });

  const { data: turmas, isLoading } = useQuery({
    queryKey: ['turmas'],
    queryFn: () => escolaBiblicaService.getTurmas(),
  });

  const { data: cursos } = useQuery({
    queryKey: ['cursos'],
    queryFn: () => escolaBiblicaService.getCursos(),
  });

  const createMutation = useMutation({
    mutationFn: escolaBiblicaService.createTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      escolaBiblicaService.updateTurma(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
      setIsModalOpen(false);
      setEditingTurma(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: escolaBiblicaService.deleteTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });

  const resetForm = () => {
    setFormData({ curso_id: '', codigo: '', dataInicio: '', dataFim: '', horario: '', local: '', capacidade: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTurma) {
      updateMutation.mutate({ id: editingTurma.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setFormData({
      curso_id: turma.curso_id,
      codigo: turma.codigo,
      dataInicio: turma.dataInicio.split('T')[0],
      dataFim: turma.dataFim?.split('T')[0] || '',
      horario: turma.horario || '',
      local: turma.local || '',
      capacidade: turma.capacidade,
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (turma: Turma) => {
    const now = new Date();
    const inicio = new Date(turma.dataInicio);
    const fim = turma.dataFim ? new Date(turma.dataFim) : null;
    
    if (fim && now > fim) {
      return <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Finalizada</span>;
    } else if (now < inicio) {
      return <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">Agendada</span>;
    } else {
      return <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">Em Andamento</span>;
    }
  };

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
          <h1 className="display-title">Turmas</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie as turmas da escola bíblica</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingTurma(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 hover:shadow-xl hover:scale-[1.02] transition-all text-sm font-bold"
        >
          <Plus className="w-4 h-4" />
          Nova Turma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {turmas?.map((turma) => {
          const curso = cursos?.find(c => c.id === turma.curso_id);
          return (
            <div
              key={turma.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(turma)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir esta turma?')) {
                        deleteMutation.mutate(turma.id);
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">{turma.codigo}</h3>
              <p className="text-sm text-gray-500">{curso?.nome || 'Curso não encontrado'}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-800">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>
                    {format(new Date(turma.dataInicio), 'dd/MM/yyyy', { locale: ptBR })}
                    {turma.dataFim && ` - ${format(new Date(turma.dataFim), 'dd/MM/yyyy', { locale: ptBR })}`}
                  </span>
                </div>
                {turma.horario && (
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{turma.horario}</span>
                  </div>
                )}
                {turma.local && (
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{turma.local}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Capacidade</span>
                  <span className="text-sm font-semibold text-gray-900">{turma.capacidade} vagas</span>
                </div>
              </div>
              
              <div className="mt-4">
                {getStatusBadge(turma)}
              </div>
            </div>
          );
        })}

        {turmas?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma turma cadastrada.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingTurma ? 'Editar Turma' : 'Nova Turma'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setEditingTurma(null); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="px-6 py-4 space-y-3 overflow-y-auto flex-1">

                {/* Curso */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Curso</label>
                  <select
                    value={formData.curso_id}
                    onChange={(e) => setFormData({ ...formData, curso_id: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Selecione um curso</option>
                    {cursos?.map((curso: any) => (
                      <option key={curso.id} value={curso.id}>{curso.nome} ({curso.codigo})</option>
                    ))}
                  </select>
                </div>

                {/* Código + Capacidade */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Código</label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                      placeholder="Ex: T01-2024"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Capacidade</label>
                    <input
                      type="number"
                      value={formData.capacidade}
                      onChange={(e) => setFormData({ ...formData, capacidade: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                      placeholder="Vagas"
                    />
                  </div>
                </div>

                {/* Data Início + Data Fim */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Data Início</label>
                    <input
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Data Fim</label>
                    <input
                      type="date"
                      value={formData.dataFim}
                      onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Horário + Local */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Horário</label>
                    <input
                      type="text"
                      value={formData.horario}
                      onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: Dom 18:00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Local</label>
                    <input
                      type="text"
                      value={formData.local}
                      onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: Sala 1"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingTurma(null); }}
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
                  ) : editingTurma ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
