import type { Metadata } from 'next';
import { RootDocument } from '@/components/RootDocument';
import { siteMetadata } from '@/lib/site/metadata';

export const metadata: Metadata = siteMetadata;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
