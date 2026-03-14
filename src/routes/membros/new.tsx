import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { MemberForm } from '@/features/membros/components/MemberForm'

export const Route = createFileRoute('/membros/new')({
  component: NewMemberPage,
})

function NewMemberPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <MemberForm />
      </DashboardLayout>
    </PrivateRoute>
  )
}
