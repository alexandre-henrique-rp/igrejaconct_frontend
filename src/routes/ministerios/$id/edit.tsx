import { createFileRoute } from '@tanstack/react-router'
import { MinisterioForm } from '@/features/ministerios/components/MinisterioForm'

export const Route = createFileRoute('/ministerios/$id/edit')({
  component: EditMinisterioPage,
})

function EditMinisterioPage() {
  return <MinisterioForm />
}
