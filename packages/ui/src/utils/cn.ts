/**
 * Utility function for merging class names
 * Simplified version without clsx dependency
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
