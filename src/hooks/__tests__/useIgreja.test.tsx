import { render, screen } from '@testing-library/react'
import { IgrejaProvider } from '../../contexts/IgrejaContext'
import { AuthProvider } from '../../contexts/AuthContext'
import { ThemeProvider } from '../../contexts/ThemeProvider'
import { useCurrentIgrejaId } from '../../hooks/useIgreja'
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

describe('useIgreja hooks - Simple Test', () => {
  it('should return null when no context (direct test)', () => {
    // Render just a simple component that uses the hook
    const TestComponent = () => {
      const igrejaId = useCurrentIgrejaId()
      return <span data-testid="igreja-id">{igrejaId ?? 'null'}</span>
    }
    
    // Render without providers to test the error case
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useIgreja must be used within an IgrejaProvider')
  })
})