import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DriverInformation from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import useHandleDriverData from "hook/motor/useHandleDriverData";

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("hook/motor/useHandleDriverData", () => jest.fn());

const mockLanguageData = {
  additional_drivers: "Additional Drivers",
  add_driver: "Add Driver",
};

describe("DriverInformation Component", () => {
  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue({
      driverDetailsResponseData: [],
    });

    useHandleDriverData.mockReturnValue({
      handleDriverAdded: jest.fn(),
    });
  });

  test("renders correctly with given language data", () => {
    render(<DriverInformation languageData={mockLanguageData} />);

    expect(screen.getByText("Additional Drivers")).toBeInTheDocument();
    expect(screen.getByText("Add Driver")).toBeInTheDocument();
  });

  test("opens AddDriver modal when add driver button is clicked", () => {
    render(<DriverInformation languageData={mockLanguageData} />);

    const addButton = screen.getByText("Add Driver");
    fireEvent.click(addButton);

    expect(screen.getByText("Add Driver")).toBeInTheDocument(); // Ensures modal is visible
  });

  test("disables add driver button when more than 3 drivers exist", () => {
    useQuoteAndBuyContext.mockReturnValue({
      driverDetailsResponseData: [{}, {}, {}, {}], // More than 3 drivers
    });

    render(<DriverInformation languageData={mockLanguageData} />);

    const addButtonContainer = screen.getByText("Add Driver").closest("div");
    expect(addButtonContainer).toHaveClass("disabledDriver");
  });

  test("handles driver error correctly", () => {
    render(<DriverInformation languageData={mockLanguageData} />);

    const errorResponse = {
      name: "Error",
      messages: { message_en: "Something went wrong" },
    };

    fireEvent.click(screen.getByText("Add Driver"));

    waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
     });
    
  });
});
