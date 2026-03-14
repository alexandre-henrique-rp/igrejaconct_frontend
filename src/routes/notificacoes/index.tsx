import { createFileRoute } from '@tanstack/react-router'
import { PrivateRoute } from '@/components/PrivateRoute'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import NotificacoesPage from '@/pages/NotificacoesPage'

export const Route = createFileRoute('/notificacoes/' as any)({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
        <NotificacoesPage />
      </DashboardLayout>
    </PrivateRoute>
  ),
})