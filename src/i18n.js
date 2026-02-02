import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";

const lang = localStorage.getItem("lang") || "en";
const dir = lang === 'ar' ? 'rtl' : 'ltr';

document.documentElement.lang = lang;
document.documentElement.dir = dir;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
    },
    lng: lang,
    fallbackLng: "en",
  });
export { lang, dir };
export default i18n;