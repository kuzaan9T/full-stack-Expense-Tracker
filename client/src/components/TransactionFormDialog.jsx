import { useState } from 'react';
import { toast } from 'sonner';
import { FormError } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { getErrorMessage } from '@/lib/api';
import { toDateInputValue, todayInputValue } from '@/lib/format';
import { useCategories, useSaveTransaction } from '@/lib/queries';
import { cn } from '@/lib/utils';

const TYPES = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

const initialValues = (transaction, categories) => {
  if (transaction) {
    return {
      type: transaction.type,
      amount: String(transaction.amount),
      category: transaction.category,
      date: toDateInputValue(transaction.date),
      note: transaction.note ?? '',
    };
  }
  return { type: 'expense', amount: '', category: categories?.expense[0] ?? '', date: todayInputValue(), note: '' };
};

function TransactionForm({ transaction, onDone }) {
  const { data: categories } = useCategories();
  const [values, setValues] = useState(() => initialValues(transaction, categories));
  const [error, setError] = useState(null);
  const saveTransaction = useSaveTransaction();
  const categoryOptions = categories?.[values.type] ?? [];
  const selectedCategory = categoryOptions.includes(values.category) ? values.category : categoryOptions[0] ?? '';

  const updateValue = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  const changeType = (type) =>
    setValues((current) => ({
      ...current,
      type,
      category: categories?.[type]?.includes(current.category) ? current.category : categories?.[type]?.[0] ?? '',
    }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const amount = Number(values.amount);
    if (!amount || amount <= 0) {
      setError('Enter an amount greater than 0');
      return;
    }
    saveTransaction.mutate(
      { id: transaction?._id, ...values, category: selectedCategory, amount },
      {
        onSuccess: () => {
          toast.success(transaction ? 'Transaction updated' : 'Transaction added');
          onDone();
        },
        onError: (mutationError) => setError(getErrorMessage(mutationError)),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <FormError message={error} />

      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Transaction type">
        {TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            role="radio"
            aria-checked={values.type === type.value}
            onClick={() => changeType(type.value)}
            className={cn(
              'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              values.type === type.value && 'bg-card text-foreground shadow-xs'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount" htmlFor="transaction-amount">
          <Input
            id="transaction-amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={values.amount}
            onChange={(event) => updateValue('amount', event.target.value)}
            autoFocus
            required
          />
        </Field>
        <Field label="Date" htmlFor="transaction-date">
          <Input
            id="transaction-date"
            type="date"
            value={values.date}
            onChange={(event) => updateValue('date', event.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Category" htmlFor="transaction-category">
        <Select
          id="transaction-category"
          value={selectedCategory}
          onChange={(event) => updateValue('category', event.target.value)}
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Note (optional)" htmlFor="transaction-note">
        <Input
          id="transaction-note"
          maxLength={200}
          placeholder={values.type === 'income' ? 'e.g. Monthly salary' : 'e.g. Groceries'}
          value={values.note}
          onChange={(event) => updateValue('note', event.target.value)}
        />
      </Field>

      <DialogFooter className="pt-1">
        <Button variant="outline" onClick={onDone} disabled={saveTransaction.isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={saveTransaction.isPending || !categories}>
          {saveTransaction.isPending ? 'Saving…' : transaction ? 'Save changes' : 'Add transaction'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function TransactionFormDialog({ open, onOpenChange, transaction }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit transaction' : 'Add transaction'}</DialogTitle>
          <DialogDescription>Record money coming in or going out.</DialogDescription>
        </DialogHeader>
        <TransactionForm transaction={transaction} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
