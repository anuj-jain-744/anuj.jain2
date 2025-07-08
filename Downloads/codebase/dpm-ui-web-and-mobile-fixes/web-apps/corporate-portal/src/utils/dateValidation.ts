import { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
export function validateDOB(
    dobString: string,
    fieldName: string,
    onFieldChange: (name: string, value: string, isValid: boolean) => void,
    setErrorMessage: (msg: string) => void,
    languageData?: { [key: string]: string },
    isOn?: boolean //  This indicates Hijri (true) or Gregorian (false)
) {

    if (!dobString || dobString.trim() === "") {
        setErrorMessage(languageData?.Valid_Date_of_Birth_Required_Msg || "Date of Birth is required");
        onFieldChange(fieldName, "", false);
        return;
    }

    const dobRegex = /^\d{2}\/\d{4}$/;
    if (!dobRegex.test(dobString)) {
        setErrorMessage(languageData?.Valid_Date_of_Birth_Msg || "Please enter valid Date of Birth");
        onFieldChange(fieldName, "", false);
        return;
    }

    try {
        const selectedDate = new DateObject({
            date: `01/${dobString}`,
            format: "DD/MM/YYYY",
            calendar: isOn ? arabic : undefined,  //  Use Hijri calendar if isOn = true
        });

        if (!selectedDate.isValid || selectedDate.toString() === "Invalid Date") {
            throw new Error("Invalid DateObject");
        }

        const today = new DateObject();
        const maxDate = today.subtract(18, "years");
        const minDate = new DateObject(maxDate).subtract(100, "years");
        const selectedConverted = isOn ? selectedDate.convert("gregorian") : selectedDate;

        if (selectedConverted.toDate() > maxDate.toDate()) {
            setErrorMessage(languageData?.Valid_age_must_be_start_within_Msg || "You must be at least 18 years old.");
            onFieldChange(fieldName, dobString, false);
        } else if (selectedConverted.toDate() < minDate.toDate()) {
            setErrorMessage(languageData?.Valid_Date_of_Birth_Msg || "Please enter a valid Date of Birth");
            onFieldChange(fieldName, dobString, false);
        } else {
            setErrorMessage("");
            onFieldChange(fieldName, dobString, true);
        }

    } catch (error) {
        setErrorMessage(languageData?.Invalid_Date_of_Birth_Msg || "Invalid Date of Birth");
        onFieldChange(fieldName, "", false);
    }
}

