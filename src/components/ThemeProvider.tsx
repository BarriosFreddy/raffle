import { ReactNode, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { ThemeContext } from '../contexts/themeContext';

// Map of color hex values to Tailwind color classes
const colorClassMap: Record<string, string> = {
  '#4f46e5': 'indigo', // indigo-600 (default)
  '#2563eb': 'blue',   // blue-600
  '#9333ea': 'purple', // purple-600
  '#e11d48': 'rose',   // rose-600
  '#16a34a': 'green',  // green-600
  '#ea580c': 'orange', // orange-600
  '#0891b2': 'cyan',   // cyan-600
  '#4338ca': 'indigo', // indigo-700
  '#1e40af': 'blue',   // blue-800
  '#7e22ce': 'purple'  // purple-700
};

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { primaryColor } = useThemeStore();
  
  // Get the closest Tailwind color class or default to indigo
  const primaryColorClass = colorClassMap[primaryColor] || 'indigo';
  
  // Inject CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
  }, [primaryColor]);
  
  return (
    <ThemeContext.Provider value={{ primaryColor, primaryColorClass }}>
      {children}
    </ThemeContext.Provider>
  );
}
