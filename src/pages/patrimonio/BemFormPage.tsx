import { FC, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { patrimonioService } from '@/features/patrimonio/patrimonio-service';
import { membrosService } from '@/features/membros/membros-service';
import { useToast } from '@/contexts/ToastContext';
import { 
  Save, 
  X, 
  Upload,
  Package,
  MapPin,
  TrendingUp,
  Camera,
  Loader2,
  QrCode
} from 'lucide-react';

const tipoOptions = [
  { value: 'EQUIPAMENTO', label: 'Equipamento' },
  { value: 'MOBILIARIO', label: 'Mobiliário' },
  { value: 'INSTRUMENTO', label: 'Instrumento' },
  { value: 'VEICULO', label: 'Veículo' },
  { value: 'IMOVEL', label: 'Imóvel' },
  { value: 'OUTRO', label: 'Outro' },
];

const statusOptions = [
  { value: 'DISPONIVEL', label: 'Disponível' },
  { value: 'EMPRESTADO', label: 'Emprestado' },
  { value: 'EM_MANUTENCAO', label: 'Em Manutenção' },
  { value: 'MANUTENCAO_AGENDADA', label: 'Manutenção Agendada' },
  { value: 'BAIXADO', label: 'Baixado' },
  { value: 'PERDIDO', label: 'Perdido' },
];

const conservacaoOptions = [
  'Ótimo', 'Bom', 'Regular', 'Ruim', 'Péssimo'
];

export const BemFormPage: FC = () => {
  const { id } = useParams({ from: '/patrimonio/$id/editar' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: 'EQUIPAMENTO',
    status: 'DISPONIVEL',
    
    // Identificação
    numero_patrimonio: '',
    codigo_barras: '',
    qr_code: '',
    etiqueta: '',
    
    // Especificações
    marca: '',
    modelo: '',
    numero_serie: '',
    estado_conservacao: '',
    cor: '',
    caracteristicas: '',
    
    // Aquisição
    data_aquisicao: '',
    valor_aquisicao: '',
    fonte: 'COMPRA',
    fornecedor: '',
    nota_fiscal: '',
    
    // Localização
    localizacao: '',
    responsavel_id: '',
    
    // Manutenção
    ultima_manutencao: '',
    proxima_manutencao: '',
    vida_util_meses: '',
    garantia_ate: '',
    
    // Observações
    observacoes: '',
  });

  const [fotos, setFotos] = useState<File[]>([]);

  const { data: bem, isLoading: loadingBem } = useQuery({
    queryKey: ['bem', id],
    queryFn: () => patrimonioService.getBemById(id!),
    enabled: isEditing,
  });

  const { data: membros } = useQuery({
    queryKey: ['membros', 'select'],
    queryFn: () => membrosService.getMembros({ page: 1, limit: 1000 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => patrimonioService.createBem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bens'] });
      success('Bem cadastrado com sucesso!');
      navigate('/patrimonio');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao cadastrar bem');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      patrimonioService.updateBem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bens'] });
      success('Bem atualizado com sucesso!');
      navigate({ to: '/patrimonio' });
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao atualizar bem');
    },
  });

  useEffect(() => {
    if (bem) {
      setFormData({
        nome: bem.nome || '',
        descricao: bem.descricao || '',
        tipo: bem.tipo || 'EQUIPAMENTO',
        status: bem.status || 'DISPONIVEL',
        numero_patrimonio: bem.numero_patrimonio || '',
        codigo_barras: bem.codigo_barras || '',
        qr_code: bem.qr_code || '',
        etiqueta: bem.etiqueta || '',
        marca: bem.marca || '',
        modelo: bem.modelo || '',
        numero_serie: bem.numero_serie || '',
        estado_conservacao: bem.estado_conservacao || '',
        cor: bem.cor || '',
        caracteristicas: typeof bem.caracteristicas === 'object' 
          ? JSON.stringify(bem.caracteristicas, null, 2)
          : bem.caracteristicas || '',
        data_aquisicao: bem.data_aquisicao ? bem.data_aquisicao.split('T')[0] : '',
        valor_aquisicao: bem.valor_aquisicao?.toString() || '',
        fonte: bem.fonte || 'COMPRA',
        fornecedor: bem.fornecedor || '',
        nota_fiscal: bem.nota_fiscal || '',
        localizacao: bem.localizacao || '',
        responsavel_id: bem.responsavel_id || '',
        ultima_manutencao: bem.ultima_manutencao ? bem.ultima_manutencao.split('T')[0] : '',
        proxima_manutencao: bem.proxima_manutencao ? bem.proxima_manutencao.split('T')[0] : '',
        vida_util_meses: bem.vida_util_meses?.toString() || '',
        garantia_ate: bem.garantia_ate ? bem.garantia_ate.split('T')[0] : '',
        observacoes: bem.observacoes || '',
      });
    }
  }, [bem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      payload.append(key, formData[key as keyof typeof formData]);
    });

    if (fotos.length > 0) {
      fotos.forEach((file) => {
        payload.append('fotos', file);
      });
    }

    if (isEditing) {
      updateMutation.mutate({ id: id!, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (loadingBem && isEditing) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--lagoon)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="py-8">
          <div className="flex items-center gap-4 mb-6">
           <button
             onClick={() => navigate({ to: '/patrimonio' })}
             className="p-2 hover:bg-[var(--line)] rounded-lg transition-colors"
           >
             <X className="w-5 h-5" />
           </button>
            <div>
              <h1 className="text-3xl font-bold text-[var(--sea-ink)]">
                {isEditing ? 'Editar Bem' : 'Novo Bem'}
              </h1>
              <p className="text-sm text-[var(--sea-ink-soft)] mt-1">
                {isEditing ? 'Atualize as informações do bem' : 'Cadastre um novo bem patrimonial'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-white rounded-xl p-6 border border-[var(--line)]">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Informações Básicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Tipo *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  >
                    {tipoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Identificação */}
            <div className="bg-white rounded-xl p-6 border border-[var(--line)]">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Identificação
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Número Patrimônio</label>
                  <input
                    type="text"
                    value={formData.numero_patrimonio}
                    onChange={(e) => setFormData({ ...formData, numero_patrimonio: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                    placeholder="Auto-gerado se vazio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Código de Barras</label>
                  <input
                    type="text"
                    value={formData.codigo_barras}
                    onChange={(e) => setFormData({ ...formData, codigo_barras: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                    placeholder="Auto-gerado se vazio"
                  />
                </div>
              </div>
            </div>

            {/* Especificações */}
            <div className="bg-white rounded-xl p-6 border border-[var(--line)]">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Especificações Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Marca</label>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Modelo</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Número Série</label>
                  <input
                    type="text"
                    value={formData.numero_serie}
                    onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Estado de Conservação</label>
                  <select
                    value={formData.estado_conservacao}
                    onChange={(e) => setFormData({ ...formData, estado_conservacao: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    {conservacaoOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Cor</label>
                  <input
                    type="text"
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Características (JSON)</label>
                  <input
                    type="text"
                    value={formData.caracteristicas}
                    onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                    placeholder='{"tela": "15"}'
                  />
                </div>
              </div>
            </div>

            {/* Localização e Responsável */}
            <div className="bg-white rounded-xl p-6 border border-[var(--line)]">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localização e Responsável
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Localização</label>
                  <input
                    type="text"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                    placeholder="Ex: Sala de Células"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sea-ink)] mb-1">Responsável</label>
                  <select
                    value={formData.responsavel_id}
                    onChange={(e) => setFormData({ ...formData, responsavel_id: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent"
                  >
                    <option value="">Selecione um membro</option>
                    {membros?.map((membro: any) => (
                      <option key={membro.id} value={membro.id}>
                        {membro.nome_completo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fotos */}
            <div className="bg-white rounded-xl p-6 border border-[var(--line)]">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Fotos
              </h2>
              <div className="border-2 border-dashed border-[var(--line)] rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFotos(Array.from(e.target.files || []))}
                  className="hidden"
                  id="fotos-upload"
                />
                <label htmlFor="fotos-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--lagoon)]" />
                  <p className="text-sm text-[var(--sea-ink-soft)]">
                    Clique para selecionar imagens
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG até 5MB cada
                  </p>
                </label>
                {fotos.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {fotos.map((file, idx) => (
                      <div key={idx} className="text-xs bg-[var(--lagoon)]/10 text-[var(--lagoon)] px-2 py-1 rounded">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate({ to: '/patrimonio' })}
                className="px-6 py-2 border border-[var(--line)] rounded-lg text-[var(--sea-ink)] hover:bg-[var(--line)] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-6 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BemFormPage;