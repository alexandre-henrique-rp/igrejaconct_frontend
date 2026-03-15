import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeiroService } from "../financeiro-service";
import { arquivosService } from "../../arquivos/arquivos-service";
import type {
  CreateLancamentoDto,
  Conta,
  Categoria,
} from "../types";
import {
  Loader2,
  Upload,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useNavigate } from "@tanstack/react-router";

export function LancamentoForm() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateLancamentoDto>({
    tipo: "DESPESA",
    valor: 0,
    descricao: "",
    data: new Date().toISOString().split("T")[0],
    conta_id: "",
    categoria_id: "",
  });

  const { data: contas } = useQuery({
    queryKey: ["contas"],
    queryFn: () => financeiroService.getContas(),
  });

  const { data: categorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => financeiroService.getCategorias(),
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateLancamentoDto) => {
      if (comprovanteFile) {
        const uploadResult = await arquivosService.upload(
          comprovanteFile,
          "lancamento",
        );
        data.comprovante_id = uploadResult.id;
      }
      return financeiroService.createLancamento(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
      success("Lançamento criado com sucesso!");
      navigate({ to: "/financeiro/lancamentos" });
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || "Erro ao criar lançamento");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Novo Lançamento</h1>
          <p className="text-gray-600 mt-1">Adicione uma nova receita ou despesa</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipo: e.target.value as "RECEITA" | "DESPESA",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    valor: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conta *
              </label>
              <select
                value={formData.conta_id}
                onChange={(e) =>
                  setFormData({ ...formData, conta_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Selecione uma conta</option>
                {contas?.map((conta: Conta) => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.categoria_id}
                onChange={(e) =>
                  setFormData({ ...formData, categoria_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Selecione uma categoria</option>
                {categorias
                  ?.filter((cat: Categoria) => cat.tipo === formData.tipo)
                  .map((categoria: Categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data *
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Adicione uma descrição para este lançamento..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comprovante
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm">
                  {comprovanteFile
                    ? comprovanteFile.name
                    : "Escolher arquivo"}
                </span>
                <input
                  type="file"
                  onChange={(e) =>
                    setComprovanteFile(e.target.files?.[0] || null)
                  }
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </label>
              {comprovanteFile && (
                <button
                  type="button"
                  onClick={() => setComprovanteFile(null)}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Remover
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Formatos aceitos: JPG, PNG, PDF (máx. 5MB)
            </p>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate({ to: "/financeiro/lancamentos" })}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Criando...</span>
                </div>
              ) : (
                "Criar Lançamento"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
