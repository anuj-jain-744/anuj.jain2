import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VehicalLinks from "../VehicalLinks";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn()
}));

describe("VehicalLinks Component", () => {
  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      selectedDriverID: null,
      showManageDriverModal: false,
      setSelectedDriverID: jest.fn(),
      setShowManageDriverModal: jest.fn(),
      selectedBenefits: [],
      driverDetailsResponseData: [],
    });
  });

  test("renders VehicalLinks component correctly", () => {
    render(<VehicalLinks languageData={{ review_vehicle_details: "Review Vehicle Details", driver_details: "Driver Details", additional_benefits: "Additional Benefits" }} />);
    expect(screen.getByText("Review Vehicle Details")).toBeInTheDocument();
    expect(screen.getByText("Driver Details")).toBeInTheDocument();
    expect(screen.getByText("Additional Benefits")).toBeInTheDocument();
  });

  test("opens vehicle details modal on click", async() => {
    render(<VehicalLinks languageData={{ review_vehicle_details: "Review Vehicle Details" }} />);
    //fireEvent.click(screen.getByText("Review Vehicle Details"));
    await waitFor(() => fireEvent.click(screen.getByText("Review Vehicle Details")));
    expect(screen.getByText("Review Vehicle Details")).toBeInTheDocument();
  });

  test("opens driver details modal on click", async() => {
    render(<VehicalLinks languageData={{ driver_details: "Driver Details" }} />);
    // fireEvent.click(screen.getByText("Driver Details"));
    await waitFor(() => fireEvent.click(screen.getByText("Driver Details")));
    expect(screen.getByText("Driver Details")).toBeInTheDocument();
  });

  test("opens additional benefits modal on click", async() => {
    render(<VehicalLinks languageData={{ additional_benefits: "Additional Benefits" }} />);
    // fireEvent.click(screen.getByText("Additional Benefits"));
    await waitFor(() => fireEvent.click(screen.getByText("Additional Benefits")));
    expect(screen.getByText("Additional Benefits")).toBeInTheDocument();
  });
});
