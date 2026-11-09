import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Email must be valid');

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60, 'Name is too long'),
  email,
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});
