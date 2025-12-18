import { Locale } from '../config';
import { en, Dictionary } from './en';
import { es } from './es';
import { pt } from './pt';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';

const dictionaries: Record<Locale, Dictionary> = {
  en,
  es,
  pt,
  fr,
  de,
  ja,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}

export type { Dictionary };
