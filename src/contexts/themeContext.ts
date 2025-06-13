import { createContext, useContext } from 'react';

export type ThemeContextType = {
  primaryColor: string;
  primaryColorClass: string;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
