import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types/auth";
import {
  Users,
  DollarSign,
  Calendar,
  Home,
  Cross,
  ArrowRight,
  Activity,
  UserPlus,
  CheckCircle2,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
  Church,
  TrendingUp,
} from "lucide-react";
import { ButtonNew } from "@/components/button_new";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-client";
import { TitleComponent } from "#/components/TitleComponent";
import { useToast } from "@/contexts/ToastContext";
import { Link } from "@tanstack/react-router";

// Generic types for dashboard responses
interface DistributionItem<T = string> {
  status: T;
  count: number;
}

interface TimeSeriesData<T = string> {
  month: T;
  count: number;
}


// Interfaces para os dados do backend
interface MembrosDashboardResponse {
  statusDistribution: Array<
    DistributionItem<"ATIVO" | "INATIVO" | "VISITANTE">
  >;
  growthLast12Months: Array<TimeSeriesData<string>>;
  demographics: {
    genero: Array<{ name: string; value: number }>;
    estadoCivil: Array<{ name: string; value: number }>;
  };
  [key: string]: unknown;
}

interface FinanceiroDashboardResponse {
  summary: {
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
  };
  history: Array<{ month: string; entradas: number; saidas: number }>;
}

interface CelulasDashboardResponse {
  summary: {
    totalCelulas: number;
    totalMembrosEmCelulas: number;
    mediaMembrosPorCelula: number;
  };
  meetingStats: {
    totalReunioes: number;
    totalPresentes: number;
    mediaPresenca: number;
    totalConversoes: number;
  };
}

interface Evento {
  id: string;
  titulo: string;
  data: string;
  descricao?: string;
  _count?: {
    inscricoes: number;
  };
}

interface AtividadeRecente {
  id: string;
  action: string;
  user: string;
  time: string;
  type:
    | "igreja"
    | "usuario"
    | "membro"
    | "financeiro"
    | "evento"
    | "celula"
    | "sistema";
}

