import { createFileRoute } from '@tanstack/react-router'
import { MemberForm } from '@/features/membros/components/MemberForm'

export const Route = createFileRoute('/membros/new')({
  component: NewMemberPage,
})

function NewMemberPage() {
  return <MemberForm />
}
