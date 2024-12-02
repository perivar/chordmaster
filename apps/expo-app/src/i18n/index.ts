import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

import en from "./languages/en.json";

// import no from './languages/no.json';

const i18n = new I18n(en);

i18n.defaultLocale = "en";
// i18n.locale = Localization.locale; // do not set here, use LocalizationProvider to set locale instead
i18n.enableFallback = true;

// make sure to keep the translations array and translated languages in sync
i18n.translations = {
  en,
  // no,
  // nb: no,
};

export const translatedLanguages = [
  { code: "en", label: "English" },
  // { code: 'no', label: 'Norsk' },
];

console.log("Current locale", Localization.locale);
// console.log('i18n current', i18n.currentLocale());
console.log("All locales", Localization.locales);
console.log("All translations", Object.keys(i18n.translations));

export default i18n;
