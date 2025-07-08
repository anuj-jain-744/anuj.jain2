import dateValidation from "./dateValidation"; // ✅ Adjust path as needed

describe("dateValidation Function", () => {
  it("should return undefined", () => {
    const mockOnFieldChange = jest.fn();
    const mockSetErrorMessage = jest.fn();

    const result=dateValidation("01/2000", "dob", mockOnFieldChange, mockSetErrorMessage);
    expect(result).toBe(undefined)
  });
});
