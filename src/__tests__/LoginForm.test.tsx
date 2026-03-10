import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  const mockUseAuth = useAuth as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  it('should render email and password inputs and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should call login on form submit with email and password', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should disable button when loading', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
    });
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: /entrando/i });
    expect(submitButton).toBeDisabled();
  });

  it('should display error message when error exists', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid credentials',
    });
    render(<LoginForm />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('should call onSuccess after successful login', async () => {
    mockLogin.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });

    render(<LoginForm onSuccess={onSuccess} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
