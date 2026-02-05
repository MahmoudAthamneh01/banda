import * as React from 'react';
import { cn } from '../utils/cn';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-panda-500 border-t-transparent',
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export { Spinner };
export type { SpinnerProps };
