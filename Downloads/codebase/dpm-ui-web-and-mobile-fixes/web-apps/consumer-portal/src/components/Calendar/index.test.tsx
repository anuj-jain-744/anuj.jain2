import { render, screen, fireEvent } from "@testing-library/react";
import { SharedCalendar } from "./index";
import '@testing-library/jest-dom';

describe("src/components/SharedCalendar", () => {
  const setValue = jest.fn();
  const setIsOn = jest.fn();
  const handleToggle= jest.fn();
  const value = new Date();
  const value1 = "111";

  // it("shared-calendar with value", () => {
  //   render(<SharedCalendar value={value} setValue={setValue} isOn={false} setIsOn={setIsOn} />);
  //   const sharedCalendar = screen.getByRole('textbox');
  //   expect(sharedCalendar).toBeInTheDocument();
  // });

  // it("shared-calendar with undefined value", () => {
  //   render(<SharedCalendar value={null} setValue={setValue} isOn={false} setIsOn={setIsOn} />);
  //   const sharedCalendar = screen.getByRole('textbox');
  //   expect(sharedCalendar).toBeInTheDocument();
  // });

  it("shared-calendar with isOn true", () => {
    render(<SharedCalendar value={value} setValue={setValue} isOn={true} setIsOn={setIsOn} />);
    const sharedCalendar = screen.getByRole('textbox');
    expect(sharedCalendar).toBeInTheDocument();
  });

  it("should call setValue when a date is selected", () => {
    render(<SharedCalendar value={value} setValue={setValue} isOn={false} setIsOn={setIsOn} />);
    const sharedCalendar = screen.getByRole('textbox');
    fireEvent.change(sharedCalendar, { target: { value: '2023-10-10' } });
    expect(setValue).toHaveBeenCalled();
  });

  // it("should render switch button ", () => {
  //   render(<SharedCalendar value={value} setValue={setValue} isOn={false} setIsOn={setIsOn} showSwitch = {true}
  //     />);
  //   const toggleButton = screen.getByRole('input');
  //   fireEvent.change(toggleButton);
  //   expect(handleToggle).toHaveBeenCalled();
  //   expect(toggleButton).toBeInTheDocument();
  // });

  it("should handle invalid date input", () => {
    render(<SharedCalendar value={value1} setValue={setValue} isOn={false} setIsOn={setIsOn} />);
    const sharedCalendar = screen.getByRole('textbox');
    fireEvent.change(sharedCalendar, { target: { value: 'invalid-date' } });
    expect(setValue).toHaveBeenCalledWith(null);
  });

});