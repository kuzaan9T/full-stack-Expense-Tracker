import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { monthRange, resolveMonth, roundMoney } from '../utils/month.js';

export const listBudgets = async (req, res) => {
  const month = resolveMonth(req.query.month);
  const { start, end } = monthRange(month);

  const [budgets, spending] = await Promise.all([
    Budget.find({ user: req.user._id, month }).sort({ category: 1 }).lean(),
    Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]),
  ]);

  const spentByCategory = new Map(spending.map((entry) => [entry._id, entry.spent]));
  res.json(budgets.map((budget) => ({ ...budget, spent: roundMoney(spentByCategory.get(budget.category) ?? 0) })));
};

export const createBudget = async (req, res) => {
  const { category, month, limit } = req.body;
  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category, month },
    { limit },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.status(201).json(budget);
};

export const updateBudget = async (req, res) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  res.json(budget);
};

export const deleteBudget = async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  res.json({ id: budget._id });
};
