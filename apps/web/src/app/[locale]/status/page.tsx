import { StatusPageClient } from "./StatusPageClient";

interface StatusPageProps {
  params: Promise<{ locale: string }>;
}

export default async function StatusPage({ params }: StatusPageProps) {
  const { locale } = await params;

  return <StatusPageClient locale={locale} />;
}

