import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from '../controllers/transactions.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { transactionSchema } from '../schemas/transaction.js';

const router = Router();

router.use(protect);
router.route('/').get(listTransactions).post(validate(transactionSchema), createTransaction);
router.route('/:id').put(validate(transactionSchema), updateTransaction).delete(deleteTransaction);

export default router;
