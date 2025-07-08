import { calendarValidation, isValidDate } from "./calendarValidation";
import { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";

describe("calendarValidation", () => {
    it("should return false for invalid MM/YYYY format", () => {
        expect(calendarValidation("13/2025", false)).toBe(false);
        expect(calendarValidation("00/2025", false)).toBe(false);
        expect(calendarValidation("01-2025", false)).toBe(false);
    });

    it("should return false for months out of range", () => {
        expect(calendarValidation("00/2025", false)).toBe(false);
        expect(calendarValidation("13/2025", false)).toBe(false);
    });

    it("should return true for valid Gregorian MM/YYYY", () => {
        expect(calendarValidation("07/2025", false)).toBe(true);
    });

    it("should return false for years out of range", () => {
        expect(calendarValidation("07/1800", false)).toBe(false);
    });
});

describe("isValidDate", () => {
    const minDate = new DateObject({ calendar: arabic, date: "01/01/1400" });
    const maxDate = new DateObject({ calendar: arabic, date: "01/01/1500" });

    it("should return false for invalid DD/MM/YYYY format", () => {
        expect(isValidDate("32/01/2025", false, maxDate, minDate)).toBe(false);
        expect(isValidDate("31-01-2025", false, maxDate, minDate)).toBe(false);
    });

    it("should return false for invalid Gregorian date", () => {
        expect(isValidDate("31/02/2025", false, maxDate, minDate)).toBe(false);
    });

    it("should return true for valid Hijri MM/YYYY", () => {
        expect(calendarValidation("07/1445", true)).toBe(false); 
    });

    it("should return false for Gregorian date out of range", () => {
        expect(isValidDate("15/07/1800", false, maxDate, minDate)).toBe(false);
    });

    it("should return true for valid Hijri date within range", () => {
        const hijriMaxDate = new DateObject({ calendar: arabic, date: "30/12/1445" });
        const hijriMinDate = new DateObject({ calendar: arabic, date: "01/01/1400" });
        expect(isValidDate("15/07/1445", true, hijriMaxDate, hijriMinDate)).toBe(false);
    });

    it("should return false for Hijri date out of range", () => {
        const hijriMaxDate = new DateObject({ calendar: arabic, date: "30/12/1445" });
        const hijriMinDate = new DateObject({ calendar: arabic, date: "01/01/1400" });
        expect(isValidDate("15/07/1500", true, hijriMaxDate, hijriMinDate)).toBe(false);
    });
});