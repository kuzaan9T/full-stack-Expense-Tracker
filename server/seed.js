import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Budget from './models/Budget.js';
import Transaction from './models/Transaction.js';
import User from './models/User.js';
import { currentMonth, shiftMonth } from './utils/month.js';

const DEMO_USER = { name: 'Demo User', email: 'demo@example.com', password: 'demo1234' };

const SAMPLE_TRANSACTIONS = [
  { monthOffset: -1, day: 1, type: 'income', category: 'Salary', amount: 1900, note: 'Monthly salary' },
  { monthOffset: -1, day: 2, type: 'expense', category: 'Housing', amount: 650, note: 'Rent' },
  { monthOffset: -1, day: 14, type: 'expense', category: 'Food', amount: 84.2, note: 'Groceries' },
  { monthOffset: 0, day: 1, type: 'income', category: 'Salary', amount: 1900, note: 'Monthly salary' },
  { monthOffset: 0, day: 2, type: 'expense', category: 'Housing', amount: 650, note: 'Rent' },
  { monthOffset: 0, day: 4, type: 'expense', category: 'Food', amount: 62.5, note: 'Groceries' },
  { monthOffset: 0, day: 6, type: 'expense', category: 'Transport', amount: 35, note: 'Fuel' },
];

const SAMPLE_BUDGETS = { Food: 250, Transport: 80 };

const dateIn = (month, day) => {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(Date.UTC(year, monthNumber - 1, day));
};

const buildTransactions = (userId) => {
  const thisMonth = currentMonth();
  const today = new Date().getUTCDate();

  return SAMPLE_TRANSACTIONS.map(({ monthOffset, day, ...transaction }) => ({
    ...transaction,
    user: userId,
    date: dateIn(shiftMonth(thisMonth, monthOffset), monthOffset === 0 ? Math.min(day, today) : day),
  }));
};

const seed = async () => {
  await connectDB();

  let user = await User.findOne({ email: DEMO_USER.email });
  if (user) {
    user.name = DEMO_USER.name;
    user.password = DEMO_USER.password;
    await user.save();
    await Promise.all([Transaction.deleteMany({ user: user._id }), Budget.deleteMany({ user: user._id })]);
  } else {
    user = await User.create(DEMO_USER);
  }

  const transactions = await Transaction.insertMany(buildTransactions(user._id));
  const month = currentMonth();
  const budgets = await Budget.insertMany(
    Object.entries(SAMPLE_BUDGETS).map(([category, limit]) => ({ user: user._id, category, month, limit }))
  );

  console.log(`Seeded ${transactions.length} transactions and ${budgets.length} budgets`);
  console.log(`Log in with ${DEMO_USER.email} / ${DEMO_USER.password}`);
};

seed()
  .catch((error) => {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
