import { PrivacyPageClient } from "./PrivacyPageClient";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  return <PrivacyPageClient locale={locale} />;
}
