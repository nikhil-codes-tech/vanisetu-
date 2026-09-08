/**
 * PALASH Curriculum Language Selection Store
 * Observable store managing teacher's selected curriculum language
 * with local persistence and offline fallback.
 * Stage 2.12 - Multilingual Curriculum Data Architecture.
 */

import React, { useState, useEffect } from 'react';
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_CURRICULUM_LANGUAGE,
  LanguageItem,
  getLanguageByCode,
} from '../constants/languages';
import { translationRepository } from '../database/repositories/curriculumRepository';

export interface LanguageStoreState {
  selectedLanguage: string; // e.g. 'hi' | 'ho' | 'mun' | 'sat'
  availableLanguages: LanguageItem[];
  isLoading: boolean;
}

type Listener = () => void;

class LanguageStore {
  private state: LanguageStoreState = {
    selectedLanguage: DEFAULT_CURRICULUM_LANGUAGE,
    availableLanguages: SUPPORTED_LANGUAGES,
    isLoading: false,
  };

  private listeners = new Set<Listener>();

  getState(): LanguageStoreState {
    return this.state;
  }

  getSelectedLanguage(): string {
    return this.state.selectedLanguage;
  }

  private setState(partial: Partial<LanguageStoreState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        // Ignore listener error
      }
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Initializes language state from SQLite offline registry.
   */
  async init(): Promise<void> {
    this.setState({ isLoading: true });
    try {
      const storedLanguages = await translationRepository.getLanguages();
      if (storedLanguages && storedLanguages.length > 0) {
        const mergedLanguages: LanguageItem[] = storedLanguages.map((l) => ({
          code: l.code,
          name: l.name,
          native_name: l.native_name,
          script: l.script,
          is_active: l.is_active === 1,
          direction: (l.direction as 'ltr' | 'rtl') || 'ltr',
        }));
        this.setState({
          availableLanguages: mergedLanguages,
          isLoading: false,
        });
      } else {
        // Pre-populate SQLite with baseline supported languages
        for (const lang of SUPPORTED_LANGUAGES) {
          await translationRepository.saveLanguage({
            code: lang.code,
            name: lang.name,
            native_name: lang.native_name,
            script: lang.script,
            is_active: lang.is_active ? 1 : 0,
            direction: lang.direction || 'ltr',
          });
        }
        this.setState({
          availableLanguages: SUPPORTED_LANGUAGES,
          isLoading: false,
        });
      }
    } catch {
      this.setState({
        availableLanguages: SUPPORTED_LANGUAGES,
        isLoading: false,
      });
    }
  }

  /**
   * Sets teacher's selected curriculum language.
   */
  setLanguage(languageCode: string): void {
    const valid = getLanguageByCode(languageCode);
    if (valid) {
      this.setState({ selectedLanguage: valid.code });
    } else {
      this.setState({ selectedLanguage: languageCode.toLowerCase().trim() });
    }
  }
}

export const languageStore = new LanguageStore();

/**
 * React Hook for consuming selected curriculum language and language list.
 */
export function useCurriculumLanguage(): LanguageStoreState & {
  setLanguage: (code: string) => void;
  selectedLanguageItem?: LanguageItem;
} {
  const [state, setState] = useState<LanguageStoreState>(languageStore.getState());

  useEffect(() => {
    return languageStore.subscribe(() => {
      setState(languageStore.getState());
    });
  }, []);

  return {
    ...state,
    setLanguage: (code: string) => languageStore.setLanguage(code),
    selectedLanguageItem: getLanguageByCode(state.selectedLanguage),
  };
}
