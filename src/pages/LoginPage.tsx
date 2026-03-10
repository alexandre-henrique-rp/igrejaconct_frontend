import React from 'react';
import { LoginForm } from '@/components/LoginForm';
import { useNavigate } from '@tanstack/react-router';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
};
