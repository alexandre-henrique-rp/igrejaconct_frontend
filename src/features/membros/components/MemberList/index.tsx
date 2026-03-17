import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membrosService } from "../../membros-service";
import type { TipoMembro, Membro } from "../../types";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api-client";
import { Search, Pencil, Trash2, User, Mail, Phone, Church } from "lucide-react";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import { TitleComponent } from "#/components/TitleComponent";
import { ButtonNew } from "#/components/button_new";

const tipoLabels: Record<TipoMembro, string> = {
  ATIVO: "Ativo",
  CONGREGADO: "Congregado",
  VISITANTE: "Visitante",
  AFASTADO: "Afastado",
  TRANSFERIDO: "Transferido",
  FALECIDO: "Falecido",
};

const tipoColors: Record<TipoMembro, string> = {
  ATIVO: "bg-green-100 text-green-700",
  CONGREGADO: "bg-blue-100 text-blue-700",
  VISITANTE: "bg-purple-100 text-purple-700",
  AFASTADO: "bg-yellow-100 text-yellow-700",
  TRANSFERIDO: "bg-gray-100 text-gray-700",
  FALECIDO: "bg-red-100 text-red-700",
};

const statusColors: Record<string, string> = {
  ATIVO: "bg-green-100 text-green-700",
  INATIVO: "bg-red-100 text-red-700",
};

export function MemberList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN" || user?.role === "ADMIN_MASTER";

  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<TipoMembro | "">("");
  const [igrejaFilter, setIgrejaFilter] = useState<string>("");

  // Fetch churches for admin filter
  const { data: igrejas } = useQuery({
    queryKey: ["igrejas-select"],
    queryFn: async () => {
      const response = await api.get("/igrejas");
      return response.data;
    },
    enabled: isAdmin,
  });

  const { data: membrosData, isLoading } = useQuery<Membro[]>({
    queryKey: ["membros", search, tipoFilter, isAdmin ? igrejaFilter : null],
    queryFn: () => {
      const filterIgrejaId = isAdmin && igrejaFilter ? igrejaFilter : undefined;
      
      if (search) {
        return membrosService.search(search);
      }
      
      return membrosService.getAll({ 
        igreja_id: filterIgrejaId,
        tipo_membro: tipoFilter || undefined,
      });
    },
  });

  // Garante que membros seja sempre um array
  const membros = Array.isArray(membrosData) ? membrosData : [];

  const deleteMutation = useMutation({
    mutationFn: membrosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membros"] });
      success("Membro removido com sucesso!");
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || "Erro ao remover membro");
    },
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir este membro?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <TitleComponent
            title="Membros"
            description={`${membros?.length || 0} membros cadastrados`}
          />
        </div>
        <ButtonNew nav="/membros/new" label="Novo Membro" />
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email ou telefone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        {isAdmin && (
          <select
            value={igrejaFilter}
            onChange={(e) => setIgrejaFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Todas as igrejas</option>
            {igrejas?.map((igreja: any) => (
              <option key={igreja.id} value={igreja.id}>
                {igreja.nome}
              </option>
            ))}
          </select>
        )}
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value as TipoMembro | "")}
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Todos os tipos</option>
          <option value="CONGREGADO">Congregado</option>
          <option value="VISITANTE">Visitante</option>
          <option value="AFASTADO">Afastado</option>
          <option value="TRANSFERIDO">Transferido</option>
          <option value="FALECIDO">Falecido</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {membros?.map((membro: Membro) => (
          <div
            key={membro.id}
            onClick={() =>
              navigate({ to: "/membros/$id", params: { id: membro.id } })
            }
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 bg-teal-600/10 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {membro.nome_completo}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${tipoColors[membro.tipo_membro]}`}
                    >
                      {tipoLabels[membro.tipo_membro]}
                    </span>
                    {membro.status && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[membro.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {membro.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({
                      to: "/membros/$id/edit",
                      params: { id: membro.id },
                    });
                  }}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(membro.id, e)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {membro.email && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{membro.email}</span>
                </div>
              )}
              {membro.telefone && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-3 h-3" />
                  <span>{membro.telefone}</span>
                </div>
              )}
              {membro.igreja && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Church className="w-3 h-3" />
                  <span className="truncate">{membro.igreja.nome}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-600 dark:text-gray-400">Data de cadastro</span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {membro.data_membro
                    ? new Date(membro.data_membro).toLocaleDateString("pt-BR")
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {membros?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum membro encontrado.</p>
            <button
              onClick={() => navigate({ to: "/membros/new" })}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Cadastrar primeiro membro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
