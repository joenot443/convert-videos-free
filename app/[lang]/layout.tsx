import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RootDocument } from '@/components/RootDocument';
import { defaultLocale, Locale, locales } from '@/lib/i18n';
import { siteMetadata } from '@/lib/site/metadata';

export const metadata: Metadata = siteMetadata;

// Only the listed languages exist. Anything else, such as /wp-login.php, is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.filter((lang) => lang !== defaultLocale).map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();
  return <RootDocument lang={lang}>{children}</RootDocument>;
}
