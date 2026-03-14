import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PrivateRoute } from "@/components/PrivateRoute";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-client";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Clock,
  Filter,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/eventos/")({
  component: EventosPage,
});

function EventosPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <EventosCalendar />
      </DashboardLayout>
    </PrivateRoute>
  );
}

function EventosCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // FETCH: EVENTOS E CATEGORIAS
  const { data: eventos, isLoading: loadingEvents } = useQuery({
    queryKey: ["eventos"],
    queryFn: async () => {
      const response = await api.get("/eventos");
      return response.data;
    },
  });

  const { data: categorias } = useQuery({
    queryKey: ["eventos-categorias"],
    queryFn: async () => {
      const response = await api.get("/eventos/categorias");
      return response.data;
    },
  });

  // LÓGICA DE CALENDÁRIO
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // FILTRAR EVENTOS PARA O CALENDÁRIO
  const getEventsForDay = (day: number) => {
    return (
      eventos?.filter((event: any) => {
        const eventDate = new Date(event.data_inicio);
        const sameDay =
          eventDate.getDate() === day &&
          eventDate.getMonth() === month &&
          eventDate.getFullYear() === year;

        if (!sameDay) return false;
        if (selectedCategory && event.categoria_id !== selectedCategory)
          return false;
        return true;
      }) || []
    );
  };

  // GERAR GRID DE DIAS
  const days = [];
  // Fill empty slots from previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(
      <div
        key={`empty-${i}`}
        className="h-32 border-b border-r border-gray-200 bg-gray-50/20"
      />,
    );
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = getEventsForDay(d);
    const isToday =
      d === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    days.push(
      <div
        key={d}
        className={`h-32 border-b border-r border-gray-200 p-2 transition-all hover:bg-gray-50/30 ${isToday ? "bg-teal-50/10" : "bg-white"}`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold ${isToday ? "bg-teal-600 text-white h-6 w-6 rounded-full flex items-center justify-center" : "text-gray-600"}`}
          >
            {d}
          </span>
        </div>
        <div className="mt-2 space-y-1 overflow-y-auto max-h-20 scrollbar-hide">
          {dayEvents.map((event: any) => (
            <Link
              key={event.id}
              to="/eventos/$id"
              params={{ id: event.id }}
              className="block truncate rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white transition-opacity hover:opacity-80"
              style={{
                backgroundColor: event.categoria?.cor || "var(--lagoon)",
              }}
            >
              {event.nome}
            </Link>
          ))}
        </div>
      </div>,
    );
  }

  return (
    <div className="page-wrap py-8">
      {/* Header com Navegação */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-teal-600" />
            Calendário de Eventos
          </h1>
          <p className="mt-1 text-gray-600">
            Acompanhe a agenda de cultos, cursos e conferências da igreja.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/eventos/new"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Novo Evento
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
              <Filter className="h-4 w-4 text-teal-600" />
              Filtrar Categoria
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${!selectedCategory ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <div className="h-3 w-3 rounded-full bg-gray-400" />
                Todas as Categorias
              </button>
              {categorias?.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${selectedCategory === cat.id ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.cor }}
                  />
                  {cat.nome}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
              Próximos Eventos
            </h3>
            <div className="space-y-4">
              {eventos?.slice(0, 3).map((event: any) => (
                <div key={event.id} className="group cursor-pointer">
                  <p className="text-xs font-bold text-teal-600 uppercase">
                    {new Date(event.data_inicio).toLocaleDateString()}
                  </p>
                  <h4 className="mt-0.5 font-bold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                    {event.nome}
                  </h4>
                  <div className="mt-1 flex items-center gap-3 text-[10px] text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />{" "}
                      {new Date(event.data_inicio).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {event.local || "Geral"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Calendar Grid */}
        <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {/* Calendar Toolbar */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/30">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                {monthNames[month]}{" "}
                <span className="text-gray-600 font-medium">{year}</span>
              </h2>
              <button
                onClick={goToToday}
                className="rounded-full bg-white border border-gray-200 px-4 py-1.5 text-xs font-bold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Hoje
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextMonth}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/10 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div key={day} className="py-2.5 border-r border-gray-200">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7">
            {loadingEvents ? (
              <div className="col-span-7 flex h-96 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
              </div>
            ) : (
              days
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
