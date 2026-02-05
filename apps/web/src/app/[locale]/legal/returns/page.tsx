import { ReturnsPageClient } from "./ReturnsPageClient";

interface ReturnsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ReturnsPage({ params }: ReturnsPageProps) {
  const { locale } = await params;

  return <ReturnsPageClient locale={locale} />;
}
