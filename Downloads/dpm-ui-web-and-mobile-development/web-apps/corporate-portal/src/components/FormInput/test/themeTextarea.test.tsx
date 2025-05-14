import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThemeTextarea from "../ThemeTextarea";

describe("ThemeTextarea Component", () => {

  it("renders ThemeTextarea component", async () => {
    const mockChangeHandler = jest.fn();
    const mockPlaceHolder = "Select Placeholder";
    const mockValue = "";
    render(
      <ThemeTextarea
        placeholder={mockPlaceHolder}
        value={mockValue}
        onChangehandler={mockChangeHandler}
        isRequired={false}
        name={"test"}
        classes={"test-class"}
      />
    );
    const inputElement = screen.getByPlaceholderText(mockPlaceHolder) as HTMLInputElement;
    fireEvent.change(inputElement, {target: {value: "New value"}});
    expect(mockChangeHandler).toHaveBeenCalled();
  });

  it("renders ThemeTextarea component", async () => {
    const mockChangeHandler = jest.fn();

    const mockPlaceHolder = "Select Placeholder";
    const mockValue = "";
    render(
      <ThemeTextarea
        placeholder={mockPlaceHolder}
        value={mockValue}
        title={"title ddd"}
        onChangehandler={mockChangeHandler}
        isRequired={true}
        name={"test"}
      />
    );
    expect(screen.getByText('title ddd')).toBeInTheDocument();
		
    const inputElement = screen.getByPlaceholderText(mockPlaceHolder) as HTMLInputElement;
    fireEvent.change(inputElement, {target: {value: "New value"}});
    expect(mockChangeHandler).toHaveBeenCalled();
  });
});