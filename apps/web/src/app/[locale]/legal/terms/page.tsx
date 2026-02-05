import { TermsPageClient } from "./TermsPageClient";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;

  return <TermsPageClient locale={locale} />;
}
