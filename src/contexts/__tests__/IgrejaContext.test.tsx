import { render, screen } from '@testing-library/react'
import { IgrejaProvider } from '../IgrejaContext'
import { AuthProvider } from '../AuthContext'
import { ThemeProvider } from '../ThemeProvider'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

// Mock matchMedia
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
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

describe('IgrejaContext - Basic Rendering', () => {
  it('should render without throwing an error', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>
        <ThemeProvider>
          <IgrejaProvider>
            {children}
          </IgrejaProvider>
        </ThemeProvider>
      </AuthProvider>
    )

    // This should not throw
    expect(() => {
      render(<Wrapper><span data-testid="igreja-context">Test</span></Wrapper>)
    }).not.toThrow()
    
    // If we get here, the component rendered
    expect(screen.getByTestId('igreja-context')).toBeInTheDocument()
  })
})