import { Pencil, Trash2 } from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function TransactionList({ transactions, currency, onEdit, onDelete }) {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <ul className="divide-y">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === 'income';
        return (
          <li key={transaction._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <CategoryIcon category={transaction.category} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{transaction.note || transaction.category}</p>
              <p className="truncate text-xs text-muted-foreground">
                {transaction.category} · {formatDate(transaction.date)}
              </p>
            </div>
            <div className="text-right">
              <p className={cn('tabular text-sm font-semibold', isIncome && 'text-positive')}>
                {isIncome ? '+' : '−'}
                {formatMoney(transaction.amount, currency)}
              </p>
              <p className="text-xs text-muted-foreground">{isIncome ? 'Income' : 'Expense'}</p>
            </div>
            {hasActions && (
              <div className="flex shrink-0 gap-0.5">
                {onEdit && (
                  <Button variant="ghost" size="icon-sm" onClick={() => onEdit(transaction)} aria-label={`Edit ${transaction.note || transaction.category}`}>
                    <Pencil />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(transaction)}
                    aria-label={`Delete ${transaction.note || transaction.category}`}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
