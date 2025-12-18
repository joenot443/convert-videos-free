'use client';

import { useEffect, useState } from 'react';
import { FileDropZone } from './FileDropZone';
import { SettingsPanel } from './SettingsPanel';
import { FileQueue } from './FileQueue';
import { OutputList } from './OutputList';
import { ConversionService } from '@/lib/conversion/ConversionService';
import { SEOContent } from '@/components/SEOContent';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { DictionaryProvider } from '@/components/providers/DictionaryProvider';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { Locale, defaultLocale } from '@/lib/i18n/config';
import { en } from '@/lib/i18n/dictionaries/en';

interface ConverterContainerProps {
  lang?: Locale;
  dictionary?: Dictionary;
}

export function ConverterContainer({ lang = defaultLocale, dictionary = en }: ConverterContainerProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [supportMessage, setSupportMessage] = useState<string>('');
  const d = dictionary;

  useEffect(() => {
    // Check browser support
    const support = ConversionService.checkSupport();
    setIsSupported(support.supported);
    if (!support.supported && support.message) {
      setSupportMessage(support.message);
    }
  }, []);

  // Get base path for links
  const basePath = lang === defaultLocale ? '' : `/${lang}`;

  if (isSupported === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Checking browser compatibility...</p>
            <p className="text-sm text-gray-500 mt-2">Loading video codecs</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-red-100">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              {d.errors.unsupportedBrowser}
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              {supportMessage || d.errors.unsupportedBrowserMessage}
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {d.errors.supportedBrowsers}
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {d.errors.chrome}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {d.errors.edge}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {d.errors.safari}
                </li>
              </ul>
            </div>
            <a
              href="https://caniuse.com/webcodecs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full mt-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
            >
              {d.errors.learnMore}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DictionaryProvider dictionary={dictionary} lang={lang}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-3 sm:py-6 max-w-6xl">
          {/* Language Switcher */}
          <div className="flex justify-end mb-2">
            <LanguageSwitcher />
          </div>

          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-xl opacity-40 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M8 4h8a1 1 0 011 1v14a1 1 0 01-1 1H8a1 1 0 01-1-1V5a1 1 0 011-1z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
                <span>{d.header.title}</span>
                <span className="relative ml-2">
                  <span className="relative z-10 text-blue-600">{d.header.titleHighlight}</span>
                  <svg className="absolute -bottom-1 left-0 w-full h-3 text-blue-400 opacity-40" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,6 Q25,0 50,6 T100,6" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 font-medium max-w-2xl mx-auto">
              {d.header.subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center mt-3 gap-2">
              <div className="flex items-center text-sm text-gray-700 bg-green-50/70 px-3 py-1.5 rounded-full border border-green-200/50">
                <svg className="w-4 h-4 mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium">{d.badges.privacy}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700 bg-blue-50/70 px-3 py-1.5 rounded-full border border-blue-200/50">
                <svg className="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">{d.badges.webcodecs}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700 bg-purple-50/70 px-3 py-1.5 rounded-full border border-purple-200/50">
                <svg className="w-4 h-4 mr-1.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span className="font-medium">{d.badges.noUploads}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* File Drop Zone */}
            <FileDropZone />

            {/* Settings Panel */}
            <SettingsPanel />

            {/* File Queue */}
            <FileQueue />

            {/* Completed Files */}
            <OutputList />
          </div>

          {/* SEO Content */}
          <SEOContent />

          {/* Footer */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-gray-200/50">
            <div className="flex flex-col items-center space-y-3">
              <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <a href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {d.footer.blog}
                </a>
                <a href={`${basePath}/about`} className="text-gray-600 hover:text-blue-600 transition-colors">
                  {d.footer.about}
                </a>
                <a href={`${basePath}/privacy`} className="text-gray-600 hover:text-blue-600 transition-colors">
                  {d.footer.privacy}
                </a>
                <a href={`${basePath}/terms`} className="text-gray-600 hover:text-blue-600 transition-colors">
                  {d.footer.terms}
                </a>
                <a href="https://joecrozier.ca" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {d.footer.developer}
                </a>
              </nav>

              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
                <div>
                  {d.footer.madeWith} ❤️ {d.footer.by} <a href="https://joecrozier.ca" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Joe Crozier</a>
                </div>
                <div className="hidden sm:block">•</div>
                <div>
                  {d.footer.poweredBy} <span className="font-semibold text-gray-700">WebCodecs API</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                © {new Date().getFullYear()} Convert Videos Free. {d.footer.copyright}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DictionaryProvider>
  );
}
