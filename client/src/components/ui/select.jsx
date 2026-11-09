import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fieldClassName } from './input';

export function Select({ className, children, ...props }) {
  return (
    <div className={cn('relative', className)}>
      <select className={cn(fieldClassName, 'cursor-pointer appearance-none pr-9')} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
