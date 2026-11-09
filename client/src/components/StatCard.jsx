import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function StatCard({ label, value, caption, icon: Icon, iconClassName, isLoading }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn('grid size-8 place-items-center rounded-lg', iconClassName)}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      {isLoading ? (
        <Skeleton className="mt-3 h-8 w-32" />
      ) : (
        <p className="tabular mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
      )}
      {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
    </Card>
  );
}
