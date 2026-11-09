import { PiggyBank, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import BudgetCard from '@/components/BudgetCard';
import BudgetFormDialog from '@/components/BudgetFormDialog';
import ConfirmDialog from '@/components/ConfirmDialog';
import MonthPicker from '@/components/MonthPicker';
import PageHeader from '@/components/PageHeader';
import { EmptyState, ErrorState } from '@/components/States';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getErrorMessage } from '@/lib/api';
import { formatMoney, formatMonth } from '@/lib/format';
import { useBudgets, useDeleteBudget } from '@/lib/queries';
import { useCurrency } from '@/lib/useCurrency';
import { useMonthStore } from '@/store/month';

export default function BudgetsPage() {
  const month = useMonthStore((state) => state.month);
  const currency = useCurrency();
  const budgets = useBudgets(month);
  const deleteBudget = useDeleteBudget();
  const [formState, setFormState] = useState({ open: false, budget: null });
  const [pendingDelete, setPendingDelete] = useState(null);

  const list = budgets.data ?? [];
  const totalLimit = list.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = list.reduce((sum, budget) => sum + budget.spent, 0);
  const overCount = list.filter((budget) => budget.spent > budget.limit).length;

  const openCreate = () => setFormState({ open: true, budget: null });

  const confirmDelete = () =>
    deleteBudget.mutate(pendingDelete._id, {
      onSuccess: () => {
        toast.success('Budget deleted');
        setPendingDelete(null);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  return (
    <>
      <PageHeader title="Budgets" description={`Spending limits for ${formatMonth(month)}`}>
        <MonthPicker />
        <Button onClick={openCreate}>
          <Plus />
          Add budget
        </Button>
      </PageHeader>

      {budgets.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : budgets.isError ? (
        <Card>
          <ErrorState error={budgets.error} onRetry={budgets.refetch} />
        </Card>
      ) : list.length ? (
        <>
          <p className="tabular mb-4 text-sm text-muted-foreground">
            {formatMoney(totalSpent, currency)} spent of {formatMoney(totalLimit, currency)} budgeted
            {overCount > 0 && (
              <span className="font-medium text-critical">
                {' '}
                · {overCount} over budget
              </span>
            )}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                currency={currency}
                onEdit={(selected) => setFormState({ open: true, budget: selected })}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        </>
      ) : (
        <Card>
          <EmptyState
            icon={PiggyBank}
            title="No budgets for this month"
            description="Set a limit for a category and see how much is left as you spend."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus />
                Add budget
              </Button>
            }
          />
        </Card>
      )}

      <BudgetFormDialog
        open={formState.open}
        budget={formState.budget}
        month={month}
        usedCategories={list.map((budget) => budget.category)}
        onOpenChange={(open) => setFormState((current) => ({ ...current, open }))}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this budget?"
        description={pendingDelete ? `The ${pendingDelete.category} budget for ${formatMonth(pendingDelete.month)} will be removed.` : undefined}
        isPending={deleteBudget.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
