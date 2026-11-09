import { Plus, ReceiptText } from 'lucide-react';
import { useState } from 'react';
import MonthPicker from '@/components/MonthPicker';
import PageHeader from '@/components/PageHeader';
import { EmptyState, ErrorState } from '@/components/States';
import TransactionList from '@/components/TransactionList';
import { useTransactionDialogs } from '@/components/useTransactionDialogs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMoney, formatMonth } from '@/lib/format';
import { useCategories, useTransactions } from '@/lib/queries';
import { useCurrency } from '@/lib/useCurrency';
import { useMonthStore } from '@/store/month';

export default function TransactionsPage() {
  const month = useMonthStore((state) => state.month);
  const currency = useCurrency();
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const { data: categories } = useCategories();
  const transactions = useTransactions({ month, type, category });
  const { openCreate, openEdit, openDelete, dialogs } = useTransactionDialogs();

  const categoryOptions = categories
    ? type === 'all'
      ? [...new Set([...categories.expense, ...categories.income])]
      : categories[type]
    : [];

  const changeType = (nextType) => {
    setType(nextType);
    if (categories && nextType !== 'all' && !categories[nextType].includes(category)) setCategory('all');
  };

  const list = transactions.data ?? [];
  const totals = list.reduce(
    (sum, transaction) => ({ ...sum, [transaction.type]: sum[transaction.type] + transaction.amount }),
    { income: 0, expense: 0 }
  );
  const isFiltered = type !== 'all' || category !== 'all';

  return (
    <>
      <PageHeader title="Transactions" description={`Everything you earned and spent in ${formatMonth(month)}`}>
        <MonthPicker />
        <Button onClick={openCreate}>
          <Plus />
          Add transaction
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select value={type} onChange={(event) => changeType(event.target.value)} aria-label="Filter by type" className="sm:w-40">
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </Select>
            <Select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category" className="sm:w-44">
              <option value="all">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
          {transactions.data && (
            <p className="tabular text-sm text-muted-foreground">
              {list.length} result{list.length === 1 ? '' : 's'} · In {formatMoney(totals.income, currency)} · Out{' '}
              {formatMoney(totals.expense, currency)}
            </p>
          )}
        </div>

        <CardContent>
          {transactions.isPending ? (
            <div className="grid gap-3">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : transactions.isError ? (
            <ErrorState error={transactions.error} onRetry={transactions.refetch} />
          ) : list.length ? (
            <TransactionList transactions={list} currency={currency} onEdit={openEdit} onDelete={openDelete} />
          ) : (
            <EmptyState
              icon={ReceiptText}
              title={isFiltered ? 'No matching transactions' : 'No transactions this month'}
              description={isFiltered ? 'Try a different type or category.' : 'Add income or an expense to see it here.'}
              action={
                isFiltered ? (
                  <Button variant="outline" size="sm" onClick={() => { setType('all'); setCategory('all'); }}>
                    Clear filters
                  </Button>
                ) : (
                  <Button size="sm" onClick={openCreate}>
                    <Plus />
                    Add transaction
                  </Button>
                )
              }
            />
          )}
        </CardContent>
      </Card>

      {dialogs}
    </>
  );
}
