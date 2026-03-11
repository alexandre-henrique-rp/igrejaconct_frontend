import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escolaBiblicaService } from '../../features/escola-biblica/escola-biblica-service';
import type { CreateMatriculaDto } from '../../features/escola-biblica/types';
import { 
  Plus, 
  Trash2, 
  Loader2,
  Users,
  CheckCircle,
  Search
} from 'lucide-react';

function MatriculasList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTurma, setFilterTurma] = useState('');
  const [searchMembro, setSearchMembro] = useState('');
  const [formData, setFormData] = useState<CreateMatriculaDto>({
    turma_id: '',
    membro_id: '',
  });

  const { data: turmas } = useQuery({
    queryKey: ['turmas'],
    queryFn: () => escolaBiblicaService.getTurmas(),
  });

  const { data: matriculas, isLoading } = useQuery({
    queryKey: ['matriculas', filterTurma],
    queryFn: () => escolaBiblicaService.getMatriculas({ 
      turmaId: filterTurma || undefined 
    }),
  });

  const { data: membros } = useQuery({
    queryKey: ['membros', searchMembro],
    queryFn: () => {
      if (searchMembro.length < 2) return [];
      return fetch(`/api/membros?search=${searchMembro}`).then(r => r.json());
    },
    enabled: searchMembro.length >= 2,
  });

  const createMutation = useMutation({
    mutationFn: escolaBiblicaService.createMatricula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
      setIsModalOpen(false);
      setFormData({ turma_id: '', membro_id: '' });
      setSearchMembro('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: escolaBiblicaService.deleteMatricula,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matriculas'] }),
  });

  const concluirMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { dataConclusao: string } }) =>
      escolaBiblicaService.concluirMatricula(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matriculas'] }),
  });

  const resetForm = () => {
    setFormData({ turma_id: '', membro_id: '' });
    setSearchMembro('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleSelectMembro = (membroId: string) => {
    setFormData({ ...formData, membro_id: membroId });
    setSearchMembro('');
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
        <h2 className="text-lg font-semibold text-gray-900">Matrículas</h2>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Matrícula
        </button>
      </div>

      <div className="mb-4">
        <select
          value={filterTurma}
          onChange={(e) => setFilterTurma(e.target.value)}
          className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todas as turmas</option>
          {turmas?.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.codigo} - {turma.curso_id}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {matriculas?.map((matricula) => (
          <div
            key={matricula.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {matricula.membro?.nome || 'Membro não encontrado'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Turma: {matricula.turma?.codigo || 'Turma não encontrada'}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      matricula.status === 'ATIVA' ? 'bg-green-100 text-green-700' :
                      matricula.status === 'CANCELADA' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {matricula.status === 'ATIVA' ? 'Ativa' :
                       matricula.status === 'CANCELADA' ? 'Cancelada' : 'Em Curso'}
                    </span>
                    {matricula.dataConclusao && (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Concluído em {format(new Date(matricula.dataConclusao), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {matricula.status === 'ATIVA' && !matricula.dataConclusao && (
                  <button
                    onClick={() => {
                      if (confirm('Marcar como concluído?')) {
                        concluirMutation.mutate({ 
                          id: matricula.id, 
                          data: { dataConclusao: new Date().toISOString().split('T')[0] } 
                        });
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Concluir"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja cancelar esta matrícula?')) {
                      deleteMutation.mutate(matricula.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {matriculas?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma matrícula encontrada.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Nova Matrícula</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                <select
                  value={formData.turma_id}
                  onChange={(e) => setFormData({ ...formData, turma_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione uma turma</option>
                  {turmas?.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.codigo} - {turma.curso_id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Membro</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchMembro}
                    onChange={(e) => setSearchMembro(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Buscar por nome ou email..."
                  />
                  {membros && membros.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto">
                      {membros.map((membro: any) => (
                        <button
                          key={membro.id}
                          type="button"
                          onClick={() => handleSelectMembro(membro.id)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50"
                        >
                          <div className="font-medium">{membro.nome}</div>
                          <div className="text-sm text-gray-500">{membro.email}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {formData.membro_id && (
                  <p className="text-sm text-green-600 mt-1">Membro selecionado</p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || !formData.turma_id || !formData.membro_id}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : 'Matricular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/escola-biblica/matriculas')({
  component: MatriculasList,
});