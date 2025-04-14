/**
 * Sets the default language based on the user's browser language or the stored device language.
 * Also calls the `setOrientation` function.
 */

const setDefaultLanguage = (): void => {
  const lang = window?.navigator?.language || (window?.navigator as Navigator & {userLanguage: string}).userLanguage;
  const currentLang = localStorage.getItem("deviceLang") ?? lang;
  localStorage.setItem("deviceLang", currentLang);
  setOrientation();
};

/**
 * Sets the user's language code and updates the device language in local storage.
 * @param code - The language code to set.
 */
const setUserLanguage = (code: string): void => {
  localStorage.setItem("deviceLang", code);
  setOrientation();
};

/**
 * Retrieves the current language from the localStorage.
 * If the language is not found, it defaults to "en".
 * @returns The current language as a string.
 */
const getCurrentLanguage = (): string =>
  localStorage.getItem("deviceLang")?.substring(0, 2) ?? "en";

/**
 * Sets the orientation of the document body based on the language stored in the local storage.
 */
const setOrientation = (): void => {
  const lang = localStorage.getItem("deviceLang");
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
};

/**
 * Retrieves the translation value for a given path and application language.
 * @param path - The path to the translation key.
 * @param appLanguage - The object containing the translations for different languages.
 * @returns The translation value for the given path, or undefined if not found.
 */
const getTranslationForKey = (path: string, appLanguage: any): any => {
  const currentLang = getCurrentLanguage();
  const dynamicPath = path.split(".");
  dynamicPath.splice(1, 0, currentLang);
  let value = appLanguage;
  for (const key of dynamicPath) {
    if (value[key] !== undefined) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
};

export {
  setDefaultLanguage,
  setUserLanguage,
  getCurrentLanguage,
  getTranslationForKey,
};
