import { createFileRoute } from '@tanstack/react-router'
import { MinisterioDetail } from '@/features/ministerios/components/MinisterioDetail'

export const Route = createFileRoute('/ministerios/$id')({
  component: MinisterioDetailPage,
})

function MinisterioDetailPage() {
  return <MinisterioDetail />
}
