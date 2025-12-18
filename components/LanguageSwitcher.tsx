'use client';

import { useState, useRef, useEffect } from 'react';
import { useDictionary } from '@/components/providers/DictionaryProvider';
import { locales, localeNames, localeFlags, Locale, defaultLocale } from '@/lib/i18n/config';

export function LanguageSwitcher() {
  const { lang } = useDictionary();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLocalePath = (locale: Locale) => {
    if (locale === defaultLocale) {
      return '/';
    }
    return `/${locale}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/80 hover:bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
        aria-label="Select language"
      >
        <span>{localeFlags[lang]}</span>
        <span className="hidden sm:inline text-gray-700">{localeNames[lang]}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          {locales.map((locale) => (
            <a
              key={locale}
              href={getLocalePath(locale)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                locale === lang ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span>{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {locale === lang && (
                <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
