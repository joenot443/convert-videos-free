import { Metadata } from 'next';
import { ConverterContainer } from '@/components/converter/ConverterContainer';
import { TestModeProvider } from '@/components/providers/TestModeProvider';
import { Locale, locales, getDictionary, defaultLocale } from '@/lib/i18n';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = (locales.includes(langParam as Locale) ? langParam : defaultLocale) as Locale;
  const dict = getDictionary(lang);
  const baseUrl = 'https://convertvideosfree.com';
  const path = lang === defaultLocale ? '' : `/${lang}`;

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        'en': baseUrl,
        'es': `${baseUrl}/es`,
        'pt': `${baseUrl}/pt`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`,
        'ja': `${baseUrl}/ja`,
        'x-default': baseUrl,
      },
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: `${baseUrl}${path}`,
      siteName: 'Convert Videos Free',
      type: 'website',
      locale: lang,
    },
  };
}

export default async function Home({ params }: Props) {
  const { lang: langParam } = await params;
  const lang = (locales.includes(langParam as Locale) ? langParam : defaultLocale) as Locale;
  const dict = getDictionary(lang);

  return (
    <TestModeProvider>
      <ConverterContainer lang={lang} dictionary={dict} />
    </TestModeProvider>
  );
}
