import { FAQPageClient } from "./FAQPageClient";

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;

  return <FAQPageClient locale={locale} />;
}

