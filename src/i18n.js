import i18n from "i18next";
import {initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json"
import ar from "./locales/ar/translation.json"
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en
      },
      ar: {
        translation: ar
      }
    },
    lng: "en",
    fallbackLng: "en",
  });