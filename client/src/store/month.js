import { create } from 'zustand';
import { currentMonth } from '@/lib/format';

export const useMonthStore = create((set) => ({
  month: currentMonth(),
  setMonth: (month) => set({ month }),
}));
