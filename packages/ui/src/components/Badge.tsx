import * as React from 'react';
import { cn } from '../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'silk' | 'jade';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-ink-800 text-slate-200 border border-ink-700',
    secondary: 'bg-ink-850 text-slate-300',
    destructive: 'bg-danger-500 text-white',
    outline: 'border border-ink-700 text-slate-200 bg-transparent',
    success: 'bg-success-500 text-white',
    silk: 'bg-silk-500 text-ink-950',
    jade: 'bg-jade-500 text-white',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps };
