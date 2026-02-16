export type ILanguageCode = 'en' | 'it' | "de" | "fr";

export function isLanguageCode(value: string): value is ILanguageCode {
    return value === 'en' || value === 'it';
}
