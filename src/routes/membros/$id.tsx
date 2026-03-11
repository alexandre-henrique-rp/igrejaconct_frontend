import { createFileRoute } from '@tanstack/react-router'
import { MemberDetail } from '@/features/membros/components/MemberDetail'

export const Route = createFileRoute('/membros/$id')({
  component: MemberDetailPage,
})

function MemberDetailPage() {
  return <MemberDetail />
}
