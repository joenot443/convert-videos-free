import { Metadata } from 'next';
import { ConverterContainer } from '@/components/converter/ConverterContainer';
import { getDictionary, Locale } from '@/lib/i18n';
import { homeMetadata } from '@/lib/site/metadata';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return homeMetadata(lang as Locale);
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  return <ConverterContainer lang={lang as Locale} dictionary={getDictionary(lang as Locale)} />;
}
