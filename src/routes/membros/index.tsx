import { createFileRoute } from '@tanstack/react-router'
import { MemberList } from '@/features/membros/components/MemberList'

export const Route = createFileRoute('/membros/')({
  component: MembrosPage,
})

function MembrosPage() {
  return <MemberList />
}
