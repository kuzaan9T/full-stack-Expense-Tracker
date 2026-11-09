import { CircleAlert, CircleCheck, Pencil, Trash2, TriangleAlert } from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatMoney, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

const WARNING_RATIO = 0.8;

const getStatus = (ratio) => {
  if (ratio > 1) return { label: 'Over budget', icon: CircleAlert, bar: 'bg-critical', text: 'text-critical' };
  if (ratio >= WARNING_RATIO) return { label: 'Almost at limit', icon: TriangleAlert, bar: 'bg-warning', text: 'text-foreground' };
  return { label: 'On track', icon: CircleCheck, bar: 'bg-primary', text: 'text-muted-foreground' };
};

export default function BudgetCard({ budget, currency, onEdit, onDelete }) {
  const ratio = budget.spent / budget.limit;
  const remaining = budget.limit - budget.spent;
  const status = getStatus(ratio);
  const StatusIcon = status.icon;

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3">
        <CategoryIcon category={budget.category} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{budget.category}</p>
          <p className={cn('flex items-center gap-1 text-xs', status.text)}>
            <StatusIcon className={cn('size-3.5', ratio >= WARNING_RATIO && ratio <= 1 && 'text-warning')} aria-hidden="true" />
            {status.label}
          </p>
        </div>
        <div className="flex gap-0.5">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(budget)} aria-label={`Edit ${budget.category} budget`}>
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(budget)}
            aria-label={`Delete ${budget.category} budget`}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="tabular">
            <span className="text-lg font-semibold">{formatMoney(budget.spent, currency)}</span>
            <span className="text-muted-foreground"> of {formatMoney(budget.limit, currency)}</span>
          </span>
          <span className="tabular text-xs text-muted-foreground">{formatPercent(ratio)}</span>
        </div>
        <div
          className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(Math.min(ratio, 1) * 100)}
          aria-label={`${budget.category} budget used`}
        >
          <div className={cn('h-full rounded-full transition-[width] duration-500', status.bar)} style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
        </div>
        <p className={cn('tabular mt-2 text-xs', remaining < 0 ? 'font-medium text-critical' : 'text-muted-foreground')}>
          {remaining < 0
            ? `${formatMoney(Math.abs(remaining), currency)} over the limit`
            : `${formatMoney(remaining, currency)} left to spend`}
        </p>
      </div>
    </Card>
  );
}
