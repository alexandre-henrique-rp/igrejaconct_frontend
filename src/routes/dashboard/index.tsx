import { createFileRoute } from '@tanstack/react-router'
import { PrivateRoute } from '@/components/PrivateRoute'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import DashboardPage from '@/pages/DashboardPage'

export const Route = createFileRoute('/' as any)({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </PrivateRoute>
  ),
})