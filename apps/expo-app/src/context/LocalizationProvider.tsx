import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as Localization from "expo-localization";
import { Scope, TranslateOptions } from "i18n-js/typings";

import { getItem, removeItem, setItem, storageKey } from "../firebase/storage";
import i18n, { translatedLanguages } from "../i18n";

export interface LocalizationContextProps {
  locale: string;
  locales: string[];
  languages: { code: string; label: string }[];
  setLocale: Dispatch<SetStateAction<string>>;
  t: (scope: Scope, options?: TranslateOptions) => string;
  resetLocale: () => void;
}

export const LocalizationContext = createContext<
  Partial<LocalizationContextProps>
>({});

const getLocalizationCountry = () => {
  const countyCode =
    Localization.locale.search(/-|_/) !== -1
      ? Localization.locale.slice(0, 2)
      : Localization.locale;

  return countyCode === "nb" ? "no" : countyCode;
};

// Assorted sources for inspiration:
// https://github.com/nikolaiwarner/react-cabal/blob/main/App.tsx
const LocalizationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [locale, setLocale] = useState(getLocalizationCountry());

  const locales = Localization.locales;
  const languages = translatedLanguages;

  // reset locale back to system settings
  const resetLocale = () => {
    const countryCode = getLocalizationCountry();
    console.log(
      "Resetting locale back to system settings and clearing local storage:",
      countryCode
    );
    setLocale(countryCode);
    removeItem(storageKey.LOCALE_KEY);
  };

  const localizationContext = useMemo(
    () => ({
      t: (scope: Scope, options?: TranslateOptions): string =>
        i18n.t(scope, { locale, ...options }),
      locale,
      locales,
      languages,
      setLocale,
      resetLocale,
    }),
    [locale]
  );

  // fetch locally cached locale on startup
  useEffect(() => {
    const fetchLocale = async () => {
      const localLocale = await getItem(storageKey.LOCALE_KEY);
      return localLocale;
    };

    fetchLocale().then(localLocale => {
      console.log("Trying to fetch locale from locale storage:", localLocale);
      if (localLocale) {
        console.log("Retrieved locale:", localLocale);
        setLocale(localLocale);
      }
    });
  }, []);

  // store new locale to local storage
  useEffect(() => {
    if (locale) {
      console.log("Storing locale to local storage:", locale);
      setItem(storageKey.LOCALE_KEY, locale);
    }
  }, [locale]);

  // check if the Localization.locale has changed?
  useEffect(() => {
    if (Localization.locale) {
      const countryCode = getLocalizationCountry();
      console.log(
        "Localization locale changed, setting locale to:",
        countryCode
      );
      setLocale(countryCode);
    }
  }, [Localization.locale]);

  return (
    <LocalizationContext.Provider value={localizationContext}>
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationProvider;
