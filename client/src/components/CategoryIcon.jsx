import { getCategoryIcon } from '@/lib/categoryIcons';
import { cn } from '@/lib/utils';

export default function CategoryIcon({ category, className }) {
  const Icon = getCategoryIcon(category);
  return (
    <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground', className)}>
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}
