import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { BemDetailPage } from '@/pages/patrimonio/BemDetailPage';

export const Route = createFileRoute('/patrimonio/$id' as any)({
  component: () => (
    <PrivateRoute>
      <BemDetailPage />
    </PrivateRoute>
  ),
});
