import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/store/auth';

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function GuestRoute() {
  const token = useAuthStore((state) => state.token);
  if (token) return <Navigate to="/" replace />;
  return <Outlet />;
}
