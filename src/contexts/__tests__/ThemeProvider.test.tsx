import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeProvider';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Test component that uses the theme hook
function TestComponent() {
  const { mode, setMode, toggleMode, resolvedMode } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="resolved">{resolvedMode}</span>
      <button onClick={() => setMode('light' as any)} data-testid="set-light">Set Light</button>
      <button onClick={() => setMode('dark' as any)} data-testid="set-dark">Set Dark</button>
      <button onClick={() => setMode('system' as any)} data-testid="set-system">Set System</button>
      <button onClick={toggleMode} data-testid="toggle">Toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset document classes
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
  });

  it('should initialize with system mode by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('system');
  });

  it('should initialize with stored mode from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('should apply dark class when mode is dark', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Click set dark button
    await act(async () => {
      screen.getByTestId('set-dark').click();
    });

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('should persist mode to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByTestId('set-light').click();
    });

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('igreja-connect-theme-mode', 'light');
    });
  });

  it('should set data-theme attribute on documentElement', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByTestId('set-dark').click();
    });

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('should toggle between light, dark, system correctly', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initial mode is system
    expect(screen.getByTestId('mode')).toHaveTextContent('system');

    // Toggle: system -> light
    await act(async () => {
      screen.getByTestId('toggle').click();
    });
    expect(screen.getByTestId('mode')).toHaveTextContent('light');

    // Toggle: light -> dark
    await act(async () => {
      screen.getByTestId('toggle').click();
    });
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');

    // Toggle: dark -> system
    await act(async () => {
      screen.getByTestId('toggle').click();
    });
    expect(screen.getByTestId('mode')).toHaveTextContent('system');
  });

  it('should update resolved mode based on system preference', () => {
    // This is tested by the default initialization check
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // With dark system preference, system mode resolves to dark
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });
});
