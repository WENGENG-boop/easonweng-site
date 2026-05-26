'use client';

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const DEFAULT_THEME: Theme = 'dark';
const THEME_STORAGE_KEY = 'theme';
const THEME_CHANGE_EVENT = 'themechange';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME;
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(savedTheme) ? savedTheme : DEFAULT_THEME;
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function setStoredTheme(nextTheme: Theme) {
  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getStoredTheme,
    () => DEFAULT_THEME
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');

    if (!isTheme(window.localStorage.getItem(THEME_STORAGE_KEY))) {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setStoredTheme(nextTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
