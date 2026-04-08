import i18n, { DEFAULT_LANGUAGE_CODE } from "../../i18n";
import {isLanguageCode} from "@interfaces/ILanguageCode";

// Safari-specific language detection
export const detectSafariLanguage = (): string => {
    let detectedLanguage = DEFAULT_LANGUAGE_CODE;

    try {
        // Check if we"re in Safari
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
            // Get all available languages from navigator
            const navLangs = navigator.languages || [];

            // Log detection process in development
            if (import.meta.env.DEV) {
                console.group("🔍 Safari Language Detection");
                console.log("User Agent:", navigator.userAgent);
                console.log("navigator.language:", navigator.language);
                console.log("navigator.languages:", navLangs);
                console.groupEnd();
            }

            // Special handling for Safari
            // Check if English is in the language list at all
            const hasEnglish = navLangs.some(lang => lang.startsWith(DEFAULT_LANGUAGE_CODE));

            if (hasEnglish) {
                detectedLanguage = DEFAULT_LANGUAGE_CODE;
            } else {
                // If no English found, use the first language that we support
                for (const lang of navLangs) {

                    const baseLang = lang.split("-")[0]; // Get base language code
                    if(!isLanguageCode(baseLang)) continue

                    const suppoertedLangs = i18n.options.supportedLngs || [];

                    if (suppoertedLangs && suppoertedLangs.includes(baseLang)) {
                        detectedLanguage = baseLang;
                        break;
                    }
                }
            }
        } else {
            // For non-Safari browsers, use the standard detection
            const navLang = navigator.language || "";
            const suppoertedLangs = i18n.options.supportedLngs || [];
            const baseLang = navLang.split("-")[0]; // Get base language code

            if (suppoertedLangs && suppoertedLangs.includes(baseLang) && isLanguageCode(baseLang)) {
                detectedLanguage = baseLang;
            }
        }
    } catch (error) {
        console.error("Error detecting language:", error);
    }

    return detectedLanguage;
};

// Advanced language detection that handles Safari quirks
export const detectLanguage = (): string => {
    // Priority order:
    // 1. URL parameter (highest priority)
    // 2. Explicitly selected language (localStorage)
    // 3. Browser detection with Safari-specific handling
    // 4. Default to Italian

    try {
        // 1. Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get("lang");
        const suppoertedLangs = i18n.options.supportedLngs || [];

        if (langParam && suppoertedLangs && suppoertedLangs.includes(langParam)) {
            return langParam;
        }

        // 2. Check localStorage for explicitly selected language
        const storedLang = localStorage.getItem("i18nextLng");

        if (storedLang && suppoertedLangs && suppoertedLangs.includes(storedLang)) {
            return storedLang;
        }

        // 3. Use Safari-specific detection
        return detectSafariLanguage();

    } catch (error) {
        console.error("Error in advanced language detection:", error);
        return DEFAULT_LANGUAGE_CODE; // Default fallback
    }
};

// Function to set the language with proper handling
export const setLanguage = (languageCode: string): void => {
    const suppoertedLangs = i18n.options.supportedLngs || [];
    if (suppoertedLangs && !suppoertedLangs.includes(languageCode)) {
        languageCode = DEFAULT_LANGUAGE_CODE; // Default to Italian if unsupported
    }

    // Store in localStorage and change the language
    localStorage.setItem("i18nextLng", languageCode);
    void i18n.changeLanguage(languageCode);

    if (import.meta.env.DEV) {
        console.log(`Language set to: ${languageCode}`);
    }
};
