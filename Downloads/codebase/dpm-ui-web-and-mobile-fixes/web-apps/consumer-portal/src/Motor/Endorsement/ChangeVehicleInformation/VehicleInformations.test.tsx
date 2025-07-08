import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VehicleInformation from "./VehicleInformation";

// Mock ThemeRadioCheckbox component
jest.mock("../../../claims/components/ThemeRadioCheckbox", () => (props: any) => (
  <div data-testid="theme-radio-checkbox" onClick={props.onChangehandler}></div>
));

describe("VehicleInformation Component", () => {
  const mockOnChangeHandler = jest.fn();

  const defaultProps = {
    iconName: "recycle",
    titleText: "Vehicle Title",
    description: "Vehicle Description",
    radioLabel: "Select Vehicle",
    radiokey: "vehicle1",
    name: "vehicle",
    isChecked: true,
    type: "radio",
    onChangehandler: mockOnChangeHandler,
  };

  test("renders VehicleInformation component with given props", () => {
    render(<VehicleInformation {...defaultProps} />);

    expect(screen.getByText("Vehicle Title")).toBeInTheDocument();
    expect(screen.getByText("Vehicle Description")).toBeInTheDocument();
    expect(screen.getByTestId("theme-radio-checkbox")).toBeInTheDocument();
  });

  test("icnFactory returns correct icon", () => {
    render(<VehicleInformation {...defaultProps} />);

    expect(screen.getByTestId("PublishedWithChangesIcon")).toBeInTheDocument();
  });

  test("onChange handler calls onChangehandler prop with correct arguments", () => {
    render(<VehicleInformation {...defaultProps} />);

    const radioCheckbox = screen.getByTestId("theme-radio-checkbox");
    fireEvent.click(radioCheckbox);

    expect(mockOnChangeHandler).toHaveBeenCalledWith("vehicle1", undefined, undefined);
  });
});