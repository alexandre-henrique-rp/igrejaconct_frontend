import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PrivateRoute } from "@/components/PrivateRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api-client";
import {
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  Clock,
  UserPlus,
  CheckCircle2,
  MoreVertical,
  X,
  Loader2,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/eventos/$id")({
  component: EventoDetailsPage,
});

function EventoDetailsPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <EventoDetails />
      </DashboardLayout>
    </PrivateRoute>
  );
}

function EventoDetails() {
  const { id } = useParams({ from: "/eventos/$id" });
  const queryClient = useQueryClient();
  const [showInscribeModal, setShowInscribeModal] = useState(false);
  const inscribeForm = useForm();

  // FETCH: EVENTO E TODOS OS MEMBROS
  const { data: evento, isLoading } = useQuery({
    queryKey: ["evento", id],
    queryFn: async () => {
      const response = await api.get(`/eventos/${id}`);
      return response.data;
    },
  });

  const { data: todosMembros } = useQuery({
    queryKey: ["membros-select"],
    queryFn: async () => {
      const response = await api.get("/membros");
      return response.data;
    },
    enabled: showInscribeModal,
  });

  // MUTAÇÕES
  const inscribeMutation = useMutation({
    mutationFn: (data: any) => api.post(`/eventos/${id}/inscricoes`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evento", id] });
      setShowInscribeModal(false);
      inscribeForm.reset();
    },
  });

  const checkInMutation = useMutation({
    mutationFn: (inscricaoId: string) =>
      api.post("/eventos/checkin", { inscricao_id: inscricaoId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evento", id] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  return (
    <div className="page-wrap py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/eventos"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {evento.nome}
              </h1>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{
                  backgroundColor: evento.categoria?.cor || "var(--lagoon)",
                }}
              >
                {evento.categoria?.nome}
              </span>
            </div>
            <p className="mt-1 text-gray-600">
              Organizado por{" "}
              <span className="font-semibold text-teal-700">
                {evento.responsavel?.nome_completo || "Secretaria"}
              </span>
            </p>
          </div>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">
              Detalhes do Evento
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">
                    Horário
                  </p>
                  <p className="mt-0.5 text-sm text-gray-900">
                    {new Date(evento.data_inicio).toLocaleDateString()}{" "}
                    {new Date(evento.data_inicio).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-gray-600">
                    até{" "}
                    {new Date(evento.data_fim).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">
                    Local
                  </p>
                  <p className="mt-0.5 text-sm text-gray-900">
                    {evento.local || "Auditório Principal"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">
                    Capacidade
                  </p>
                  <p className="mt-0.5 text-sm text-gray-900">
                    {evento.capacidade
                      ? `${evento.inscricoes.length} / ${evento.capacidade}`
                      : `${evento.inscricoes.length} Inscritos`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">
                    Investimento
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-teal-700">
                    {evento.valor > 0
                      ? formatCurrency(evento.valor)
                      : "Gratuito"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">
              Sobre o Evento
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-900">
              {evento.descricao ||
                "Nenhuma descrição detalhada disponível para este evento."}
            </p>
          </div>
        </div>

        {/* Inscritos Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Inscritos e Check-in
            </h2>
            <button
              onClick={() => setShowInscribeModal(true)}
              className="flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition-all"
            >
              <UserPlus className="h-4 w-4" />
              Nova Inscrição
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-xs font-bold uppercase text-gray-600">
                <tr>
                  <th className="px-6 py-4">Membro</th>
                  <th className="px-6 py-4">Pagamento</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {evento.inscricoes.map((ins: any) => (
                  <tr
                    key={ins.id}
                    className="hover:bg-gray-50/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center text-[10px] font-bold text-teal-700 uppercase">
                          {ins.membro.nome_completo.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {ins.membro.nome_completo}
                          </p>
                          <p className="text-[10px] text-gray-600">
                            {ins.membro.email || "Sem e-mail"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          ins.status_pagamento === "PAGO"
                            ? "bg-green-100 text-green-700"
                            : ins.status_pagamento === "ISENTO"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ins.status_pagamento}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {ins.checkin ? (
                          <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                            <CheckCircle2 className="h-4 w-4" />
                            Presença Confirmada
                          </div>
                        ) : (
                          <button
                            onClick={() => checkInMutation.mutate(ins.id)}
                            disabled={checkInMutation.isPending}
                            className="rounded-full border border-teal-600 px-4 py-1 text-xs font-bold text-teal-600 hover:bg-teal-600 hover:text-white transition-all disabled:opacity-50"
                          >
                            Realizar Check-in
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {evento.inscricoes.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-gray-600 italic"
                    >
                      Nenhuma inscrição realizada até o momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: NOVA INSCRIÇÃO */}
      {showInscribeModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Nova Inscrição
              </h2>
              <button
                onClick={() => setShowInscribeModal(false)}
                className="rounded-full p-2 hover:bg-gray-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={inscribeForm.handleSubmit((data) =>
                inscribeMutation.mutate(data),
              )}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-600">
                  Selecionar Membro
                </label>
                <select
                  {...inscribeForm.register("membro_id", { required: true })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {todosMembros?.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.nome_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-600">
                  Status do Pagamento
                </label>
                <select
                  {...inscribeForm.register("status_pagamento")}
                  defaultValue={evento.valor > 0 ? "PENDENTE" : "ISENTO"}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none"
                >
                  <option value="ISENTO">Isento</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="PAGO">Pago</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={inscribeMutation.isPending}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 disabled:opacity-50"
              >
                {inscribeMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                Confirmar Inscrição
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
