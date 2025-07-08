import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BottomSection from "./BottomSection";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { ErrorResponse } from "types/ErrorResponse";

// Mock the dependencies
jest.mock("components/hooks/useQuoteAndBuyContext");

jest.mock("components/ThemeButton/ThemeButton", () => ({
  __esModule: true,
  default: ({
    title,
    onClickhandler,
  }: {
    title: string;
    onClickhandler: () => void;
  }) => <button onClick={onClickhandler}>{title}</button>,
}));

jest.mock("Motor/QuoteAndBuy/DriverDetails/DriverDetails", () => ({
  __esModule: true,
  default: ({
    languageData,
  }: {
    languageData: {
      add_additional_driver_upto: string;
      add_driver: string;
      driver_details: string;
    };
  }) => <div>Driver Details: {languageData?.driver_details}</div>,
}));

jest.mock("components/AddDriver/index", () => ({
  AddDriver: ({
    showAddDriver,
    setShowAddDriver,
    onDriverAdded,
    onDriverAddedError,
  }: {
    showAddDriver: boolean;
    setShowAddDriver: (value: boolean) => void;
    onDriverAdded: (driver: {
      driverID: string;
      driverName: string;
      driverNameArabic: string;
      relationship: string;
      dateofBirth: string;
      gender: string;
    }) => void;
    onDriverAddedError: (error: ErrorResponse | { code: string; }) => void;
  }) => (
    <div>
      {showAddDriver && (
        <div>
          Add Driver Modal
          <button
            onClick={() => {
              onDriverAddedError({
                code: "123",
                name: "Error",
                messages: {
                  message_en: "Error adding driver",
                  message_ar: "خطأ في إضافة السائق",
                }
              });
              onDriverAddedError({
                code: "123"
              });
              onDriverAdded({
                driverID: "123",
                driverName: "John Doe",
                driverNameArabic: "جون دو",
                relationship: "Self",
                dateofBirth: "1990-01-01",
                gender: "Male",
              });
              setShowAddDriver(false);
            }}
          >
            Add Driver
          </button>
        </div>
      )}
    </div>
  ),
}));

const mockLanguageData = {
  add_additional_driver_upto: "Add up to 4 additional drivers",
  add_driver: "Add Driver",
  driver_details: "Driver Details",
};

describe("BottomSection", () => {
  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      driverDetails: [],
      setDriverDetails: jest.fn(),
      driverDetailsResponseData: [],
      setDriverDetailsResponseData: jest.fn(),
    });
  });

  it("renders correctly when onPopShow is true", () => {
    render(<BottomSection languageData={mockLanguageData} onPopShow={true} />);
    expect(
      screen.getByText("Driver Details: Driver Details")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Add up to 4 additional drivers")
    ).toBeInTheDocument();
    expect(screen.getByText("Add Driver")).toBeInTheDocument();
  });

  it("renders correctly when onPopShow is false", () => {
    render(<BottomSection languageData={mockLanguageData} onPopShow={false} />);
    expect(
      screen.getByText("Driver Details: Driver Details")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Add up to 4 additional drivers")
    ).toBeInTheDocument();
    expect(screen.getByText("Add Driver")).toBeInTheDocument();
  });

  it("opens AddDriver modal when Add Driver button is clicked", () => {
    render(<BottomSection languageData={mockLanguageData} onPopShow={false} handleClose={jest.fn()} />);
    fireEvent.click(screen.getByText("Add Driver"));
    expect(screen.getByText("Add Driver Modal")).toBeInTheDocument();
  });

  it("adds a new driver when AddDriver modal is submitted", async () => {
    const setDriverDetailsMock = jest.fn();
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      driverDetails: [],
      setDriverDetails: setDriverDetailsMock,
      driverDetailsResponseData: [],
      setDriverDetailsResponseData: setDriverDetailsMock,
      addDriverFormData: [],
      setAddDriverFormData: jest.fn(),
    });

    render(<BottomSection languageData={mockLanguageData} onPopShow={false} />);
    fireEvent.click(screen.getAllByText("Add Driver")[0]);

    fireEvent.click(screen.getAllByText("Add Driver")[1]);

    await waitFor(() => {
      expect(setDriverDetailsMock).toHaveBeenCalledWith([
        {
          "additionalDriverDetails": {
            "driverRelationship": undefined,
          },
          driverID: "123",
          driverName: "John Doe",
          driverNameArabic: "جون دو",
          relationship: "Self",
          dateofBirth: "1990-01-01",
          gender: "Male",
        },
      ]);
    });
  });

  it("closes AddDriver modal after adding a driver", async () => {
    render(<BottomSection languageData={mockLanguageData} onPopShow={false} />);
    fireEvent.click(screen.getAllByText("Add Driver")[0]);
    expect(screen.getByText("Add Driver Modal")).toBeInTheDocument();
  });
});
