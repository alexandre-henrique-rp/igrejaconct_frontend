import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center p-8">Redirecionando...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="min-h-screen bg-background text-primary"
    >
      <div className="container mx-auto p-4">
        {children}
        <div className="mt-12 text-[var(--sea-ink-soft)] text-sm text-center">
          © {new Date().getFullYear()} IgrejaConnect
        </div>
      </div>
    </motion.div>
  );
};