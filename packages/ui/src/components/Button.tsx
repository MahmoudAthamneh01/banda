import * as React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-ink-800 text-slate-200 hover:bg-ink-700 border border-ink-700',
      primary: 'bg-panda-500 text-white hover:bg-panda-600',
      outline: 'border border-ink-700 bg-transparent hover:bg-ink-800 text-slate-200',
      ghost: 'hover:bg-ink-800 text-slate-200',
      destructive: 'bg-danger-500 text-white hover:bg-danger-600',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3 text-sm',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-panda-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
