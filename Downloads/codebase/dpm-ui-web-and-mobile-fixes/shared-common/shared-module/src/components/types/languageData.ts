export interface LanguageData {
    [key: string]: string | string[];
}

export interface LanguageDataState {
    languageData: LanguageData | null;
    loading: boolean;
    error: string | null;
}