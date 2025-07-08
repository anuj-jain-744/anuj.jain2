import { DateObject } from "react-multi-date-picker";

import arabicEn from "react-date-object/locales/arabic_en";
import arabic from "react-date-object/calendars/arabic";
import gregorian from "react-date-object/calendars/gregorian"
export const calendarValidation = (
    value: string,
    isHijri: boolean
): boolean => {
    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(value)) return false;
    const [monthStr, yearStr] = value.split("/");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    if (month < 1 || month > 12) return false;
    const today = new Date();
    let currentMonth = today.getMonth() + 1;
    let currentYear = today.getFullYear();

    if (isHijri) {
        const date = new DateObject({ calendar: arabic, locale: arabicEn });
        const arabicDate = date.subtract(18, "years").format();
        const [arabicYear, arabicMonth] = arabicDate.split("/").map(Number);
        currentYear = arabicYear; // Set max Hijri year
        currentMonth = arabicMonth; // Set max Hijri month
    }
    const minYear = currentYear - 100;
    return (
        year >= minYear &&
        (year < currentYear || (year === currentYear && month <= currentMonth))
    );
};


export const isValidDate = (value: string, isHijri: boolean, maxDate: DateObject, minDate: DateObject): boolean => {
    // Validate the date format (DD/MM/YYYY)
    if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value)) return false;

    // Parse the date string
    const [day, monthStr, yearStr] = value.split("/");
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(monthStr, 10) - 1; // Month is zero-based in JavaScript Date
    const yearNum = parseInt(yearStr, 10);
    let selectedDate: Date | DateObject = new Date(yearNum, monthNum, dayNum);
    if (isHijri) {
        if (monthNum !== selectedDate?.getMonth()) {
            return false;
        }
        selectedDate = new DateObject({ calendar: arabic, date: `${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}/${selectedDate.getDate()}` }).convert(gregorian);
        selectedDate = new Date(selectedDate?.format());
    }

    // Ensure the date is valid (e.g., no invalid dates like 31/02/2023)
    if (!isHijri && (selectedDate.getDate() !== dayNum || selectedDate.getMonth() !== monthNum || selectedDate.getFullYear() !== yearNum)) {
        return false;
    }

    const minDateObj = new Date(minDate.format());
    minDateObj.setHours(0, 0, 0, 0);

    const maxDateObj = new Date(maxDate.format());
    maxDateObj.setHours(0, 0, 0, 0);

    // Check if the date is within the range
    if (selectedDate >= minDateObj && selectedDate <= maxDateObj) {
        return true;
    }
    return false;
};