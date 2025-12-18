'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { Locale } from '@/lib/i18n/config';
import { en } from '@/lib/i18n/dictionaries/en';

interface DictionaryContextType {
  dictionary: Dictionary;
  lang: Locale;
}

const DictionaryContext = createContext<DictionaryContextType>({
  dictionary: en,
  lang: 'en',
});

export function DictionaryProvider({
  children,
  dictionary,
  lang,
}: {
  children: ReactNode;
  dictionary: Dictionary;
  lang: Locale;
}) {
  return (
    <DictionaryContext.Provider value={{ dictionary, lang }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}
