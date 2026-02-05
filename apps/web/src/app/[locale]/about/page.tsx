import { AboutPageClient } from "./AboutPageClient";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  return <AboutPageClient locale={locale} />;
}
