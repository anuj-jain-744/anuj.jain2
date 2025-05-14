import { createContext } from "react";
import { LanguageData } from "types/languageData";
export const DataContext = createContext<LanguageData | null>(null);