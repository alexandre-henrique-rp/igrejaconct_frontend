import { createFileRoute } from '@tanstack/react-router';
import { ForbiddenPage } from '@/pages/ForbiddenPage';

export const Route = createFileRoute('/403')({
  component: ForbiddenPage,
});
