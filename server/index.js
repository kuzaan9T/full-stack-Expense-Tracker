import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import authRoutes from './routes/auth.js';
import budgetRoutes from './routes/budgets.js';
import summaryRoutes from './routes/summary.js';
import transactionRoutes from './routes/transactions.js';
import { CATEGORIES } from './utils/categories.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
if (!isProduction) app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/categories', (req, res) => res.json(CATEGORIES));
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api', notFound);

if (isProduction) {
  const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
  app.use(express.static(clientDist));
  app.get(/.*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
