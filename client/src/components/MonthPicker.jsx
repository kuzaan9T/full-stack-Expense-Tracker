import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { currentMonth, formatMonth, shiftMonth } from '@/lib/format';
import { useMonthStore } from '@/store/month';

export default function MonthPicker() {
  const month = useMonthStore((state) => state.month);
  const setMonth = useMonthStore((state) => state.setMonth);
  const isCurrentMonth = month === currentMonth();

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-card p-1 shadow-xs">
      <Button variant="ghost" size="icon-sm" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Previous month">
        <ChevronLeft />
      </Button>
      <span className="min-w-32 text-center text-sm font-medium" aria-live="polite">
        {formatMonth(month)}
      </span>
      <Button variant="ghost" size="icon-sm" onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Next month">
        <ChevronRight />
      </Button>
      {!isCurrentMonth && (
        <Button variant="ghost" size="sm" onClick={() => setMonth(currentMonth())}>
          Today
        </Button>
      )}
    </div>
  );
}
