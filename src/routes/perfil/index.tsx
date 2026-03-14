import { createFileRoute } from '@tanstack/react-router'
import { PrivateRoute } from '@/components/PrivateRoute'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import PerfilPage from '@/pages/PerfilPage'

export const Route = createFileRoute('/perfil/' as any)({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
        <PerfilPage />
      </DashboardLayout>
    </PrivateRoute>
  ),
})