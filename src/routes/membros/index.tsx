import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { MemberList } from '@/features/membros/components/MemberList'

export const Route = createFileRoute('/membros/')({
  component: MembrosPage,
})

function MembrosPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <MemberList />
      </DashboardLayout>
    </PrivateRoute>
  )
}
