import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '@/lib/queryClient';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => {
        queryClient.clear();
        set({ user: null, token: null });
      },
    }),
    { name: 'expense-tracker-auth' }
  )
);
