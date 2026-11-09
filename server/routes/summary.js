import { Router } from 'express';
import { getSummary } from '../controllers/summary.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.get('/', protect, getSummary);

export default router;
