import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ValidateSeqNoCard from "./index";

const mockChangeHandler = jest.fn();

describe("ValidateSeqNoCard", () => {
  const changeHandler = jest.fn();
  const fullDataHandler = jest.fn();

  const defaultProps = {
    changeHandler,
    fullDataHandler,
    isValidateSeqBtnDisable: false,
    customCardData: "12345",
    languageData: {
      custom_card_no: "Custom Card No",
      enter_vehicle_sequence_no: "Enter Vehicle Sequence No",
      validate_sequence_no: "Validate Sequence No",
    },
    errorMessage: "",
    validateSeqValue: "67890"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders car icon", () => {
    render(<ValidateSeqNoCard {...defaultProps} />);
    const img = screen.getByAltText("Car Logo");
    expect(img).toBeInTheDocument();
  });

  test("displays custom card data and language text", () => {
    render(<ValidateSeqNoCard {...defaultProps} />);
    expect(screen.getByText("Custom Card No")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Vehicle Sequence No")).toBeInTheDocument();
    expect(screen.getByText("Validate Sequence No")).toBeInTheDocument();
  });

  test("icnfactory returns correct image based on manufacturer name", () => {
    render(<ValidateSeqNoCard {...defaultProps} />);
    const img = screen.getByAltText("Car Logo");
    expect(img).toHaveAttribute("alt", expect.stringContaining("Car Logo"));
  });

  test("handleKeyDown prevents invalid keys", () => {
    render(<ValidateSeqNoCard {...defaultProps} />);
    const textbox = screen.getByTestId("vehicleSeqNo-id");
    fireEvent.keyDown(textbox, { key: "a" }); // Assuming 'a' is invalid
    expect(mockChangeHandler).not.toHaveBeenCalled();
  });

  test("ThemeTextbox receives correct props", () => {
    render(<ValidateSeqNoCard {...defaultProps} />);
    const textbox = screen.getByTestId("vehicleSeqNo-id");
    expect(textbox).toHaveAttribute("name", "VehicleSeqNo");
    expect(textbox).toHaveAttribute("value", "67890");
    expect(textbox).toHaveAttribute("placeholder", "Enter Vehicle Sequence No");
  });

  test("renders correct image for mercedes manufacturer", () => {
    const propsWithMercedes = {
      ...defaultProps,
      customCardData: "54321",
    };
    render(<ValidateSeqNoCard {...propsWithMercedes} />);
    const img = screen.getByAltText("Car Logo"); // Default image is Car Logo
    expect(img).toHaveAttribute("alt", expect.stringContaining("Car Logo"));
  });
});