import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n/ui-copy';

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${normalizeLocale(locale)}/auth/login`);
}
