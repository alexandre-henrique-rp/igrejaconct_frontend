import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escolaBiblicaService } from '../../features/escola-biblica/escola-biblica-service';
import type { CreateCertificadoDto } from '../../features/escola-biblica/types';
import { 
  Plus, 
  Loader2,
  Award,
  Search,
  Send,
  Download,
  Eye
} from 'lucide-react';

function CertificadosList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchNumero, setSearchNumero] = useState('');
  const [formData, setFormData] = useState<CreateCertificadoDto>({
    matricula_id: '',
    email: '',
  });

  const { data: certificados, isLoading } = useQuery({
    queryKey: ['certificados'],
    queryFn: () => escolaBiblicaService.getCertificados(),
  });

  const { data: matriculas } = useQuery({
    queryKey: ['matriculas-concluidas'],
    queryFn: () => escolaBiblicaService.getMatriculas({ status: 'CONCLUIDA' }),
  });

  const createMutation = useMutation({
    mutationFn: escolaBiblicaService.generateCertificado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificados'] });
      setIsModalOpen(false);
      setFormData({ matricula_id: '', email: '' });
    },
  });

  const handleSearch = async () => {
    if (searchNumero) {
      try {
        await escolaBiblicaService.getCertificadoByNumero(searchNumero);
        alert('Certificado encontrado!');
      } catch {
        alert('Certificado não encontrado.');
      }
    }
  };

  const handleVerificar = async (numero: string) => {
    try {
      const result = await escolaBiblicaService.verifyCertificado(numero);
      alert(`Certificado válido: ${result.nome_aluno} - ${result.nome_curso}`);
    } catch {
      alert('Certificado inválido ou não encontrado.');
    }
  };

  const resetForm = () => {
    setFormData({ matricula_id: '', email: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getStatusBadge = (ativo: boolean) => {
    return ativo ? (
      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Ativo
      </span>
    ) : (
      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        Inativo
      </span>
    );
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
        <h2 className="text-lg font-semibold text-gray-900">Certificados</h2>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Gerar Certificado
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchNumero}
            onChange={(e) => setSearchNumero(e.target.value.toUpperCase())}
            placeholder="Buscar por número do certificado..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Buscar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificados?.map((certificado) => (
          <div
            key={certificado.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex gap-1">
                <a
                  href={`/escola-biblica/certificados/${certificado.numero}/download`}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleVerificar(certificado.numero)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Verificar autenticidade"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">Número: {certificado.numero}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {certificado.membro?.nome || 'Aluno não encontrado'}
              </p>
              <p className="text-sm text-gray-500">
                {certificado.matricula?.turma?.curso?.nome || 'Curso não encontrado'}
              </p>
              {certificado.dataEmissao && (
                <p className="text-sm text-gray-500 mt-2">
                  Emitido em: {format(new Date(certificado.dataEmissao), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              )}
              {certificado.emailEnviadoEm && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Enviado por email em {format(new Date(certificado.emailEnviadoEm), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              {getStatusBadge(certificado.ativo)}
            </div>
          </div>
        ))}

        {certificados?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum certificado gerado.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Gerar Certificado</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula Concluída</label>
                <select
                  value={formData.matricula_id}
                  onChange={(e) => setFormData({ ...formData, matricula_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione uma matrícula</option>
                  {matriculas?.map((matricula) => (
                    <option key={matricula.id} value={matricula.id}>
                      {matricula.membro?.nome} - {matricula.turma?.codigo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email para cópia (opcional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="email@exemplo.com"
                />
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
                  disabled={createMutation.isPending || !formData.matricula_id}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : 'Gerar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/escola-biblica/certificados')({
  component: CertificadosList,
});