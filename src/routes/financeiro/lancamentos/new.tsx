import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { LancamentoForm } from '@/features/financeiro/components/LancamentoForm'

export const Route = createFileRoute('/financeiro/lancamentos/new')({
  component: NewLancamentoPage,
})

function NewLancamentoPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <LancamentoForm />
      </DashboardLayout>
    </PrivateRoute>
  )
}
