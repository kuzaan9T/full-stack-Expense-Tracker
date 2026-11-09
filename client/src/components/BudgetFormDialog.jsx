import { useState } from 'react';
import { toast } from 'sonner';
import { FormError } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { getErrorMessage } from '@/lib/api';
import { formatMonth } from '@/lib/format';
import { useCategories, useSaveBudget } from '@/lib/queries';

function BudgetForm({ budget, month, usedCategories, onDone }) {
  const { data: categories } = useCategories();
  const saveBudget = useSaveBudget();
  const available = (categories?.expense ?? []).filter(
    (category) => category === budget?.category || !usedCategories.includes(category)
  );
  const [category, setCategory] = useState(budget?.category ?? '');
  const [limit, setLimit] = useState(budget ? String(budget.limit) : '');
  const [error, setError] = useState(null);
  const selectedCategory = available.includes(category) ? category : available[0] ?? '';

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const amount = Number(limit);
    if (!amount || amount <= 0) {
      setError('Enter a limit greater than 0');
      return;
    }
    saveBudget.mutate(
      { id: budget?._id, category: selectedCategory, month: budget?.month ?? month, limit: amount },
      {
        onSuccess: () => {
          toast.success(budget ? 'Budget updated' : 'Budget added');
          onDone();
        },
        onError: (mutationError) => setError(getErrorMessage(mutationError)),
      }
    );
  };

  if (categories && !available.length) {
    return (
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">Every expense category already has a budget this month.</p>
        <DialogFooter>
          <Button onClick={onDone}>Got it</Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <FormError message={error} />
      <Field label="Category" htmlFor="budget-category">
        <Select id="budget-category" value={selectedCategory} onChange={(event) => setCategory(event.target.value)}>
          {available.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Monthly limit" htmlFor="budget-limit">
        <Input
          id="budget-limit"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={limit}
          onChange={(event) => setLimit(event.target.value)}
          autoFocus
          required
        />
      </Field>
      <DialogFooter className="pt-1">
        <Button variant="outline" onClick={onDone} disabled={saveBudget.isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={saveBudget.isPending || !categories}>
          {saveBudget.isPending ? 'Saving…' : budget ? 'Save changes' : 'Add budget'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function BudgetFormDialog({ open, onOpenChange, budget, month, usedCategories }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit budget' : 'Add budget'}</DialogTitle>
          <DialogDescription>Set a spending limit for {formatMonth(budget?.month ?? month)}.</DialogDescription>
        </DialogHeader>
        <BudgetForm budget={budget} month={month} usedCategories={usedCategories} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
