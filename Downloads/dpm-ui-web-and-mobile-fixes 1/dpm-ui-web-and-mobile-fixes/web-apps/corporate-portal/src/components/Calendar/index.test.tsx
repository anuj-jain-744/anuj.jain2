import { render, screen } from "@testing-library/react";
import { SharedCalendar } from "./index";
import '@testing-library/jest-dom';

describe("src/components/SharedCalendar", () => {
  const setValue = jest.fn();
  const value= new Date();
  const setIsOn = jest.fn();

  it("shared-calendar with value", () => {
    render(<SharedCalendar value={value} setValue={setValue} isOn={false} setIsOn={setIsOn} />);
    const sharedCalendar = screen.getByRole('textbox');
    expect(sharedCalendar).toBeInTheDocument();
  });

  it("shared-calendar with undefined value", () => {
    render(<SharedCalendar value={null} setValue={setValue} isOn={false} setIsOn={setIsOn} />);
    const sharedCalendar = screen.getByRole('textbox');
    expect(sharedCalendar).toBeInTheDocument();
  });
});
