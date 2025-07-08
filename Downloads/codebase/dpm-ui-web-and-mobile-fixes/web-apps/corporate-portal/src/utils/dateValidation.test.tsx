import { validateDOB } from "./dateValidation"; // ✅ Adjust path as needed
import { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";

describe("validateDOB", () => {
  const mockOnFieldChange = jest.fn();
  const mockSetErrorMessage = jest.fn();
  const languageData = {
    Valid_Date_of_Birth_Required_Msg: "Date of Birth is required",
    Valid_Date_of_Birth_Msg: "Please enter a valid Date of Birth",
    Valid_age_must_be_start_within_Msg: "You must be at least 18 years old.",
    Invalid_Date_of_Birth_Msg: "Invalid Date of Birth",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error for empty DOB input", () => {
    validateDOB("", "dob", mockOnFieldChange, mockSetErrorMessage, languageData, false);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("Date of Birth is required");
    expect(mockOnFieldChange).toHaveBeenCalledWith("dob", "", false);
  });

  it("should return an error for invalid DOB format", () => {
    validateDOB("2000-01", "dob", mockOnFieldChange, mockSetErrorMessage, languageData, false);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("Please enter a valid Date of Birth");
    expect(mockOnFieldChange).toHaveBeenCalledWith("dob", "", false);
  });

  it("should return an error for age below 18", () => {
    const underageDOB = new DateObject().subtract(10, "years").format("MM/YYYY");
    validateDOB(underageDOB, "dob", mockOnFieldChange, mockSetErrorMessage, languageData, false);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("You must be at least 18 years old.");
    expect(mockOnFieldChange).toHaveBeenCalledWith("dob", underageDOB, false);
  });

  it("should validate DOB correctly for age between 18 and 100 years", () => {
    const validDOB = new DateObject().subtract(30, "years").format("MM/YYYY");
    validateDOB(validDOB, "dob", mockOnFieldChange, mockSetErrorMessage, languageData, false);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("");
    expect(mockOnFieldChange).toHaveBeenCalledWith("dob", validDOB, true);
  });

  it("should handle Hijri calendar validation correctly", () => {
    const hijriDOB = new DateObject({ date: "01/1445", calendar: arabic }).format("MM/YYYY");
    validateDOB(hijriDOB, "dob", mockOnFieldChange, mockSetErrorMessage, languageData, true);
    expect(mockSetErrorMessage).not.toHaveBeenCalledWith("Invalid Date of Birth"); // Ensure it doesn't falsely flag a valid Hijri date
  });

  it("should handle invalid Hijri calendar date", () => {
    validateDOB("14/1445", "dob", mockOnFieldChange, mockSetErrorMessage, languageData, true);
    expect(mockSetErrorMessage).toHaveBeenCalledWith("You must be at least 18 years old.");
    expect(mockOnFieldChange).toHaveBeenCalledWith("dob", "14/1445", false);
  });
});
