import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { MemberDetail } from '@/features/membros/components/MemberDetail'

export const Route = createFileRoute('/membros/$id')({
  component: MemberDetailPage,
})

function MemberDetailPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <MemberDetail />
      </DashboardLayout>
    </PrivateRoute>
  )
}
