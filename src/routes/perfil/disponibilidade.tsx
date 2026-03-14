import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { UserAvailability } from '@/features/ministerios/components/UserAvailability'

export const Route = createFileRoute('/perfil/disponibilidade')({
  component: UserAvailabilityPage,
})

function UserAvailabilityPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <UserAvailability />
      </DashboardLayout>
    </PrivateRoute>
  )
}
