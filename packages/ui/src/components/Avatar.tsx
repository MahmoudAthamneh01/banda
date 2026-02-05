import * as React from 'react';
import { cn } from '../utils/cn';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function Avatar({ className, src, alt, fallback, size = 'md', ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full bg-ink-800 overflow-hidden',
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-medium text-slate-300">
          {fallback || alt?.charAt(0).toUpperCase() || '?'}
        </span>
      )}
    </div>
  );
}

export { Avatar };
export type { AvatarProps };
