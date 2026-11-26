import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupportedLocale } from '@/types/domain';
import { TRANSLATIONS, type TranslationDict } from './translations';

const LOCALE_STORAGE_KEY = 'tapza_locale_v1';

type I18nContextValue = {
  locale: SupportedLocale;
  setLocale: (next: SupportedLocale) => void;
  t: TranslationDict;
};

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: TRANSLATIONS.en,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>('en');

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'en' || saved === 'hi' || saved === 'te') {
          setLocaleState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
    AsyncStorage.setItem(LOCALE_STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: TRANSLATIONS[locale],
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
