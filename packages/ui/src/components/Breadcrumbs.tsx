import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}

/**
 * Breadcrumbs - Navigation hierarchy component
 * 
 * Displays the current page location in the site hierarchy
 */
export function Breadcrumbs({
  items,
  className = '',
  showHome = true,
  separator,
}: BreadcrumbsProps) {
  const allItems = showHome
    ? [{ label: 'Home', href: '/', icon: Home }, ...items]
    : items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-2 text-sm ${className}`}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-slate-500">
                {separator || <ChevronRight size={16} />}
              </span>
            )}

            {isLast || !item.href ? (
              <span
                className={`flex items-center gap-1.5 ${
                  isLast
                    ? 'text-slate-200 font-medium'
                    : 'text-slate-400'
                }`}
                aria-current={isLast ? 'page' : undefined}
              >
                {Icon && <Icon size={16} />}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 text-slate-400 hover:text-panda-500 transition-colors"
              >
                {Icon && <Icon size={16} />}
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
