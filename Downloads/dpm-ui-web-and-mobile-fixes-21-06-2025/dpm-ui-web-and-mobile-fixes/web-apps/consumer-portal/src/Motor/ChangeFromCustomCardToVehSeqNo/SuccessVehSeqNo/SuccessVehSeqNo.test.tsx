import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import SuccessVehSeqNo from "./index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("SuccessVehSeqNo Component", () => {
  const mockNavigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

  const defaultProps = {
    customCardValue: "12345",
    validateSeqValue: "67890",
    policyNumber: "POL123456",
    effectiveDate: "2025-03-24",
    languageData: {
      success: "Success",
      successMsgChangeToSequenceNumber:
        "<< customCardNo >> has been changed to << vehicleSequenceNo >> for policy << policyNo >>",
      custom_card_no: "Custom Card No",
      vehicle_sequence: "Vehicle Sequence",
      go_to_dashboard: "Go to Dashboard",
      back_to_policyDetails: "Back to Policy Details",
    },
  };

  test("renders the component with given props", () => {
    render(<SuccessVehSeqNo {...defaultProps} />);
    expect(screen.getByTestId("SuccessVehSeqNo-test")).toBeInTheDocument();
    expect(
      screen.getByText(
        `${defaultProps.customCardValue} has been changed to ${defaultProps.validateSeqValue} for policy ${defaultProps.policyNumber}`
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Custom Card No")).toBeInTheDocument();
    expect(screen.getByText("Vehicle Sequence")).toBeInTheDocument();
    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Back to Policy Details")).toBeInTheDocument();
  });

  test("renders with missing languageData", () => {
    const propsWithoutLanguageData = { ...defaultProps, languageData: undefined };
    render(<SuccessVehSeqNo {...propsWithoutLanguageData} />);
    expect(screen.getByTestId("SuccessVehSeqNo-test")).toBeInTheDocument();
    expect(screen.queryByText("Success")).toBeNull();
    expect(screen.queryByText("Go to Dashboard")).toBeNull();
    expect(screen.queryByText("Back to Policy Details")).toBeNull();
  });

  test("renders with missing customCardValue and validateSeqValue", () => {
    const propsWithMissingValues = {
      ...defaultProps,
      customCardValue: null,
      validateSeqValue: null,
    };
    render(<SuccessVehSeqNo {...propsWithMissingValues} />);
    expect(screen.getByTestId("SuccessVehSeqNo-test")).toBeInTheDocument();
  });

  test("calls navigate to dashboard on button click", () => {
    render(<SuccessVehSeqNo {...defaultProps} />);
    const dashboardButton = screen.getByText("Go to Dashboard");
    fireEvent.click(dashboardButton);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("calls navigate back on button click", () => {
    render(<SuccessVehSeqNo {...defaultProps} />);
    const backButton = screen.getByText("Back to Policy Details");
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("renders vehicle icon based on manufacturer", () => {
    const propsWithNissan = { ...defaultProps, customCardValue: "nissan" };
    render(<SuccessVehSeqNo {...propsWithNissan} />);
    const nissanIcon = screen.getByAltText("nissan");
    expect(nissanIcon).toBeInTheDocument();
  });
});