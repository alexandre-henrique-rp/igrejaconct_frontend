import { createFileRoute } from '@tanstack/react-router';
import { PrivateRoute } from '@/components/PrivateRoute';
import DashboardPage from '#/pages/DashboardPage';
import { PrivateLayout } from '#/components/PrivateLayout';
import { DashboardLayout } from '#/layouts/DashboardLayout';


export const Route = createFileRoute('/')({
  component: () => (
    <PrivateRoute>
      <PrivateLayout>
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </PrivateLayout>
    </PrivateRoute>
  ),
});