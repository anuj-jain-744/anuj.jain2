import { LanguageData } from "types/languageData";
export const validatePropertyPhotos = (
    files: File[] = [],
    languageData: LanguageData | null
  ): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg'];
     const hasInvalidFile = files.some(file =>
    file.size > 800 * 1024 || !allowedTypes.includes(file.type)
  );
    if (hasInvalidFile) {
      return false;
    }
    return true;
  };