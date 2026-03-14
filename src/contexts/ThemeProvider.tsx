import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  resolvedMode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'igreja-connect-theme-mode';

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  const resolved = mode === 'system' ? getSystemPreference() : mode;
  
  const root = document.documentElement;
  
  // Limpar classes anteriores
  root.classList.remove('light', 'dark');
  
  // Adicionar classe do tema atual
  root.classList.add(resolved);
  
  // Atualizar atributo data-theme
  root.setAttribute('data-theme', mode);
  
  // Atualizar color-scheme para CSS
  root.style.colorScheme = resolved;
  
  // Forçar atualização do body também
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(resolved);
  
  // Disparar evento customizado para sincronizar outros componentes
  window.dispatchEvent(new CustomEvent('themechange', { detail: { mode, resolved } }));
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  
  return 'system';
}

/**
 * ThemeProvider - Unificado e completo
 * Suporta: light | dark | system
 * Persistência: localStorage
 * Compatibilidade: shadcn/ui, Tailwind dark mode
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() => {
    const initial = getInitialMode();
    return initial === 'system' ? getSystemPreference() : initial;
  });

  // Apply theme and persist when mode changes
  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  // Listen for system preference changes when in system mode
  useEffect(() => {
    if (mode !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateResolved = () => {
      const systemMode = getSystemPreference();
      setResolvedMode(systemMode);
      // Re-apply to update class
      applyTheme('system');
    };

    // Set initial resolved
    updateResolved();

    media.addEventListener('change', updateResolved);
    return () => media.removeEventListener('change', updateResolved);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode(prev => {
      const next: ThemeMode = prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light';
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode, resolvedMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
