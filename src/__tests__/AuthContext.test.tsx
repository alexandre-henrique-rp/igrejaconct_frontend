import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth-service';
import { tokenManager } from '@/utils/token-manager';

// Test component that uses the auth hook
function TestComponent() {
  const { user, isAuthenticated, isLoading, login, logout, refreshToken } = useAuth();
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</div>
      <div data-testid="user">{user?.firstName || 'no user'}</div>
      <button onClick={() => login('test@example.com', 'password')} data-testid="login-btn">Login</button>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
      <button onClick={refreshToken} data-testid="refresh-btn">Refresh</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenManager.clearTokens();
  });

  it('should start as unauthenticated and not loading when no tokens', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
  });

  it('should login successfully and set user', async () => {
    const mockUser = { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'MEMBRO' as const };
    vi.spyOn(authService, 'login').mockResolvedValue({
      user: mockUser,
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    });
    vi.spyOn(authService, 'getProfile').mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });

    // Click login
    screen.getByTestId('login-btn').click();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    }, { timeout: 3000 });
    
    expect(screen.getByTestId('user')).toHaveTextContent('Test');
  });

  it('should logout and clear state', async () => {
    const mockUser = { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'MEMBRO' as const };
    vi.spyOn(authService, 'logout').mockResolvedValue(undefined);
    vi.spyOn(authService, 'getProfile').mockResolvedValue(mockUser);
    tokenManager.setTokens('access', 'refresh');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    // Logout
    screen.getByTestId('logout-btn').click();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });
  });

  it('should refresh token when called', async () => {
    const mockUser = { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'MEMBRO' as const };
    vi.spyOn(authService, 'refresh').mockResolvedValue({
      access_token: 'refreshed-access-token',
      refresh_token: 'refreshed-refresh-token',
    });

    // Setup initial tokens
    tokenManager.setTokens('old-access', 'old-refresh');
    tokenManager.setUser(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    });

    // Click refresh
    screen.getByTestId('refresh-btn').click();

    // Should still be authenticated after refresh
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
  });
});
