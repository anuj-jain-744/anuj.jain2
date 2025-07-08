import { calendarValidation, isValidDate } from "./calendarValidation"; 
import { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";

describe("calendarValidation", () => {
  it("should return false for invalid format", () => {
    expect(calendarValidation("2025-05", false)).toBe(false);
    expect(calendarValidation("May/2025", false)).toBe(false);
    expect(calendarValidation("13/2025", false)).toBe(false); // Invalid month
  });

  it("should return false for out-of-range years", () => {
    const tooOldYear = new Date().getFullYear() - 101; // More than 100 years old
    expect(calendarValidation(`01/${tooOldYear}`, false)).toBe(false);

    const futureYear = new Date().getFullYear() + 1; // Future year
    expect(calendarValidation(`01/${futureYear}`, false)).toBe(false);
  });

  it("should return true for valid Gregorian", () => {
    const validGregorian = `01/${new Date().getFullYear() - 30}`; // Valid range
    expect(calendarValidation(validGregorian, false)).toBe(true);
  });
});

describe("isValidDate", () => {
  const minDate = new DateObject().subtract(100, "years");
  const maxDate = new DateObject().subtract(18, "years");

  it("should return false for invalid format", () => {
    expect(isValidDate("2025-05-01", false, maxDate, minDate)).toBe(false);
    expect(isValidDate("May/01/2025", false, maxDate, minDate)).toBe(false);
  });

  it("should return true for valid Gregorian date within range", () => {
    const validDate = maxDate.subtract(10, "years").format("DD/MM/YYYY");
    expect(isValidDate(validDate, false, maxDate, minDate)).toBe(true);
  });

  it("should return true for valid Hijri date within range", () => {
    const validHijriDate = new DateObject({ calendar: arabic }).subtract(30, "years").format("DD/MM/YYYY");
    expect(isValidDate(validHijriDate, true, maxDate, minDate)).toBe(true);
  });

  it("should return false for invalid Hijri conversion", () => {
    expect(isValidDate("31/02/1445", true, maxDate, minDate)).toBe(false); // Non-existent date
  });
});
