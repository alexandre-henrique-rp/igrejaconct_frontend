import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PrivateRoute } from "@/components/PrivateRoute";
import { Wallet, Tags, Receipt } from "lucide-react";
import { TitleComponent } from "#/components/TitleComponent";

export const Route = createFileRoute("/financeiro/")({
  component: FinanceiroPage,
});

function FinanceiroPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <FinanceiroIndex />
      </DashboardLayout>
    </PrivateRoute>
  );
}

function FinanceiroIndex() {
  const modules = [
    {
      title: "Lançamentos",
      description: "Controle de receitas e despesas",
      icon: Receipt,
      href: "/financeiro/lancamentos",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Contas",
      description: "Contas bancárias e caixas",
      icon: Wallet,
      href: "/financeiro/contas",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Categorias",
      description: "Categorização de transações",
      icon: Tags,
      href: "/financeiro/categorias",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <TitleComponent
          title="Gestão Financeira"
          description="Selecione um módulo para gerenciar"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <a
            key={module.href}
            href={module.href}
            className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-green-300 transition-all"
          >
            <div
              className={`w-12 h-12 ${module.bgColor} ${module.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <module.icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {module.title}
            </h2>
            <p className="text-gray-500 text-sm">{module.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
