import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escolaBiblicaService } from '../../features/escola-biblica/escola-biblica-service';
import type { Turma, CreateTurmaDto } from '../../features/escola-biblica/types';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  GraduationCap,
  Calendar,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function TurmasPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <TurmasList />
      </DashboardLayout>
    </PrivateRoute>
  )
}

function TurmasList() {
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
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Turmas</h2>
        <button
          onClick={() => { resetForm(); setEditingTurma(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(turma)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir esta turma?')) {
                        deleteMutation.mutate(turma.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-4">{turma.codigo}</h3>
              <p className="text-sm text-gray-500">{curso?.nome || 'Curso não encontrado'}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(turma.dataInicio), 'dd/MM/yyyy', { locale: ptBR })}
                    {turma.dataFim && ` - ${format(new Date(turma.dataFim), 'dd/MM/yyyy', { locale: ptBR })}`}
                  </span>
                </div>
                {turma.horario && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{turma.horario}</span>
                  </div>
                )}
                {turma.local && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{turma.local}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Capacidade</span>
                  <span className="text-sm font-semibold">{turma.capacidade} vagas</span>
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
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma turma cadastrada.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingTurma ? 'Editar Turma' : 'Nova Turma'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                <select
                  value={formData.curso_id}
                  onChange={(e) => setFormData({ ...formData, curso_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione um curso</option>
                  {cursos?.map((curso) => (
                    <option key={curso.id} value={curso.id}>{curso.nome} ({curso.codigo})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código da Turma</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                  placeholder="Ex: T01-2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input
                  type="text"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Domingos 18:00-20:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                <input
                  type="text"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Sala de Aula 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade</label>
                <input
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) => setFormData({ ...formData, capacidade: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingTurma(null); }}
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

export const Route = createFileRoute('/escola-biblica/turmas')({
  component: TurmasPage,
});