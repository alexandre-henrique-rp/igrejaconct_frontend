import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { MinisteriosList } from '@/features/ministerios/components/MinisteriosList'

export const Route = createFileRoute('/ministerios/')({
  component: MinisteriosPage,
})

function MinisteriosPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <MinisteriosList />
      </DashboardLayout>
    </PrivateRoute>
  )
}
