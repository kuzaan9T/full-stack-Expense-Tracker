import { z } from 'zod';
import { CATEGORIES } from '../utils/categories.js';

export const transactionSchema = z
  .object({
    type: z.enum(['income', 'expense'], { message: 'Type must be income or expense' }),
    amount: z.coerce.number().positive('Amount must be greater than 0').max(1_000_000_000, 'Amount is too large'),
    category: z.string().trim().min(1, 'Category is required'),
    date: z.coerce.date({ message: 'Date must be valid' }),
    note: z.string().trim().max(200, 'Note is too long').optional().default(''),
  })
  .refine((data) => CATEGORIES[data.type].includes(data.category), {
    message: 'Category does not match the transaction type',
    path: ['category'],
  });
