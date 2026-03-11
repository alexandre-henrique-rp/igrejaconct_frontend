import { createFileRoute } from '@tanstack/react-router'
import { PrivateRoute } from '@/components/PrivateRoute'
import DashboardPage from '@/pages/DashboardPage'

export const Route = createFileRoute('/' as any)({
  component: () => (
    <PrivateRoute>
      <DashboardPage />
    </PrivateRoute>
  ),
})