import { ChartNoAxesColumn } from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';
import { EmptyState } from '@/components/States';
import { formatMoney, formatPercent } from '@/lib/format';

export default function SpendingByCategory({ categories, totalExpense, currency }) {
  if (!categories.length) {
    return <EmptyState icon={ChartNoAxesColumn} title="No spending yet" description="Expenses for this month will show up here." />;
  }

  const largest = categories[0].total;

  return (
    <ul className="flex flex-col gap-4" aria-label="Spending by category">
      {categories.map(({ category, total }) => (
        <li key={category} className="flex items-center gap-3">
          <CategoryIcon category={category} className="size-8" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-medium">{category}</span>
              <span className="tabular shrink-0">
                {formatMoney(total, currency)}
                <span className="ml-2 inline-block w-9 text-right text-xs text-muted-foreground">
                  {formatPercent(totalExpense ? total / totalExpense : 0)}
                </span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-expense transition-[width] duration-500"
                style={{ width: `${Math.max((total / largest) * 100, 2)}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
