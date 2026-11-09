import Transaction from '../models/Transaction.js';
import { MONTH_PATTERN, monthRange } from '../utils/month.js';

const buildFilter = (userId, query) => {
  const filter = { user: userId };
  if (MONTH_PATTERN.test(query.month ?? '')) {
    const { start, end } = monthRange(query.month);
    filter.date = { $gte: start, $lt: end };
  }
  if (query.type === 'income' || query.type === 'expense') filter.type = query.type;
  if (typeof query.category === 'string' && query.category) filter.category = query.category;
  return filter;
};

export const listTransactions = async (req, res) => {
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 0, 0), 500);
  const query = Transaction.find(buildFilter(req.user._id, req.query)).sort({ date: -1, createdAt: -1 });
  if (limit) query.limit(limit);
  res.json(await query);
};

export const createTransaction = async (req, res) => {
  const transaction = await Transaction.create({ ...req.body, user: req.user._id });
  res.status(201).json(transaction);
};

export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  res.json(transaction);
};

export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  res.json({ id: transaction._id });
};
