import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      primaryColor: '#4f46e5', // Default indigo-600 color
      setPrimaryColor: (color: string) => set({ primaryColor: color }),
    }),
    {
      name: 'raffle-theme-storage',
    }
  )
);
