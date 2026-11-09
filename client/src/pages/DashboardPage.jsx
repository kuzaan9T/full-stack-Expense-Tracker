import { ArrowDownLeft, ArrowUpRight, Plus, ReceiptText, Scale } from 'lucide-react';
import { Link } from 'react-router';
import MonthPicker from '@/components/MonthPicker';
import MonthlyTrendChart, { TrendLegend } from '@/components/MonthlyTrendChart';
import PageHeader from '@/components/PageHeader';
import SpendingByCategory from '@/components/SpendingByCategory';
import StatCard from '@/components/StatCard';
import { EmptyState, ErrorState } from '@/components/States';
import TransactionList from '@/components/TransactionList';
import { useTransactionDialogs } from '@/components/useTransactionDialogs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMoney, formatMonth } from '@/lib/format';
import { useSummary, useTransactions } from '@/lib/queries';
import { useCurrency } from '@/lib/useCurrency';
import { useAuthStore } from '@/store/auth';
import { useMonthStore } from '@/store/month';

const RECENT_LIMIT = 5;

export default function DashboardPage() {
  const month = useMonthStore((state) => state.month);
  const firstName = useAuthStore((state) => state.user?.name?.split(' ')[0]);
  const currency = useCurrency();
  const summary = useSummary(month);
  const recent = useTransactions({ month, limit: RECENT_LIMIT });
  const { openCreate, openEdit, dialogs } = useTransactionDialogs();
  const data = summary.data;

  return (
    <>
      <PageHeader title={firstName ? `Hi, ${firstName}` : 'Overview'} description={`Your money in ${formatMonth(month)}`}>
        <MonthPicker />
        <Button onClick={openCreate}>
          <Plus />
          Add transaction
        </Button>
      </PageHeader>

      {summary.isError ? (
        <Card>
          <ErrorState error={summary.error} onRetry={summary.refetch} />
        </Card>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Income"
              icon={ArrowDownLeft}
              iconClassName="bg-income/15 text-income"
              value={formatMoney(data?.income ?? 0, currency)}
              isLoading={summary.isPending}
            />
            <StatCard
              label="Expenses"
              icon={ArrowUpRight}
              iconClassName="bg-expense/15 text-expense"
              value={formatMoney(data?.expense ?? 0, currency)}
              isLoading={summary.isPending}
            />
            <StatCard
              label="Balance"
              icon={Scale}
              iconClassName="bg-muted text-foreground"
              value={formatMoney(data?.balance ?? 0, currency)}
              caption={data && `${data.transactionCount} transaction${data.transactionCount === 1 ? '' : 's'} this month`}
              isLoading={summary.isPending}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader className="flex-row flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle>Last 6 months</CardTitle>
                  <CardDescription>Income compared with expenses</CardDescription>
                </div>
                <TrendLegend />
              </CardHeader>
              <CardContent className="pt-4">
                {summary.isPending ? <Skeleton className="h-64 w-full lg:h-96" /> : <MonthlyTrendChart data={data.lastMonths} currency={currency} />}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Spending by category</CardTitle>
                <CardDescription>Where your money went this month</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                {summary.isPending ? (
                  <div className="grid gap-4">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Skeleton key={index} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <SpendingByCategory categories={data.byCategory} totalExpense={data.expense} currency={currency} />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Recent transactions</CardTitle>
                <CardDescription>Latest activity in {formatMonth(month)}</CardDescription>
              </div>
              <Link to="/transactions" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                View all
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {recent.isPending ? (
                <div className="grid gap-3">
                  {Array.from({ length: 3 }, (_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : recent.isError ? (
                <ErrorState error={recent.error} onRetry={recent.refetch} />
              ) : recent.data.length ? (
                <TransactionList transactions={recent.data} currency={currency} onEdit={openEdit} />
              ) : (
                <EmptyState
                  icon={ReceiptText}
                  title="No transactions this month"
                  description="Add your first income or expense to get started."
                  action={
                    <Button size="sm" onClick={openCreate}>
                      <Plus />
                      Add transaction
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {dialogs}
    </>
  );
}
