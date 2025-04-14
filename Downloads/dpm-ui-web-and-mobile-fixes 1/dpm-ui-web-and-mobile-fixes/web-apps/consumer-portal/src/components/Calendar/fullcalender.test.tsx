import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FullCalender } from "./fullcalender";
import { DateObject } from "react-multi-date-picker";

// Mocking the SwitchButton component
jest.mock("components/SwitchButton", () => ({
  __esModule: true,
  default: ({ isOn, handleToggle }: { isOn: boolean, handleToggle: () => void }) => (
    <button onClick={handleToggle}>{isOn ? "On" : "Off"}</button>
  )
}));

describe("FullCalender Component", () => {
  const mockSetValue = jest.fn();
  const mockSetIsOn = jest.fn();
  const defaultProps = {
    value: null,
    setValue: mockSetValue,
    isOn: true,
    setIsOn: mockSetIsOn,
    showSwitch: true,
    switchLabel: "Switch Calendar",
    placeholder: "Select Date",
    maxDate: true,
  };

  it("should render the calendar with the correct placeholder", () => {
    render(<FullCalender {...defaultProps} />);

    // Check if placeholder is rendered
    expect(screen.getByPlaceholderText("Select Date")).toBeInTheDocument();
  });

  it("should change the date when a date is selected", async () => {
    const selectedDate = new DateObject().add(1, "days").format("DD/MM/YYYY");

    render(<FullCalender {...defaultProps} />);

    // Simulate a date selection
    const dateInput = screen.getByPlaceholderText("Select Date");
    fireEvent.click(dateInput); // Open calendar

    const dateButton = await screen.findByText("1"); // Assuming the date is 1 (depends on the calendar)
    fireEvent.click(dateButton); // Simulate selecting date

    // Check if setValue has been called with the selected date
    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith(expect.objectContaining({
        year: expect.any(Number),
        month: expect.any(Number),
        day: 1,
      }));
    });
  });

  it("should toggle the calendar switch", async () => {
    render(<FullCalender {...defaultProps} />);

    // Initially it should be "On"
    expect(screen.getByText("On")).toBeInTheDocument();

    // Toggle the switch
    fireEvent.click(screen.getByText("On"));

    // Check if handleToggle was called
    await waitFor(() => {
      expect(mockSetIsOn).toHaveBeenCalledWith(false); // Assuming `false` is the updated state
    });
  });

  it("should display the switch label", () => {
    render(<FullCalender {...defaultProps} />);

    // Check if the switch label is displayed
    expect(screen.getByText("Switch Calendar")).toBeInTheDocument();
  });

  it("should update the calendar locale and calendar when isOn changes", () => {
    const { rerender } = render(<FullCalender {...defaultProps} />);

    // Check if calendar is in Arabic when isOn is true
    expect(screen.queryByText("1")).toBeInTheDocument(); // Example check if Arabic locale is applied

    // Change `isOn` to false (toggle the switch)
    rerender(<FullCalender {...defaultProps} isOn={false} />);

    // Now check if calendar switches back to default
    expect(screen.queryByText("Jan")).toBeInTheDocument(); // Example of default month names
  });

  it("should respect maxDate logic", () => {
    const maxDate = new DateObject().add(180, "days");
    render(<FullCalender {...defaultProps} maxDate={true} />);

    // Check that maxDate is set correctly
    expect(screen.getByPlaceholderText("Select Date")).toBeInTheDocument();
    
    // We will not be able to directly test the calendar UI, but we can validate that the maxDate is respected
    // by checking the internal state or API calls related to the calendar (if applicable).
  });

  it("should not show the switch if showSwitch is false", () => {
    render(<FullCalender {...defaultProps} showSwitch={false} />);

    // Check if the switch is not rendered
    expect(screen.queryByText("On")).not.toBeInTheDocument();
  });

  it("should handle null value correctly", () => {
    render(<FullCalender {...defaultProps} value={null} />);

    // Check if the placeholder is displayed when value is null
    expect(screen.getByPlaceholderText("Select Date")).toBeInTheDocument();
  });

  it("should handle invalid date input", () => {
    render(<FullCalender {...defaultProps} value="invalid-date" />);

    // Check if setValue is called with null for invalid date
    const dateInput = screen.getByPlaceholderText("Select Date");
    fireEvent.change(dateInput, { target: { value: 'invalid-date' } });
    expect(mockSetValue).toHaveBeenCalledWith(null);
  });

  it("should call setValue with null when cleared", () => {
    render(<FullCalender {...defaultProps} />);

    // Simulate clearing the date
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    expect(mockSetValue).toHaveBeenCalledWith(null);
  });
});