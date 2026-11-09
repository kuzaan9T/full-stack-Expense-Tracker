import { z } from 'zod';
import { CATEGORIES } from '../utils/categories.js';
import { MONTH_PATTERN } from '../utils/month.js';

export const budgetSchema = z.object({
  category: z.enum(CATEGORIES.expense, { message: 'Choose an expense category' }),
  month: z.string().regex(MONTH_PATTERN, 'Month must be in YYYY-MM format'),
  limit: z.coerce.number().positive('Limit must be greater than 0').max(1_000_000_000, 'Limit is too large'),
});
