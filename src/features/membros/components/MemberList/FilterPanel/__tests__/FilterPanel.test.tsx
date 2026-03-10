import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FilterPanel } from './FilterPanel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('FilterPanel Component', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('renders all filter controls', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FilterPanel onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/classificação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/célula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ministério/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument();
  });

  it('calls onFilterChange when classification changes', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FilterPanel onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );

    const classificationSelect = screen.getByLabelText(/classificação/i);
    fireEvent.change(classificationSelect, { target: { value: 'visitante' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ tipo: 'visitante' })
      );
    });
  });

  it('combines multiple filters correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FilterPanel onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );

    // Set classification
    const classificationSelect = screen.getByLabelText(/classificação/i);
    fireEvent.change(classificationSelect, { target: { value: 'ativo' } });

    // Set cell (multi-select simulation)
    const cellInput = screen.getByLabelText(/célula/i);
    fireEvent.change(cellInput, { target: { value: 'célula-1' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo: 'ativo',
          celula_id: ['célula-1'],
        })
      );
    });
  });

  it('clear filters button resets all fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FilterPanel onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );

    // Set some filters first
    const classificationSelect = screen.getByLabelText(/classificação/i);
    fireEvent.change(classificationSelect, { target: { value: 'visitante' } });

    // Click clear
    const clearButton = screen.getByRole('button', { name: /limpar filtros/i });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({});
    });

    expect(classificationSelect).toHaveValue('');
  });

  it('filters by date range', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FilterPanel onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );

    const startDateInput = screen.getByLabelText(/data início/i);
    const endDateInput = screen.getByLabelText(/data fim/i);

    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-03-31' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          data_inicio: '2024-01-01',
          data_fim: '2024-03-31',
        })
      );
    });
  });

  it('debounces rapid filter changes', async () => {
    jest.useFakeTimers();
    render(
      <QueryClientProvider client={queryClient}>
        <FilterPanel onFilterChange={mockOnFilterChange} />
      </QueryClientProvider>
    );

    const searchInput = screen.getByLabelText(/buscar/i);

    fireEvent.change(searchInput, { target: { value: 'jo' } });
    fireEvent.change(searchInput, { target: { value: 'joa' } });
    fireEvent.change(searchInput, { target: { value: 'joao' } });

    // Fast changes shouldn't trigger immediately
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Advance timer past debounce (300ms)
    jest.advanceTimersByTime(350);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'joao' })
      );
    });

    jest.useRealTimers();
  });
});