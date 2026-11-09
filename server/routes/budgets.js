import { Router } from 'express';
import { createBudget, deleteBudget, listBudgets, updateBudget } from '../controllers/budgets.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { budgetSchema } from '../schemas/budget.js';

const router = Router();

router.use(protect);
router.route('/').get(listBudgets).post(validate(budgetSchema), createBudget);
router.route('/:id').put(validate(budgetSchema), updateBudget).delete(deleteBudget);

export default router;
