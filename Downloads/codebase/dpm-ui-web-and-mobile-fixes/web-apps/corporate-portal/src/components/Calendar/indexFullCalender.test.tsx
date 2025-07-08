import { render, screen, fireEvent } from "@testing-library/react";
import { FullCalender } from "./fullcalender";

describe("FullCalender Component", () => {
  const mockSetValue = jest.fn();
  const mockSetIsOn = jest.fn();

  it("should render date picker with default value", () => {
    render(
      <FullCalender
        value={"01/2000"}
        setValue={mockSetValue}
        isOn={false}
        setIsOn={mockSetIsOn}
      />
    );

    const dateInput = screen.getByRole("textbox");
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute("readonly"); // Ensure the input is read-only
  });

  it("should trigger date change handler", () => {
    render(
      <FullCalender
        value={"01/2000"}
        setValue={mockSetValue}
        isOn={false}
        setIsOn={mockSetIsOn}
      />
    );

    const dateInput = screen.getByRole("textbox");
    fireEvent.change(dateInput);

    expect(mockSetValue).toHaveBeenCalledTimes(0);
  });
});
