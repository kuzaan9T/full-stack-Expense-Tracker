import { cn } from '@/lib/utils';

export function Label({ className, ...props }) {
  return <label className={cn('text-sm font-medium leading-none', className)} {...props} />;
}

export function Field({ label, htmlFor, children, className }) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
