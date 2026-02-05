'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';

type Locale = 'ar' | 'en' | 'zh';
type Namespace = 'common' | 'square' | 'cockpit' | 'vault' | 'throne';

interface Dictionary {
  [key: string]: string;
}

type Dictionaries = {
  [K in Namespace]: Dictionary;
};

interface I18nContextValue {
  locale: Locale;
  dictionaries: Dictionaries;
  t: (namespace: Namespace, key: string, fallback?: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  locale: Locale;
  dictionaries: Dictionaries;
  children: ReactNode;
}

/**
 * Client-side i18n Provider
 * Wrap your client components with this provider
 */
export function I18nProvider({ locale, dictionaries, children }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(() => {
    const t = (namespace: Namespace, key: string, fallback?: string): string => {
      const translation = dictionaries[namespace]?.[key];
      if (!translation) {
        console.warn(`[i18n] Missing translation: ${namespace}.${key}`);
        return fallback || key;
      }
      return translation;
    };

    return {
      locale,
      dictionaries,
      t,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
    };
  }, [locale, dictionaries]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Client-side translation hook
 * Usage in Client Components:
 * 
 * ```tsx
 * 'use client';
 * import { useI18n } from '@/i18n/i18n.client';
 * 
 * export default function MyComponent() {
 *   const { t, locale, dir } = useI18n();
 *   return <button>{t('common', 'login')}</button>;
 * }
 * ```
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

/**
 * Format number according to locale
 */
export function useNumber() {
  const { locale } = useI18n();

  return {
    format: (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, options).format(value);
    },
    formatCurrency: (value: number, currency = 'CNY') => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(value);
    },
  };
}

/**
 * Format date according to locale
 */
export function useDate() {
  const { locale } = useI18n();

  return {
    format: (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, options).format(date);
    },
    formatRelative: (date: Date) => {
      const now = Date.now();
      const diff = date.getTime() - now;
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (Math.abs(days) > 0) return rtf.format(days, 'day');
      if (Math.abs(hours) > 0) return rtf.format(hours, 'hour');
      if (Math.abs(minutes) > 0) return rtf.format(minutes, 'minute');
      return rtf.format(seconds, 'second');
    },
  };
}
