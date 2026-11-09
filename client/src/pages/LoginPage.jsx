import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import AuthLayout from '@/components/AuthLayout';
import { FormError } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { api, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

const INITIAL_VALUES = import.meta.env.DEV
  ? { email: 'demo@example.com', password: 'demo1234' }
  : { email: '', password: '' };

export default function LoginPage() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const login = useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials).then((response) => response.data),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      navigate(location.state?.from ?? '/', { replace: true });
    },
  });

  const updateValue = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    login.mutate(values);
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Log in to track your income and spending"
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <FormError message={login.error && getErrorMessage(login.error)} />
        <Field label="Email" htmlFor="login-email">
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={updateValue}
            required
          />
        </Field>
        <Field label="Password" htmlFor="login-password">
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••"
            value={values.password}
            onChange={updateValue}
            required
          />
        </Field>
        <Button type="submit" className="mt-1 w-full" disabled={login.isPending}>
          {login.isPending ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthLayout>
  );
}
