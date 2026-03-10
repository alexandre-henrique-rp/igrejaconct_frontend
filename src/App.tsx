import { RouterProvider } from '@tanstack/react-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { getRouter } from '@/router';

const router = getRouter();

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
