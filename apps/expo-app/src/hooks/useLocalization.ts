import { useContext } from "react";

import { Scope, TranslateOptions } from "i18n-js";

import {
  LocalizationContext,
  LocalizationContextProps,
} from "../context/LocalizationProvider";

interface UseLocalizationHook extends LocalizationContextProps {}

const useLocalization = (): UseLocalizationHook => {
  const {
    t = (scope: Scope, _options?: TranslateOptions) =>
      `Missing translation for: ${scope}`,
    locale = "en",
    locales = ["en"],
    languages = [{ code: "en", label: "English" }],
    setLocale = () => {},
    resetLocale = () => {},
  } = useContext(LocalizationContext) || {}; // Fallback to empty object if context is undefined

  return { t, locale, locales, languages, setLocale, resetLocale };
};

export { useLocalization };
