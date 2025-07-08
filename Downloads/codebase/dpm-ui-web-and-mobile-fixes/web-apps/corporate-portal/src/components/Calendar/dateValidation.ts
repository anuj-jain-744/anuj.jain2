interface AgeLimits {
    minAge: number;
    maxAge?: number;
}

export default function dateValidation (
    dobString: string,
    fieldName: string,
    onFieldChange: (name: string, value: string, isValid: boolean) => void,
    setErrorMessage: (msg: string) => void,
    languageData?: { [key: string]: string },
    isOn?: boolean,
    ageLimits?: AgeLimits
) {
    return
}