import { cn } from '@/lib/utils';

export const fieldClassName =
  'h-9 w-full min-w-0 rounded-md border border-input bg-card px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive';

export function Input({ className, ...props }) {
  return <input className={cn(fieldClassName, className)} {...props} />;
}
