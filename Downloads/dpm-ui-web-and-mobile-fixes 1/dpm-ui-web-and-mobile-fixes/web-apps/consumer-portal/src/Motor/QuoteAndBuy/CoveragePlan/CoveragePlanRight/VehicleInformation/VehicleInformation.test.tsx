import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VehicleInformation from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getModelIcon } from "utils/getModelIcon";
import { getPlateNumber } from "utils/getPlateNumber";
import DriverInformation from "./DriverInformation";

// Mock required dependencies
jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("utils/getModelIcon");
jest.mock("utils/getPlateNumber");
jest.mock("./DriverInformation", () => () => <div data-testid="driver-info" />);

describe("VehicleInformation Component", () => {
  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      vehicleDetails: {
        vehicleCustomID: "12345",
        vehicleSequenceNo: "67890",
      },
      vehicleDetailsResponseData: {
        make: "Toyota",
        manufactureYear: "2022",
        chassisNumber: "CH12345678",
      },
      makeModelResponse: [],
    });

    (getModelIcon as jest.Mock).mockReturnValue("mocked-icon-url");
    (getPlateNumber as jest.Mock).mockReturnValue("ABC-1234");
  });

  test("renders VehicleInformation component", () => {
    render(<VehicleInformation languageData={{ no_plate: "Plate Number", registration_year_label: "Manufacture Year", chasis_no: "Chassis Number", custom_card_no: "Custom ID", vehicle_sequence: "Vehicle Sequence", not_applicable: "N/A" }} />);

    // Check if VehicleInformation renders
    expect(screen.getByText("Toyota")).toBeInTheDocument();
    waitFor(() => expect(screen.getByText("ABC-1234")).toBeInTheDocument());   
    
    expect(screen.getByText("2022")).toBeInTheDocument();
    expect(screen.getByText("CH12345678")).toBeInTheDocument();

    // Check if the accordion is open by default
    expect(screen.getByRole("button")).toHaveClass("accordion-button");

    // Check if DriverInformation is rendered
    expect(screen.getByTestId("driver-info")).toBeInTheDocument();
  });

  test("toggles accordion on click", async () => {
    render(<VehicleInformation languageData={{}} />);

    const accordionButton = screen.getByRole("button");
    expect(accordionButton).toHaveClass("accordion-button");

    // Simulate accordion closing
    await userEvent.click(accordionButton);
    expect(accordionButton).toHaveClass("accordion-button");

    // Simulate accordion opening
    await userEvent.click(accordionButton);
    expect(accordionButton).toHaveClass("accordion-button");
  });
});