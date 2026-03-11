import { createFileRoute } from '@tanstack/react-router'
import { PrivateRoute } from '@/components/PrivateRoute'
import PerfilPage from '@/pages/PerfilPage'

export const Route = createFileRoute('/perfil/' as any)({
  component: () => (
    <PrivateRoute>
      <PerfilPage />
    </PrivateRoute>
  ),
})