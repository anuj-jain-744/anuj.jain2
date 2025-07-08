import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThemeSwitch from "../ThemeSwitch";


describe("ThemeSwitch Component", () => {

  it("renders ThemeSwitch component", () => {
    const mockChangeHandler = jest.fn();
    const mockValue = false;
    render(
      <ThemeSwitch
        isChecked={mockValue}
        onChangehandler={mockChangeHandler}
        isRequired={false}
        fieldName={"test"}
        classes={"test-class"}
      />
    );
    const switchInput = screen.getByRole('checkbox') as HTMLInputElement;
    fireEvent.click(switchInput)
    expect(mockChangeHandler).toHaveBeenCalled();
    expect(switchInput).toBeInTheDocument();
  });
});