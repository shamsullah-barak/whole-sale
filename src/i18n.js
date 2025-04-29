import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./locales/en/translation.json";
import translationPS from "./locales/ps/translation.json";
import translationDR from "./locales/dr/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  ps: {
    translation: translationPS,
  },
  dr: {
    translation: translationDR,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ps",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
