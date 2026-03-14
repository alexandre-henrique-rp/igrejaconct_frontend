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
      className=""
    >
      <div className="">
        {children}
        <div className="mt-12 text-gray-600 text-sm text-center">
          © 2026 IgrejaConnect
        </div>
      </div>
    </motion.div>
  );
};