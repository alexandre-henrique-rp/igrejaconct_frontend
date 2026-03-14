import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useRolePermission } from '@/hooks/useRolePermission';
import type { User } from '@/services/auth-service';
import * as router from '@tanstack/react-router';

// Mock do useRolePermission
vi.mock('@/hooks/useRolePermission', () => ({
  useRolePermission: vi.fn(),
}));

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock do tokenManager - IMPLEMENTAÇÃO DIRETA sem variáveis externas
vi.mock('@/utils/token-manager', () => ({
  tokenManager: {
    getAccessToken: vi.fn(),
    getUser: vi.fn(),
    isTokenExpiredOrExpiringSoon: vi.fn(),
    clearTokens: vi.fn(),
    setTokens: vi.fn(),
    setUser: vi.fn(),
  },
}));

import { tokenManager } from '@/utils/token-manager';
import { PermissionGuard } from '../PermissionGuard';
import { AuthProvider } from '@/contexts/AuthContext';

const mockUser = (role: User['role']): User => ({
  id: 'user-123',
  email: 'test@example.com',
  role,
});

describe('PermissionGuard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(useRolePermission).mockClear();
    (tokenManager.getAccessToken as any).mockClear();
    (tokenManager.getUser as any).mockClear();
    (tokenManager.isTokenExpiredOrExpiringSoon as any).mockClear();
  });

  const setupTokenManager = (user: User | null) => {
    (tokenManager.getUser as any).mockReturnValue(user);
    (tokenManager.getAccessToken as any).mockReturnValue(user ? 'valid-token' : null);
    (tokenManager.isTokenExpiredOrExpiringSoon as any).mockReturnValue(false);
  };

  it('renderiza children quando autenticado e com permissão', async () => {
    const user = mockUser('PASTOR');
    setupTokenManager(user);
    vi.mocked(useRolePermission).mockReturnValue(true);

    render(
      <AuthProvider>
        <PermissionGuard resource="membros" action="read">
          <div data-testid="protected-content">Conteúdo Protegido</div>
        </PermissionGuard>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(useRolePermission).toHaveBeenCalledWith('membros', 'read');
    });
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redireciona para /403 quando autenticado sem permissão', async () => {
    const user = mockUser('MEMBRO');
    setupTokenManager(user);
    vi.mocked(useRolePermission).mockReturnValue(false);

    render(
      <AuthProvider>
        <PermissionGuard resource="financeiro" action="create">
          <div>Conteúdo Financeiro</div>
        </PermissionGuard>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/403' });
    });
  });

  it('não renderiza quando não autenticado', () => {
    setupTokenManager(null);
    vi.mocked(useRolePermission).mockReturnValue(false);

    const { container } = render(
      <AuthProvider>
        <PermissionGuard resource="membros" action="read">
          <div>Não deve aparecer</div>
        </PermissionGuard>
      </AuthProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('mostra loading durante carregamento do auth', () => {
    // Sem token, AuthProvider não consegue autenticar
    (tokenManager.getAccessToken as any).mockReturnValue(null);
    (tokenManager.getUser as any).mockReturnValue(null);

    const { container } = render(
      <AuthProvider>
        <PermissionGuard resource="membros" action="read">
          <div>Conteúdo</div>
        </PermissionGuard>
      </AuthProvider>
    );

    expect(container.querySelector('.animate-spin')).toBeTruthy();
  });

  it('permite acesso a ADMIN em qualquer recurso', async () => {
    const user = mockUser('ADMIN');
    setupTokenManager(user);
    vi.mocked(useRolePermission).mockReturnValue(true);

    render(
      <AuthProvider>
        <PermissionGuard resource="financeiro" action="delete">
          <div data-testid="admin-action">Admin Action</div>
        </PermissionGuard>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(useRolePermission).toHaveBeenCalledWith('financeiro', 'delete');
    });
    expect(screen.getByTestId('admin-action')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('chama useRolePermission com o resource e action corretos', async () => {
    const user = mockUser('PASTOR');
    setupTokenManager(user);
    const mockHook = vi.fn().mockReturnValue(true);
    vi.mocked(useRolePermission).mockImplementation(mockHook);

    render(
      <AuthProvider>
        <PermissionGuard resource="celulas" action="update">
          <div data-testid="update-celulas">Update</div>
        </PermissionGuard>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockHook).toHaveBeenCalledWith('celulas', 'update');
    });
  });

  it('caso específico: SECRETÁRIO pode ler células mas não criar', async () => {
    const user = mockUser('SECRETARIO');
    setupTokenManager(user);

    const mockHook = vi.fn().mockImplementation((resource: string, action: string) => {
      if (resource === 'celulas') return action === 'read';
      return false;
    });
    vi.mocked(useRolePermission).mockImplementation(mockHook);

    // Teste de leitura
    const { rerender } = render(
      <AuthProvider>
        <PermissionGuard resource="celulas" action="read">
          <div data-testid="celulas-read">Lista Células</div>
        </PermissionGuard>
      </AuthProvider>
    );

    expect(screen.getByTestId('celulas-read')).toBeInTheDocument();

    // Teste de criação
    mockNavigate.mockClear();
    mockHook.mockClear();
    mockHook.mockImplementation((resource: string, action: string) => {
      if (resource === 'celulas') return action === 'read';
      return false;
    });

    rerender(
      <AuthProvider>
        <PermissionGuard resource="celulas" action="create">
          <div>Nova Célula</div>
        </PermissionGuard>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/403' });
    });
  });

  it('caso MEMBRO não pode acessar financeiro (create)', async () => {
    const user = mockUser('MEMBRO');
    setupTokenManager(user);

    vi.mocked(useRolePermission).mockImplementation((resource, action) => {
      const allowed: Record<string, Array<{resource: string, action: string}>> = {
        dashboard: [{ resource: 'dashboard', action: 'read' }],
        eventos: [{ resource: 'eventos', action: 'read' }, { resource: 'eventos', action: 'create' }],
        'escola-biblica': [{ resource: 'escola-biblica', action: 'read' }, { resource: 'escola-biblica', action: 'create' }],
        perfil: [{ resource: 'perfil', action: 'read' }, { resource: 'perfil', action: 'update' }],
      };
      const perms = allowed[resource] || [];
      return perms.some(p => p.resource === resource && (p.action === action || p.action === '*'));
    });

    render(
      <AuthProvider>
        <PermissionGuard resource="financeiro" action="create">
          <div>Financeiro Create</div>
        </PermissionGuard>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/403' });
    });
  });
});
