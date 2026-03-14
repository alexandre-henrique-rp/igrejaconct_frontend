import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { BensListPage } from '@/pages/patrimonio/BensListPage';

export const Route = createFileRoute('/patrimonio/' as any)({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
        <BensListPage />
      </DashboardLayout>
    </PrivateRoute>
  ),
});