import i18n, {type LanguageDetectorModule} from "i18next";
import {initReactI18next} from "react-i18next";
import HttpBackend from "i18next-http-backend";
import dayjs from "dayjs";
import "dayjs/locale/it";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {detectLanguage} from "@helpers/languageDetection.ts";
import type {ILanguageCode} from "@interfaces/ILanguageCode.ts";

export const DEFAULT_LANGUAGE_CODE: ILanguageCode = "it";

// Extend dayjs with the localizedFormat plugin globally
dayjs.extend(localizedFormat);

const APP_ID = "default";

// Helper to create app-scoped namespaces
export const appNs = (name: string) => `${APP_ID}-${name}`;

// Function to update dayjs locale based on i18next language
const updateDayjsLocale = (language: string) => {
    const langCode = language.split("-")[0]; // Use base language code (e.g., "en" from "en-US")
    dayjs.locale(langCode);
};

// Custom language detector
const customLanguageDetector: LanguageDetectorModule = {
    type: 'languageDetector',
    detect: (): string => {
        return detectLanguage();
    },
    cacheUserLanguage: (lng: string) => {
        localStorage.setItem('i18nextLng', lng);
        updateDayjsLocale(lng);
    }
};

i18n
    .use(HttpBackend)
    .use(customLanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: DEFAULT_LANGUAGE_CODE,
        supportedLngs: ["en", "it"],
        debug: import.meta.env.DEV,

        ns: ["common"],
        defaultNS: "common",
        fallbackNS: ["common"],

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        load: 'languageOnly',
    })
    .then(() => {
        updateDayjsLocale(i18n.language);
    });

i18n.on("languageChanged", (lng) => {
    updateDayjsLocale(lng);
});

export {APP_ID};
export default i18n;
