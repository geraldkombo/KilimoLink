import React, { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface UIContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#064e3b', // Deep emerald
          },
          secondary: {
            main: '#f59e0b', // Amber
          },
          background: {
            default: mode === 'light' ? '#fcfcfc' : '#111827',
            paper: mode === 'light' ? '#ffffff' : '#1f2937',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", sans-serif',
          h1: { fontWeight: 900 },
          h2: { fontWeight: 900 },
          h3: { fontWeight: 800 },
          button: { textTransform: 'none', fontWeight: 700 },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <UIContext.Provider value={{ mode, toggleMode, isSidebarOpen, setSidebarOpen }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
