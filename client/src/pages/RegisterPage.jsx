import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import AuthLayout from '@/components/AuthLayout';
import { FormError } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { api, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function RegisterPage() {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [localError, setLocalError] = useState(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const register = useMutation({
    mutationFn: (details) => api.post('/auth/register', details).then((response) => response.data),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      navigate('/', { replace: true });
    },
  });

  const updateValue = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError(values.password.length < 6 ? 'Password must be at least 6 characters' : null);
    if (values.password.length >= 6) register.mutate(values);
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Start tracking where your money goes"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <FormError message={localError ?? (register.error && getErrorMessage(register.error))} />
        <Field label="Name" htmlFor="register-name">
          <Input id="register-name" name="name" autoComplete="name" placeholder="Your name" value={values.name} onChange={updateValue} required />
        </Field>
        <Field label="Email" htmlFor="register-email">
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={updateValue}
            required
          />
        </Field>
        <Field label="Password" htmlFor="register-password">
          <Input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={values.password}
            onChange={updateValue}
            required
          />
        </Field>
        <Button type="submit" className="mt-1 w-full" disabled={register.isPending}>
          {register.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}
