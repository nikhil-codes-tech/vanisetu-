/**
 * PALASH Supported Curriculum Languages.
 * Stage 2.12 - Multilingual Curriculum Data Architecture.
 *
 * Supported languages:
 * 1. Hindi (hi)
 * 2. Ho (ho)
 * 3. Mundari (mun)
 * 4. Santhali (sat)
 */

export interface LanguageItem {
  code: string;
  name: string;
  native_name: string;
  script: string;
  is_active: boolean;
  direction?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageItem[] = [
  {
    code: 'hi',
    name: 'Hindi',
    native_name: 'हिन्दी',
    script: 'Devanagari',
    is_active: true,
    direction: 'ltr',
  },
  {
    code: 'ho',
    name: 'Ho',
    native_name: 'Warang Chiti / Ho',
    script: 'Warang Chiti / Devanagari',
    is_active: true,
    direction: 'ltr',
  },
  {
    code: 'mun',
    name: 'Mundari',
    native_name: 'Mundari Bani / Mundari',
    script: 'Mundari Bani / Devanagari',
    is_active: true,
    direction: 'ltr',
  },
  {
    code: 'sat',
    name: 'Santhali',
    native_name: 'Ol Chiki / Santhali',
    script: 'Ol Chiki',
    is_active: true,
    direction: 'ltr',
  },
];

export const DEFAULT_CURRICULUM_LANGUAGE = 'hi';

export function getLanguageByCode(code: string): LanguageItem | undefined {
  return SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase());
}
