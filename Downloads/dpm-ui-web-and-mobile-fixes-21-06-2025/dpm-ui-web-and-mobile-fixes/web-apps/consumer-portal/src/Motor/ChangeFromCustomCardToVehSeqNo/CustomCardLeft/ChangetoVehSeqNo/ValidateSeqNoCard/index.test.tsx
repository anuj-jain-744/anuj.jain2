import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ValidateSeqNoCard from "./index";

const mockLanguageData = {
  custom_card_no: "Custom Card No",
  enter_vehicle_sequence_no: "Enter vehicle sequence no",
  validate_sequence_no: "Validate Sequence No",
};

describe("ValidateSeqNoCard", () => {
  const changeHandler = jest.fn();
  const fullDataHandler = jest.fn();

  const defaultProps = {
    changeHandler,
    fullDataHandler,
    isValidateSeqBtnDisable: false,
    customCardData: "ABC123",
    languageData: mockLanguageData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Nissan icon", () => {
    render(<ValidateSeqNoCard {...defaultProps} />);
    const img = screen.getByAltText("nissan");
    expect(img).toBeInTheDocument();
  });

  test("displays custom card data and language text", () => {
    render(<ValidateSeqNoCard {...defaultProps} />);
    expect(screen.getByText("Custom Card No")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

  test("renders input with correct placeholder and calls changeHandler on input change", () => {
    render(<ValidateSeqNoCard {...defaultProps} />);
    const input = screen.getByTestId("vehicleSeqNo-id");
    expect(input).toHaveAttribute("placeholder", "Enter vehicle sequence no");

    fireEvent.change(input, { target: { value: "1234" } });
    expect(changeHandler).toHaveBeenCalledTimes(1);
  });

  test("calls fullDataHandler with customCardData on button click", () => {
    render(<ValidateSeqNoCard {...defaultProps} />);
    const buttonWrapper = screen.getByTestId("validateSeqNoCard-dataHandler");
    fireEvent.click(buttonWrapper);
    expect(fullDataHandler).toHaveBeenCalledWith("ABC123");
  });

  test("button disabled state reflects isValidateSeqBtnDisable prop", () => {
    const { rerender } = render(
      <ValidateSeqNoCard {...defaultProps} isValidateSeqBtnDisable={true} />
    );
    const button = screen.getByTestId("validateSeqNoCard-dataHandler");
    expect(button).not.toBeDisabled();

    rerender(<ValidateSeqNoCard {...defaultProps} isValidateSeqBtnDisable={false} />);
    expect(button).not.toBeDisabled();
  });
});
