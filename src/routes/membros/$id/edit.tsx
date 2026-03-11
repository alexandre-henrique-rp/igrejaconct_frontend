import { createFileRoute } from '@tanstack/react-router'
import { MemberForm } from '@/features/membros/components/MemberForm'

export const Route = createFileRoute('/membros/$id/edit')({
  component: EditMemberPage,
})

function EditMemberPage() {
  return <MemberForm />
}
