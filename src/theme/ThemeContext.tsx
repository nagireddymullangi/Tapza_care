import React, { createContext, useContext, useMemo } from 'react';
import type { ConfigTheme } from '@/types/domain';
import { type AppTheme, deriveThemeFromConfig } from './tokens';

const DEFAULT_CONFIG_THEME: ConfigTheme = {
  primary: '#0F766E',
  secondary: '#115E59',
  background: '#F4FAF8',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  accent: '#D97706',
};

type ThemeContextValue = {
  theme: AppTheme;
  isDark: boolean;
  toggleDark: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: deriveThemeFromConfig(DEFAULT_CONFIG_THEME, false),
  isDark: false,
  toggleDark: () => {},
});

type ThemeProviderProps = {
  configTheme?: ConfigTheme;
  isDark: boolean;
  onToggleDark: () => void;
  children: React.ReactNode;
};

export function AppThemeProvider({
  configTheme,
  isDark,
  onToggleDark,
  children,
}: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(() => {
    const resolvedConfigTheme = configTheme ?? DEFAULT_CONFIG_THEME;
    return {
      theme: deriveThemeFromConfig(resolvedConfigTheme, isDark),
      isDark,
      toggleDark: onToggleDark,
    };
  }, [configTheme, isDark, onToggleDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): AppTheme {
  return useContext(ThemeContext).theme;
}

export function useThemeControls(): { isDark: boolean; toggleDark: () => void } {
  const { isDark, toggleDark } = useContext(ThemeContext);
  return { isDark, toggleDark };
}
