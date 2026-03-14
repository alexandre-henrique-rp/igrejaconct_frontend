import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { MinisterioForm } from '@/features/ministerios/components/MinisterioForm'

export const Route = createFileRoute('/ministerios/new')({
  component: NewMinisterioPage,
})

function NewMinisterioPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <MinisterioForm />
      </DashboardLayout>
    </PrivateRoute>
  )
}
