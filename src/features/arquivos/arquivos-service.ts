import api from '../../services/api-client';

export interface Arquivo {
  id: string;
  nome_original: string;
  nome_armazenado: string;
  mime_type: string;
  tamanho: number;
  pasta: string;
  hash: string;
  url: string;
  scan_result: 'clean' | 'infected' | 'pending';
  created_at: string;
  created_by_id: string;
}

export interface UploadResponse {
  id: string;
  nome_original: string;
  url: string;
  hash: string;
  scan_result: string;
}

export const arquivosService = {
  async upload(file: File, pasta: string = 'geral'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', pasta);
    
    const response = await api.post<UploadResponse>('/arquivos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getArquivo(id: string): Promise<Arquivo> {
    const response = await api.get<Arquivo>(`/arquivos/${id}`);
    return response.data;
  },

  async deleteArquivo(id: string): Promise<void> {
    await api.delete(`/arquivos/${id}`);
  },

  async getArquivos(pasta?: string, page = 1, limit = 20) {
    const params = new URLSearchParams();
    if (pasta) params.append('pasta', pasta);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/arquivos?${params.toString()}`);
    return response.data;
  },
};
