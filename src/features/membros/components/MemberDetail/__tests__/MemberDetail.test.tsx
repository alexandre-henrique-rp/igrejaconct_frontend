import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemberDetail } from './MemberDetail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const server = setupServer(
  rest.get('/api/membros/123', (req, res, ctx) => {
    res(
      ctx.json({
        id: '123',
        nome: 'João Silva',
        data_nascimento: '1990-05-15',
        sexo: 'M',
        estado_civil: 'casado',
        profissao: 'Engenheiro',
        telefone: '(11) 98765-4321',
        email: 'joao@igreja.com',
        endereco: 'Rua das Flores, 123',
        cep: '01234-567',
        tipo: 'ativo',
        celula: { id: 'c1', nome: 'Célula Centro' },
        ministerios: ['ministro', 'louvor'],
        discipulador: { id: 'm2', nome: 'Pastor Carlos' },
        observacoes: 'Membro ativo',
      })
    );
  }),
  rest.get('/api/membros/123/historico', (req, res, ctx) => {
    res(
      ctx.json([
        {
          id: 'h1',
          data: '2024-03-01',
          tipo: 'visita',
          descricao: 'Primeira visita',
          responsavel: { nome: 'Pastor Carlos' },
        },
      ])
    );
  }),
  rest.get('/api/membros/123/discipulos', (req, res, ctx) => {
    res(
      ctx.json({
        root: { id: '123', nome: 'João' },
        children: [
          {
            id: 'm4',
            nome: 'Maria',
            children: [{ id: 'm5', nome: 'José' }],
          },
        ],
      })
    );
  })
);

describe('MemberDetail Component', () => {
  beforeEach(() => {
    queryClient.clear();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it('renders all 4 tabs', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberDetail memberId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /pessoal/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /família/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /discipulado/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /histórico/i })).toBeInTheDocument();
    });
  });

  it('displays member personal data correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberDetail memberId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Engenheiro')).toBeInTheDocument();
      expect(screen.getByText('(11) 98765-4321')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberDetail memberId="123" />
      </QueryClientProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles edit button click', async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <MemberDetail memberId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /editar/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays family relationships', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberDetail memberId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      // Click family tab
      userEvent.click(screen.getByRole('tab', { name: /família/i }));
    });

    // Verify family members are shown
    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument();
      expect(screen.getByText('José')).toBeInTheDocument();
    });
  });

  it('shows disciple tree in discipleship tab', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberDetail memberId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      userEvent.click(screen.getByRole('tab', { name: /discipulado/i }));
    });

    // Verify tree nodes rendered
    await waitFor(() => {
      expect(screen.getByText('João')).toBeInTheDocument();
      expect(screen.getByText('Maria')).toBeInTheDocument();
    });
  });

  it('displays history timeline', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemberDetail memberId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      userEvent.click(screen.getByRole('tab', { name: /histórico/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Primeira visita')).toBeInTheDocument();
      expect(screen.getByText('Pastor Carlos')).toBeInTheDocument();
    });
  });
});