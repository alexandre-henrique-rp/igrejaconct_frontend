import { useToast } from '@/contexts/ToastContext';

export const useToastHandler = () => {
  const { success, error, warning, info } = useToast();

  const handleSuccess = (message: string) => {
    success(message, 4000);
  };

  const handleError = (message: string) => {
    error(message, 6000);
  };

  const handleWarning = (message: string) => {
    warning(message, 5000);
  };

  const handleInfo = (message: string) => {
    info(message, 3000);
  };

  return {
    handleSuccess,
    handleError,
    handleWarning,
    handleInfo,
    success,
    error: error,
    warning,
    info,
  };
};