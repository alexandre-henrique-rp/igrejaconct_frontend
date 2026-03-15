import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar Lateral - flex shrink-0 para não comprimir */}
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} 
      />
      
      {/* Conteúdo Principal - ocupa o espaço restante */}
      <main className="flex-1 overflow-y-auto p-4 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};