const DashboardPage = () => {
  const { user } = useAuth();
  const { error: showError } = useToast();

  // Buscar dados do dashboard de membros
  const {
    data: membrosData,
    isLoading: loadingMembros,
    error: errorMembros,
  } = useQuery({
    queryKey: ["dashboard-membros"],
    queryFn: async () => {
      try {
        const response = await api.get<MembrosDashboardResponse>(
          "/relatorios/membros/dashboard",
        );
        return response.data;
      } catch (err: any) {
        console.error("Erro ao buscar dados de membros:", err);
        showError("Erro ao carregar dados de membros");
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Buscar dados do dashboard financeiro
  const { data: financeiroData, isLoading: loadingFinanceiro } = useQuery({
    queryKey: ["dashboard-financeiro"],
    queryFn: async () => {
      try {
        const response = await api.get<FinanceiroDashboardResponse>(
          "/relatorios/financeiro/dashboard",
        );
        return response.data;
      } catch (err: any) {
        console.error("Erro ao buscar dados financeiros:", err);
        if (err?.response?.status !== 403) {
          showError("Erro ao carregar dados financeiros");
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Buscar dados do dashboard de células
  const {
    data: celulasData,
    isLoading: loadingCelulas,
    error: errorCelulas,
  } = useQuery({
    queryKey: ["dashboard-celulas"],
    queryFn: async () => {
      try {
        const response = await api.get<CelulasDashboardResponse>(
          "/relatorios/celulas/dashboard",
        );
        return response.data;
      } catch (err: any) {
        console.error("Erro ao buscar dados de células:", err);
        showError("Erro ao carregar dados de células");
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Buscar próximos eventos do backend
  const { data: eventosData, isLoading: loadingEventos } = useQuery({
    queryKey: ["dashboard-eventos"],
    queryFn: async () => {
      try {
        // Busca eventos a partir de hoje
        const response = await api.get<Evento[]>("/eventos");
        // Filtra eventos futuros e pega os próximos 5
        const eventosFuturos = (response.data || [])
          .filter((evt: Evento) => new Date(evt.data) >= new Date())
          .sort(
            (a: Evento, b: Evento) =>
              new Date(a.data).getTime() - new Date(b.data).getTime(),
          )
          .slice(0, 5);
        return eventosFuturos;
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Buscar atividades recentes (apenas para admin)
  const { data: atividadesData, isLoading: loadingAtividades } = useQuery({
    queryKey: ["dashboard-atividades"],
    queryFn: async () => {
      try {
        const response = await api.get<AtividadeRecente[]>("/admin/activities");
        return response.data || [];
      } catch (err: any) {
        if (err?.response?.status === 403) {
          return []; // Silenciosamente falha para não-admin
        }
        console.error("Erro ao buscar atividades:", err);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
    enabled: user?.role === "ADMIN" || user?.role === "ADMIN_MASTER",
  });

  // Calcular estatísticas
  const stats = {
    membros: {
      total:
        membrosData?.statusDistribution?.reduce(
          (acc, curr) => acc + curr.count,
          0,
        ) || 0,
      ativos:
        membrosData?.statusDistribution?.find((s) => s.status === "ATIVO")
          ?.count || 0,
      novosEsteMes: membrosData?.growthLast12Months?.slice(-1)[0]?.count || 0,
    },
    financeiro: {
      totalMes: financeiroData?.summary?.totalEntradas || 0,
      saldo: financeiroData?.summary?.saldo || 0,
    },
    celulas: {
      total: celulasData?.summary?.totalCelulas || 0,
      membrosEmCelulas: celulasData?.summary?.totalMembrosEmCelulas || 0,
      mediaPresenca: celulasData?.meetingStats?.mediaPresenca || 0,
    },
    eventos: {
      proximos: eventosData?.length || 0,
    },
  };

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    if (data.toDateString() === hoje.toDateString()) {
      return `Hoje, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    }
    if (data.toDateString() === amanha.toDateString()) {
      return `Amanhã, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    }

    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarValor = (valor: number) => {
    if (valor === 0) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarDataAtividade = (timeString: string) => {
    const data = new Date(timeString);
    const agora = new Date();
    const diffEmHoras = (agora.getTime() - data.getTime()) / (1000 * 60 * 60);

    if (diffEmHoras < 1) return "Agora mesmo";
    if (diffEmHoras < 24) return `${Math.floor(diffEmHoras)}h atrás`;
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const getIconeAtividade = (tipo: string) => {
    switch (tipo) {
      case "membro":
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case "financeiro":
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case "evento":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "celula":
        return <Home className="w-4 h-4 text-teal-600" />;
      case "igreja":
        return <Church className="w-4 h-4 text-amber-600" />;
      case "usuario":
        return <Users className="w-4 h-4 text-indigo-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const isLoading =
    loadingMembros || loadingFinanceiro || loadingCelulas || loadingEventos;
  const hasError = errorMembros || errorCelulas;

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Erro ao carregar dashboard
        </h2>
        <p className="text-gray-600 mb-4">
          Não foi possível carregar os dados do dashboard.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <TitleComponent
          title={`${getSaudacao()}, ${user?.firstName || user?.email?.split("@")[0] || "Usuário"}!`}
          description="Aqui está o resumo da sua igreja em tempo real."
        />
        <div className="flex gap-3">
          <ButtonNew nav="/membros/new" label="Novo Membro" />
          <ButtonNew
            nav="/financeiro/lancamentos/new"
            label="Novo Lançamento"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <span className="ml-2 text-gray-600">Carregando dados...</span>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Membros */}
        <Link
          to="/membros"
          className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-purple-100">
                  Membros
                </span>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {loadingMembros ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                stats.membros.total
              )}
            </div>
            <span className="bg-purple-300 text-purple-900 px-2 py-0.5 rounded-full text-xs font-semibold">
              {stats.membros.ativos} ativos
            </span>
          </div>
        </Link>

        {/* Card Financeiro */}
        <Link
          to="/financeiro"
          className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-emerald-100">
                  Entradas do Mês
                </span>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {loadingFinanceiro ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                formatarValor(stats.financeiro.totalMes)
              )}
            </div>
            <span
              className={`text-xs font-medium ${stats.financeiro.saldo >= 0 ? "text-emerald-200" : "text-red-200"}`}
            >
              Saldo: {formatarValor(stats.financeiro.saldo)}
            </span>
          </div>
        </Link>

        {/* Card Células */}
        <Link
          to="/celulas"
          className="bg-linear-to-br from-teal-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-teal-100">
                  Células
                </span>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {loadingCelulas ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                stats.celulas.total
              )}
            </div>
            <span className="bg-teal-300 text-teal-900 px-2 py-0.5 rounded-full text-xs font-semibold">
              {stats.celulas.membrosEmCelulas} membros
            </span>
          </div>
        </Link>

        {/* Card Eventos */}
        <Link
          to="/eventos"
          className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-blue-100">
                  Eventos
                </span>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {loadingEventos ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                stats.eventos.proximos
              )}
            </div>
            <span className="bg-blue-300 text-blue-900 px-2 py-0.5 rounded-full text-xs font-semibold">
              Próximos eventos
            </span>
          </div>
        </Link>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividades Recentes */}
        <div className="lg:col-span-2 bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Atividades Recentes
              </h2>
            </div>
            {(user?.role === Role.ADMIN ||
              user?.role === Role.ADMIN_MASTER) && (
              <Link
                to="/admin"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              >
                Ver admin
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {loadingAtividades ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
            </div>
          ) : atividadesData && atividadesData.length > 0 ? (
            <div className="space-y-3">
              {atividadesData.slice(0, 5).map((atividade) => (
                <div
                  key={atividade.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {getIconeAtividade(atividade.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {atividade.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600">
                        {atividade.user}
                      </span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-600">
                        {formatarDataAtividade(atividade.time)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhuma atividade recente registrada.</p>
            </div>
          )}
        </div>

        {/* Próximos Eventos */}
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Próximos Eventos
              </h2>
            </div>
            <Link
              to="/eventos"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Ver todos
            </Link>
          </div>

          {loadingEventos ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
            </div>
          ) : eventosData && eventosData.length > 0 ? (
            <div className="space-y-3">
              {eventosData.map((evento) => (
                <div
                  key={evento.id}
                  className="p-3 border border-gray-300 rounded-lg hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {evento.titulo}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-600">
                          {formatarData(evento.data)}
                        </span>
                      </div>
                    </div>
                    {evento._count && evento._count.inscricoes > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 ml-2">
                        <Users className="w-3 h-3" />
                        {evento._count.inscricoes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum evento programado.</p>
            </div>
          )}

          <Link
            to="/eventos/new"
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Criar novo evento
          </Link>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Link
            to="/membros/new"
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <div className="p-2 bg-purple-500 rounded-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Novo Membro
            </span>
          </Link>

          <Link
            to="/financeiro/lancamentos/new"
            className="flex flex-col items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
          >
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Lançamento
            </span>
          </Link>

          <Link
            to="/celulas/new"
            className="flex flex-col items-center gap-2 p-4 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors"
          >
            <div className="p-2 bg-teal-500 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Nova Célula
            </span>
          </Link>

          <Link
            to="/eventos/new"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <div className="p-2 bg-blue-500 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Novo Evento
            </span>
          </Link>

          <Link
            to="/ministerios/new"
            className="flex flex-col items-center gap-2 p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Cross className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Ministério
            </span>
          </Link>

          <Link
            to="/relatorios"
            className="flex flex-col items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
          >
            <div className="p-2 bg-amber-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Relatórios
            </span>
          </Link>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-linear-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Dica do dia</h3>
              <p className="text-teal-100 text-sm max-w-xl">
                Mantenha os dados da sua igreja sempre atualizados. Use os
                relatórios para acompanhar o crescimento e tomar decisões
                baseadas em dados.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/relatorios"
              className="px-4 py-2 bg-white text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors text-sm"
            >
              Ver Relatórios
            </Link>
            <Link
              to="/configuracoes"
              className="px-4 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors text-sm"
            >
              Configurações
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
