import type { Metadata } from 'next';
import { ConverterContainer } from '@/components/converter/ConverterContainer';
import { homeJsonLd, homeMetadata } from '@/lib/site/metadata';

export const metadata: Metadata = homeMetadata('en');

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <ConverterContainer />
    </>
  );
}
