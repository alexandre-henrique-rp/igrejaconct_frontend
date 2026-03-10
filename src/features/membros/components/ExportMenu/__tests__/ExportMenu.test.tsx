import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportMenu } from './ExportMenu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../../../utils/api-client';

// Mock API client
jest.mock('../../../utils/api-client');

const queryClient = new QueryClient();

const mockExportUrl = 'blob:http://localhost:3000/membros-export-123.xlsx';

describe('ExportMenu Component', () => {
  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('renders all export buttons', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ExportMenu members={[]} filters={{}} />
      </QueryClientProvider>
    );

    expect(screen.getByRole('button', { name: /exportar pdf/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /exportar excel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /exportar csv/i })).toBeInTheDocument();
  });

  it('triggers PDF export with correct data', async () => {
    const mockExportPdf = jest.fn().mockResolvedValue({ blob: new Blob() });
    (api.exportPdf as jest.Mock) = mockExportPdf;

    const mockUrl = URL.createObjectURL = jest.fn(() => 'blob:mock-pdf');
    const mockClick = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <ExportMenu members={[{ id: '1', nome: 'João' }]} filters={{ tipo: 'ativo' }} />
      </QueryClientProvider>
    );

    const pdfButton = screen.getByRole('button', { name: /exportar pdf/i });
    fireEvent.click(pdfButton);

    await waitFor(() => {
      expect(mockExportPdf).toHaveBeenCalledWith({
        filters: { tipo: 'ativo' },
        format: 'pdf',
      });
    });
  });

  it('triggers Excel export with correct data', async () => {
    const mockExportExcel = jest.fn().mockResolvedValue({ blob: new Blob() });
    (api.exportExcel as jest.Mock) = mockExportExcel;

    render(
      <QueryClientProvider client={queryClient}>
        <ExportMenu members={[{ id: '1', nome: 'João' }]} filters={{}} />
      </QueryClientProvider>
    );

    const excelButton = screen.getByRole('button', { name: /exportar excel/i });
    fireEvent.click(excelButton);

    await waitFor(() => {
      expect(mockExportExcel).toHaveBeenCalledWith({
        members: [{ id: '1', nome: 'João' }],
        format: 'excel',
      });
    });
  });

  it('shows loading state during export', async () => {
    const mockExport = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    (api.exportExcel as jest.Mock) = mockExport;

    render(
      <QueryClientProvider client={queryClient}>
        <ExportMenu members={[{ id: '1', nome: 'João' }]} filters={{}} />
      </QueryClientProvider>
    );

    const excelButton = screen.getByRole('button', { name: /exportar excel/i });
    fireEvent.click(excelButton);

    expect(screen.getByText(/gerando/i)).toBeInTheDocument();
  });

  it('handles export errors gracefully', async () => {
    const mockExport = jest.fn().mockRejectedValue(new Error('Export failed'));
    (api.exportExcel as jest.Mock) = mockExport;

    render(
      <QueryClientProvider client={queryClient}>
        <ExportMenu members={[{ id: '1', nome: 'João' }]} filters={{}} />
      </QueryClientProvider>
    );

    const excelButton = screen.getByRole('button', { name: /exportar excel/i });
    fireEvent.click(excelButton);

    await waitFor(() => {
      expect(screen.getByText(/falha ao exportar/i)).toBeInTheDocument();
    });
  });

  it('disables buttons while export is in progress', async () => {
    let resolveExport;
    const mockExport = jest.fn(() => new Promise(resolve => { resolveExport = resolve; }));
    (api.exportExcel as jest.Mock) = mockExport;

    render(
      <QueryClientProvider client={queryClient}>
        <ExportMenu members={[{ id: '1', nome: 'João' }]} filters={{}} />
      </QueryClientProvider>
    );

    const excelButton = screen.getByRole('button', { name: /exportar excel/i });
    fireEvent.click(excelButton);

    expect(excelButton).toBeDisabled();

    // Resolve after async
    resolveExport({ blob: new Blob() });

    await waitFor(() => {
      expect(excelButton).not.toBeDisabled();
    });
  });
});