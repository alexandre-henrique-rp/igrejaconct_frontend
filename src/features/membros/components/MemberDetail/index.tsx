import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { membrosService } from "../../membros-service";
import type { TipoMembro } from "../../types";
import { Pencil, Mail, MapPin, Calendar, User, Award } from "lucide-react";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";

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

export function MemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/membros/$id" });
  const [activeTab, setActiveTab] = useState<
    "dados" | "discipulado" | "historico"
  >("dados");

  const { data: membro, isLoading } = useQuery({
    queryKey: ["membro", id],
    queryFn: () => membrosService.getById(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        <SkeletonCard />
      </div>
    );
  }

  if (!membro) {
    return (
      <div className="text-center py-12 text-gray-600">
        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Membro não encontrado</p>
        <button
          onClick={() => navigate({ to: "/membros" })}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-600/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {membro.nome_completo}
              </h1>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${tipoColors[membro.tipo_membro]}`}
              >
                {tipoLabels[membro.tipo_membro]}
              </span>
            </div>
          </div>
          <button
            onClick={() =>
              navigate({ to: "/membros/$id/edit", params: { id: membro.id } })
            }
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-teal-600/5 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(["dados", "discipulado", "historico"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab === "dados"
              ? "Dados Pessoais"
              : tab === "discipulado"
                ? "Discipulado"
                : "Histórico"}
          </button>
        ))}
      </div>

      {activeTab === "dados" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-600" />
              Contato
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-900">{membro.email || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telefone</span>
                <span className="text-gray-900">{membro.telefone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">WhatsApp</span>
                <span className="text-gray-900">{membro.whatsapp || "-"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              Endereço
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">CEP</span>
                <span className="text-gray-900">{membro.cep || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rua</span>
                <span className="text-gray-900">{membro.endereco || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bairro</span>
                <span className="text-gray-900">{membro.bairro || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cidade</span>
                <span className="text-gray-900">
                  {membro.cidade || "-"} / {membro.estado || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Informações Pessoais
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">CPF</span>
                <span className="text-gray-900">{membro.cpf || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Nascimento</span>
                <span className="text-gray-900">
                  {membro.data_nascimento
                    ? new Date(membro.data_nascimento).toLocaleDateString(
                        "pt-BR",
                      )
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gênero</span>
                <span className="text-gray-900">{membro.genero || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado Civil</span>
                <span className="text-gray-900">
                  {membro.estado_civil?.replace("_", " ") || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profissão</span>
                <span className="text-gray-900">{membro.profissao || "-"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-600" />
              Dados Eclesiásticos
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo</span>
                <span className="text-gray-900">
                  {tipoLabels[membro.tipo_membro]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Membro desde</span>
                <span className="text-gray-900">
                  {membro.data_membro
                    ? new Date(membro.data_membro).toLocaleDateString("pt-BR")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data do Batismo</span>
                <span className="text-gray-900">
                  {membro.data_batismo
                    ? new Date(membro.data_batismo).toLocaleDateString("pt-BR")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Local do Batismo</span>
                <span className="text-gray-900">
                  {membro.local_batismo || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Conversão</span>
                <span className="text-gray-900">
                  {membro.data_conversao
                    ? new Date(membro.data_conversao).toLocaleDateString(
                        "pt-BR",
                      )
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "discipulado" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Discipulador</h3>
            {membro.discipulador ? (
              <button
                onClick={() =>
                  navigate({
                    to: "/membros/$id",
                    params: { id: membro.discipulador!.id },
                  })
                }
                className="flex items-center gap-2 text-teal-600 hover:underline"
              >
                <User className="w-4 h-4" />
                {membro.discipulador.nome_completo}
              </button>
            ) : (
              <p className="text-gray-600">Sem discipulador</p>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Discípulos ({membro.discipulos?.length || 0})
            </h3>
            {membro.discipulos && membro.discipulos.length > 0 ? (
              <ul className="space-y-2">
                {membro.discipulos.map((d) => (
                  <li key={d.id}>
                    <button
                      onClick={() =>
                        navigate({ to: "/membros/$id", params: { id: d.id } })
                      }
                      className="flex items-center gap-2 text-teal-600 hover:underline"
                    >
                      <User className="w-4 h-4" />
                      {d.nome_completo}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Sem discípulos</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "historico" && (
        <div className="space-y-4">
          {membro.historicos && membro.historicos.length > 0 ? (
            membro.historicos.map((h) => (
              <div
                key={h.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {h.tipo.replace("_", " ")}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{h.descricao}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date(h.data_ocorrencia).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-600">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum histórico registrado</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
