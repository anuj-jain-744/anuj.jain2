import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BlueFormFooter } from ".";
import '@testing-library/jest-dom';

const mockBackClick = jest.fn();
const mockSubmitClick = jest.fn();

describe("BlueFormFooter", () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockBackClick.mockClear();
    mockSubmitClick.mockClear();
  });

  it("renders Back and Submit buttons", () => {
    render(
      <BlueFormFooter
        isDisabled={false}
        backBtnClickHandler={mockBackClick}
        submitClickHandler={mockSubmitClick}
      />
    );

    // Check that both buttons are rendered
    expect(screen.getByTestId("back-id")).toBeInTheDocument();
    expect(screen.getByTestId("Submit-id")).toBeInTheDocument();
  });

  it("calls backBtnClickHandler when Back button is clicked", () => {
    render(
      <BlueFormFooter
        isDisabled={false}
        backBtnClickHandler={mockBackClick}
        submitClickHandler={mockSubmitClick}
      />
    );

    // Simulate click event on Back button
    fireEvent.click(screen.getByTestId("back-id"));
    expect(mockBackClick).toHaveBeenCalledTimes(1);
  });

  it("calls submitClickHandler when Submit button is clicked and not disabled", () => {
    render(
      <BlueFormFooter
        isDisabled={false}
        backBtnClickHandler={mockBackClick}
        submitClickHandler={mockSubmitClick}
      />
    );

    // Simulate click event on Submit button
    fireEvent.click(screen.getByTestId("Submit-id"));
    expect(mockSubmitClick).toHaveBeenCalledTimes(1);
  });

  it("does NOT call submitClickHandler when Submit button is disabled", () => {
    render(
      <BlueFormFooter
        isDisabled={true}
        backBtnClickHandler={mockBackClick}
        submitClickHandler={mockSubmitClick}
      />
    );

    // Simulate click event on Submit button
    fireEvent.click(screen.getByTestId("Submit-id"));
    expect(mockSubmitClick).not.toHaveBeenCalled();
  });

  it("applies correct class when Submit button is enabled or disabled", () => {
    const { rerender } = render(
      <BlueFormFooter
        isDisabled={true}
        backBtnClickHandler={mockBackClick}
        submitClickHandler={mockSubmitClick}
      />
    );

    // Get Submit button and check for the disabled class
    const submitBtn = screen.getByTestId("Submit-id").closest("button");
    expect(submitBtn).toHaveClass("form-btn-disabled");

    // Rerender with Submit button enabled
    rerender(
      <BlueFormFooter
        isDisabled={false}
        backBtnClickHandler={mockBackClick}
        submitClickHandler={mockSubmitClick}
      />
    );

    // Get Submit button again and check for the enabled class
    const updatedSubmitBtn = screen.getByTestId("Submit-id").closest("button");
    expect(updatedSubmitBtn).toHaveClass("form-btn-enabled");
  });
});
