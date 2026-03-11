import { createFileRoute } from '@tanstack/react-router'
import { UserAvailability } from '@/features/ministerios/components/UserAvailability'

export const Route = createFileRoute('/perfil/disponibilidade')({
  component: UserAvailabilityPage,
})

function UserAvailabilityPage() {
  return <UserAvailability />
}
