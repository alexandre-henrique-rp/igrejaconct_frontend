import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { MinisterioDetail } from '@/features/ministerios/components/MinisterioDetail'

export const Route = createFileRoute('/ministerios/$id')({
  component: MinisterioDetailPage,
})

function MinisterioDetailPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <MinisterioDetail />
      </DashboardLayout>
    </PrivateRoute>
  )
}
