import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { arquivosService } from '../../features/arquivos/arquivos-service';
import { 
  Upload, 
  FileText, 
  Image, 
  File,
  Trash2,
  Loader2,
  Eye
} from 'lucide-react';
import { TitleComponent } from '#/components/TitleComponent';

export const Route = createFileRoute('/arquivos/')({
  component: ArquivosRoutePage,
});

function ArquivosRoutePage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <ArquivosPage />
      </DashboardLayout>
    </PrivateRoute>
  )
}

function ArquivosPage() {
  const queryClient = useQueryClient();
  const [pasta, setPasta] = useState('geral');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: arquivos, isLoading } = useQuery({
    queryKey: ['arquivos', pasta],
    queryFn: () => arquivosService.getArquivos(pasta),
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, pasta }: { file: File; pasta: string }) => {
      setIsUploading(true);
      return arquivosService.upload(file, pasta);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arquivos'] });
      setUploadFile(null);
      setIsUploading(false);
    },
    onError: () => {
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: arquivosService.deleteArquivo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arquivos'] });
    },
  });

  const handleUpload = () => {
    if (uploadFile) {
      uploadMutation.mutate({ file: uploadFile, pasta });
    }
  };

  const pastas = ['geral', 'comprovantes', 'fotos', 'documentos'];

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-8 h-8 text-purple-500" />;
    if (mimeType === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <TitleComponent title="Arquivos" description="Gerencie os arquivos da igreja" />
      </div>

      {/* Upload Area */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Enviar Arquivo</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pasta</label>
            <select
              value={pasta}
              onChange={(e) => setPasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {pastas.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Arquivo</label>
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={!uploadFile || isUploading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Enviar
          </button>
        </div>
      </div>

      {/* Arquivos Grid */}
      <div className="mb-4">
        <div className="flex gap-2">
          {pastas.map((p) => (
            <button
              key={p}
              onClick={() => setPasta(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pasta === p 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {arquivos?.map((arquivo: any) => (
            <div
              key={arquivo.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md"
            >
              <div className="flex justify-center py-4">
                {getFileIcon(arquivo.mime_type)}
              </div>
              <p className="text-sm font-medium text-gray-900 truncate" title={arquivo.nome_original}>
                {arquivo.nome_original}
              </p>
              <p className="text-xs text-gray-500">{formatSize(arquivo.tamanho)}</p>
              <div className="flex gap-2 mt-3">
                <a
                  href={arquivo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-2 text-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Visualizar"
                >
                  <Eye className="w-4 h-4 mx-auto" />
                </a>
                <button
                  onClick={() => {
                    if (confirm('Excluir arquivo?')) {
                      deleteMutation.mutate(arquivo.id);
                    }
                  }}
                  className="flex-1 p-2 text-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
          
          {arquivos?.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum arquivo nesta pasta.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
