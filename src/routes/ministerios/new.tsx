import { createFileRoute } from '@tanstack/react-router'
import { MinisterioForm } from '@/features/ministerios/components/MinisterioForm'

export const Route = createFileRoute('/ministerios/new')({
  component: NewMinisterioPage,
})

function NewMinisterioPage() {
  return <MinisterioForm />
}
