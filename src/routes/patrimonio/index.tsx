import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { BensListPage } from '@/pages/patrimonio/BensListPage';

export const Route = createFileRoute('/patrimonio/' as any)({
  component: () => (
    <PrivateRoute>
      <BensListPage />
    </PrivateRoute>
  ),
});