import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { GraduationCap, Users, Award, BookOpen } from 'lucide-react';

export const Route = createFileRoute('/escola-biblica/')({
  component: EscolaBiblicaPage,
});

function EscolaBiblicaPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <EscolaBiblicaIndex />
      </DashboardLayout>
    </PrivateRoute>
  )
}

function EscolaBiblicaIndex() {
  const modules = [
    {
      title: 'Cursos',
      description: 'Gerencie cursos da escola bíblica',
      icon: BookOpen,
      href: '/escola-biblica/cursos',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Turmas',
      description: 'Aulas e horários das turmas',
      icon: GraduationCap,
      href: '/escola-biblica/turmas',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Matrículas',
      description: 'Matrículas de alunos',
      icon: Users,
      href: '/escola-biblica/matriculas',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Certificados',
      description: 'Geração e validação de certificados',
      icon: Award,
      href: '/escola-biblica/certificados',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-purple-600" />
          Escola Bíblica
        </h1>
        <p className="text-gray-500 mt-1">
          Selecione um módulo para gerenciar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <a
            key={module.href}
            href={module.href}
            className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all"
          >
            <div className={`w-12 h-12 ${module.bgColor} ${module.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <module.icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h2>
            <p className="text-gray-500 text-sm">{module.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}