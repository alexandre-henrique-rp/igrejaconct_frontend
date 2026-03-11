import { useState, useEffect } from 'react';

export const useSidebarVisibility = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return { isExpanded, toggleExpand };
};