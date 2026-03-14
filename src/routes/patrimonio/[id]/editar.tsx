import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { BemFormPage } from '@/pages/patrimonio/BemFormPage';

export const Route = createFileRoute('/patrimonio/$id/editar' as any)({
  component: () => (
    <PrivateRoute>
      <DashboardLayout>
        <BemFormPage />
      </DashboardLayout>
    </PrivateRoute>
  ),
});