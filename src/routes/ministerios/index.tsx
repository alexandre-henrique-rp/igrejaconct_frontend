import { createFileRoute } from '@tanstack/react-router'
import { MinisteriosList } from '@/features/ministerios/components/MinisteriosList'

export const Route = createFileRoute('/ministerios/')({
  component: MinisteriosPage,
})

function MinisteriosPage() {
  return <MinisteriosList />
}
