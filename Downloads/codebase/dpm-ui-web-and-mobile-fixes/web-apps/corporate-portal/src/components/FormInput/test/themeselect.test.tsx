import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThemeSelect from "../ThemeSelect";


describe("ThemeSelect Component", () => {

  it("renders ThemeSelect component", () => {
    const mockChangeHandler = jest.fn();
    const mockOptions = [
      { key: "Test", value: "Test1" },
      { key: "Test Data", value: "Test Data" }
    ]
    const mockPlaceHolder = "Select Placeholder";
    const mockValue = "";
    render(
      <ThemeSelect
        options={mockOptions}
        placeholder={mockPlaceHolder}
        value={mockValue}
        onChangehandler={mockChangeHandler}
        isRequired={false}
        fieldName={"test"}
        classes={"test-class"}
      />
    );
    const selectInput = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(selectInput)
    expect(mockChangeHandler).toHaveBeenCalled();
    expect(selectInput).toBeInTheDocument();
  });
});