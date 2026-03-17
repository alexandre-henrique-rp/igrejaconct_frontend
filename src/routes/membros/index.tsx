import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PrivateRoute } from '@/components/PrivateRoute'
import { MemberList } from '@/features/membros/components/MemberList'


const MembrosPage = () => {


  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="space-y-6 overflow-hidden">
          <MemberList />
        </div>
      </DashboardLayout>
    </PrivateRoute>
  )
}

export const Route = createFileRoute('/membros/')({
  component: MembrosPage,
})
