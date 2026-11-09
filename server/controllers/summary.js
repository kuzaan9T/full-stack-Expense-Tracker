import Transaction from '../models/Transaction.js';
import { monthRange, resolveMonth, roundMoney, shiftMonth } from '../utils/month.js';

const TREND_LENGTH = 6;

export const getSummary = async (req, res) => {
  const userId = req.user._id;
  const month = resolveMonth(req.query.month);
  const { start, end } = monthRange(month);
  const trendStart = monthRange(shiftMonth(month, -(TREND_LENGTH - 1))).start;

  const [totals, byCategory, trend] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: userId, date: { $gte: start, $lt: end } } },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Transaction.aggregate([
      { $match: { user: userId, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Transaction.aggregate([
      { $match: { user: userId, date: { $gte: trendStart, $lt: end } } },
      {
        $group: {
          _id: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
    ]),
  ]);

  const totalFor = (type) => totals.find((entry) => entry._id === type);
  const income = roundMoney(totalFor('income')?.total ?? 0);
  const expense = roundMoney(totalFor('expense')?.total ?? 0);
  const trendTotal = (trendMonth, type) =>
    roundMoney(trend.find((entry) => entry._id.month === trendMonth && entry._id.type === type)?.total ?? 0);

  res.json({
    month,
    income,
    expense,
    balance: roundMoney(income - expense),
    transactionCount: (totalFor('income')?.count ?? 0) + (totalFor('expense')?.count ?? 0),
    byCategory: byCategory.map((entry) => ({ category: entry._id, total: roundMoney(entry.total) })),
    lastMonths: Array.from({ length: TREND_LENGTH }, (_, index) => {
      const trendMonth = shiftMonth(month, index - (TREND_LENGTH - 1));
      return { month: trendMonth, income: trendTotal(trendMonth, 'income'), expense: trendTotal(trendMonth, 'expense') };
    }),
  });
};
