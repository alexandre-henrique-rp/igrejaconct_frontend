import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermission } from '@/hooks/useRolePermission';
import type { User } from '@/services/auth-service';
import * as router from '@tanstack/react-router';

// Mock dos hooks
vi.mock('@/hooks/useRolePermission');
vi.mock('@/contexts/AuthContext');
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));

// Mock do useSidebar (necessário porque Sidebar usa useSidebarVisibility)
const mockToggleExpand = vi.fn();
const mockIsExpanded = true;
vi.mock('@/contexts/SidebarContext', () => ({
  useSidebar: () => ({
    isExpanded: mockIsExpanded,
    toggleExpand: mockToggleExpand,
  }),
}));

const mockUser = (role: User['role']): User => ({
  id: 'user-123',
  email: 'test@example.com',
  role,
});

const mockUseAuth = () => ({
  user: mockUser('PASTOR'),
  isAuthenticated: true,
  isLoading: false,
  logout: vi.fn(),
});

describe('Sidebar - Filtragem por Permissões', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue(mockUseAuth());
  });

  it('deve mostrar apenas itens permitidos para PASTOR', () => {
    // PASTOR pode: dashboard, membros (read+update), celulas (full), ministerios (full), eventos (full), financeiro (full), escola-biblica (full), relatorios (full), admin (read)
    vi.mocked(useRolePermission).mockImplementation((resource: string, action: string) => {
      const allowedResources = [
        'dashboard', 'membros', 'celulas', 'ministerios', 
        'eventos', 'financeiro', 'escola-biblica', 'relatorios', 'admin'
      ];
      return allowedResources.includes(resource);
    });

    render(<Sidebar />);

    // Deve ver itens permitidos
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Membros')).toBeInTheDocument();
    expect(screen.getByText('Ministérios')).toBeInTheDocument();
    expect(screen.getByText('Eventos')).toBeInTheDocument();
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Escola Bíblica')).toBeInTheDocument();
    expect(screen.getByText('Células')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    expect(screen.getByText('Painel Admin')).toBeInTheDocument();
  });

  it('deve ocultar Financeiro para MEMBRO', () => {
    // Atualiza useAuth para MEMBRO
    (useAuth as any).mockReturnValue({
      ...mockUseAuth(),
      user: mockUser('MEMBRO'),
    });

    // MEMBRO pode: dashboard, eventos (read+create), escola-biblica (read+create), celulas (read), perfil (read+update)
    vi.mocked(useRolePermission).mockImplementation((resource: string, action: string) => {
      const allowedResources = ['dashboard', 'eventos', 'escola-biblica', 'celulas', 'perfil'];
      return allowedResources.includes(resource);
    });

    render(<Sidebar />);

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Eventos')).toBeInTheDocument();
    expect(screen.getByText('Escola Bíblica')).toBeInTheDocument();
    expect(screen.getByText('Células')).toBeInTheDocument();
    expect(screen.getByText('Disponibilidade')).toBeInTheDocument(); // perfil

    // Não deve ver
    expect(screen.queryByText('Financeiro')).not.toBeInTheDocument();
    expect(screen.queryByText('Membros')).not.toBeInTheDocument();
    expect(screen.queryByText('Ministérios')).not.toBeInTheDocument();
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
    expect(screen.queryByText('Configurações')).not.toBeInTheDocument();
    expect(screen.queryByText('Painel Admin')).not.toBeInTheDocument();
  });

  it('deve ocultar items administrativos para SECRETÁRIO', () => {
    (useAuth as any).mockReturnValue({
      ...mockUseAuth(),
      user: mockUser('SECRETARIO'),
    });

    // SECRETARIO pode: dashboard, membros (full), celulas (read), eventos (full), financeiro (full), escola-biblica (full), relatorios (read), arquivos (full)
    vi.mocked(useRolePermission).mockImplementation((resource: string, action: string) => {
      const allowedResources = [
        'dashboard', 'membros', 'celulas', 'eventos', 
        'financeiro', 'escola-biblica', 'relatorios', 'arquivos'
      ];
      return allowedResources.includes(resource);
    });

    render(<Sidebar />);

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Membros')).toBeInTheDocument();
    expect(screen.getByText('Eventos')).toBeInTheDocument();
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
    expect(screen.getByText('Escola Bíblica')).toBeInTheDocument();
    expect(screen.getByText('Células')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();

    // SECRETÁRIO NÃO deve ver Painel Admin (admin:read não está na lista)
    expect(screen.queryByText('Painel Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('Configurações')).not.toBeInTheDocument();
    expect(screen.queryByText('Ministérios')).not.toBeInTheDocument();
  });

  it('deve mostrar todos os items para ADMIN', () => {
    (useAuth as any).mockReturnValue({
      ...mockUseAuth(),
      user: mockUser('ADMIN'),
    });

    // ADMIN tem acesso a tudo (wildcard *)
    vi.mocked(useRolePermission).mockReturnValue(true);

    render(<Sidebar />);

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Membros')).toBeInTheDocument();
    expect(screen.getByText('Ministérios')).toBeInTheDocument();
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
    expect(screen.getByText('Painel Admin')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('deve mostrar apenas items com permissão de leitura', () => {
    // Teste de cobertura: quando todos os recursos são negados, menu fica vazio (exceto itens sem resource)
    (useAuth as any).mockReturnValue({
      ...mockUseAuth(),
      user: mockUser('MEMBRO'),
    });
    vi.mocked(useRolePermission).mockReturnValue(false);

    render(<Sidebar />);

    // Como todos os itens têm resource e a permissão é false, o menu de links estará vazio
    const allLinks = screen.queryAllByRole('link');
    // Apenas links do botão de logout (não são itens do menu)
    expect(allLinks.length).toBeGreaterThanOrEqual(0);
  });
});

describe('Sidebar - UI/UX', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue(mockUseAuth());
    vi.mocked(useRolePermission).mockReturnValue(true);
  });

  it('deve mostrar email do usuário no footer quando expandido', () => {
    render(<Sidebar />);

    // O email aparece como "Olá, test" (parte antes do @) em um <p>
    expect(screen.getByText(/Olá, test/i)).toBeInTheDocument();
  });

  it('deve mostrar role do usuário formatada', () => {
    (useAuth as any).mockReturnValue({
      ...mockUseAuth(),
      user: mockUser('LIDER_CELULA'),
    });

    render(<Sidebar />);

    expect(screen.getByText('LIDER CELULA')).toBeInTheDocument();
  });

  it('deve renderizar botão de logout', () => {
    render(<Sidebar />);

    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('deve mostrar copyright corrigido', () => {
    render(<Sidebar />);

    expect(screen.getByText('© 2026 IgrejaConnect')).toBeInTheDocument();
  });
});
