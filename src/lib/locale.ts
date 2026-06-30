export const locales = ["en", "uz"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "samir_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "uz";
}

export function getLocaleFromCountry(country: string | undefined | null): Locale {
  return country?.toUpperCase() === "UZ" ? "uz" : "en";
}
