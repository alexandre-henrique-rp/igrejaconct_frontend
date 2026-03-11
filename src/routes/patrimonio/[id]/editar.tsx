import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { BemFormPage } from '@/pages/patrimonio/BemFormPage';

export const Route = createFileRoute('/patrimonio/$id/editar' as any)({
  component: () => (
    <PrivateRoute>
      <BemFormPage />
    </PrivateRoute>
  ),
});