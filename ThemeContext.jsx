import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { STORAGE_KEYS } from '../utils/constants';
import { useLanguage } from './LanguageContext';

const ThemeModeContext = createContext(null);

function buildTheme(mode, isRTL) {
  const isDark = mode === 'dark';
  return createTheme({
    direction: isRTL ? 'rtl' : 'ltr',
    palette: {
      mode,
      background: {
        default: isDark ? '#0e1116' : '#f6f5f1',
        paper: isDark ? '#171b21' : '#ffffff',
      },
      primary: {
        main: '#e2933a',
        dark: '#c97a22',
        contrastText: '#14171c',
      },
      secondary: {
        main: '#1f6f5c',
      },
      error: { main: '#d15a4a' },
      text: {
        primary: isDark ? '#f2f1ec' : '#14171c',
        secondary: isDark ? '#9aa1ac' : '#6b7280',
      },
      divider: isDark ? '#2a303a' : '#eceef1',
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: isRTL
        ? "'Cairo', 'Manrope', sans-serif"
        : "'Manrope', 'Segoe UI', sans-serif",
      h1: { fontFamily: "'Fraunces', serif" },
      h2: { fontFamily: "'Fraunces', serif" },
      h3: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
      h4: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
    },
  });
}

export function ThemeModeProvider({ children }) {
  const { isRTL } = useLanguage();
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(() => buildTheme(mode, isRTL), [mode, isRTL]);

  const value = useMemo(() => ({ mode, setMode, toggleMode, isDark: mode === 'dark' }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
