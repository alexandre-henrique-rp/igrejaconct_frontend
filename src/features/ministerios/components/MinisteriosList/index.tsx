import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ministeriosService } from "../../ministerios-service";
import { useToast } from "@/contexts/ToastContext";
import { Pencil, Trash2, Users, User, Search } from "lucide-react";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import { TitleComponent } from "#/components/TitleComponent";
import { ButtonNew } from "#/components/button_new";

export function MinisteriosList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const [search, setSearch] = useState("");

  const { data: ministerios, isLoading } = useQuery({
    queryKey: ["ministerios"],
    queryFn: ministeriosService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: ministeriosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministerios"] });
      success("Ministério removido com sucesso!");
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || "Erro ao remover ministério");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este ministério?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredMinisterios = ministerios?.filter(
    (m) =>
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.descricao?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            title="Ministérios"
            description={`${ministerios?.length || 0} ministérios cadastrados`}
          />
        </div>
        <ButtonNew nav="/ministerios/new" label="Novo Ministério" />
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMinisterios?.map((ministerio) => (
          <div
            key={ministerio.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() =>
              navigate({
                to: "/ministerios/$id",
                params: { id: ministerio.id },
              })
            }
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-600/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {ministerio.nome}
                  </h3>
                  <span className="text-xs text-gray-600">
                    {ministerio._count?.membros || 0} membros
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({
                      to: "/ministerios/$id/edit",
                      params: { id: ministerio.id },
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(ministerio.id);
                  }}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {ministerio.descricao && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {ministerio.descricao}
              </p>
            )}

            {ministerio.responsavel && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <User className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">Responsável:</span>
                <span className="text-xs font-medium text-gray-900">
                  {ministerio.responsavel.nome_completo}
                </span>
              </div>
            )}
          </div>
        ))}

        {filteredMinisterios?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-600">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum ministério encontrado.</p>
            <button
              onClick={() => navigate({ to: "/ministerios/new" })}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Criar primeiro ministério
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
