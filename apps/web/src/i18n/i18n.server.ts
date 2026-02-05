import { headers } from 'next/headers';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import i18nConfig from '../i18nConfig';

type Locale = 'ar' | 'en' | 'zh';
type Namespace = 'common' | 'square' | 'cockpit' | 'vault' | 'throne';

interface Dictionary {
  [key: string]: string;
}

type Dictionaries = {
  [K in Namespace]: Dictionary;
};

// Dictionary cache (server-side only)
const dictionaryCache: Map<string, Dictionaries> = new Map();

/**
 * Server-side translation loader
 * Used in Server Components and Server Actions
 */
export async function getDictionaries(locale: Locale): Promise<Dictionaries> {
  // Check cache first
  if (dictionaryCache.has(locale)) {
    return dictionaryCache.get(locale)!;
  }

  // Load all namespaces in parallel
  const [common, square, cockpit, vault, throne] = await Promise.all([
    import(`./resources/${locale}/common.json`).then((m) => m.default),
    import(`./resources/${locale}/square.json`).then((m) => m.default),
    import(`./resources/${locale}/cockpit.json`).then((m) => m.default),
    import(`./resources/${locale}/vault.json`).then((m) => m.default),
    import(`./resources/${locale}/throne.json`).then((m) => m.default),
  ]);

  const dictionaries: Dictionaries = {
    common,
    square,
    cockpit,
    vault,
    throne,
  };

  // Cache for subsequent requests
  dictionaryCache.set(locale, dictionaries);

  return dictionaries;
}

/**
 * Detect user's preferred locale from Accept-Language header
 */
export async function detectLocale(): Promise<Locale> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'en';

  const negotiator = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  });

  const languages = negotiator.languages();
  const locales = i18nConfig.locales;

  try {
    const matched = match(languages, locales, i18nConfig.defaultLocale) as Locale;
    return matched;
  } catch (error) {
    return i18nConfig.defaultLocale as Locale;
  }
}

/**
 * Server-side translation function
 * Usage in Server Components:
 * 
 * ```tsx
 * import { getDictionaries } from '@/i18n/i18n.server';
 * 
 * export default async function Page({ params }: { params: { locale: string } }) {
 *   const dict = await getDictionaries(params.locale as Locale);
 *   return <h1>{dict.common.welcome}</h1>;
 * }
 * ```
 */
export function createServerTranslator(dictionaries: Dictionaries) {
  return function t(namespace: Namespace, key: string, fallback?: string): string {
    const value = dictionaries[namespace]?.[key];
    if (!value) {
      console.warn(`[i18n] Missing translation: ${namespace}.${key}`);
      return fallback || key;
    }
    return value;
  };
}
