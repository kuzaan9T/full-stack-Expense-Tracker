import { useAuthStore } from '@/store/auth';

export const useCurrency = () => useAuthStore((state) => state.user?.currency ?? 'USD');
