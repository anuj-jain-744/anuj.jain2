import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RepairType from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";

jest.mock("components/hooks/useQuoteAndBuyContext");
const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

jest.mock("@dpm/shared-module");
const mockUseApiCall = useApiCall as jest.Mock;

describe("RepairType Component", () => {
  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      setRepairTypeSelected: jest.fn(),
      repairTypeSelected: "Workshop Repair",
      compWorkShop: { pricingOptions: [] },
      compAgency: { pricingOptions: [] },
      compMath: { pricingOptions: [] },
      workShopInitialPrice: 1000,
      setWorkShopInitialPrice: jest.fn(),
      mathInitialPrice: 2000,
      setMathInitialPrice: jest.fn(),
      agencyInitialPrice: 3000,
      setAgencyInitialPrice: jest.fn(),
      setComprehensiveCardPrice: jest.fn(),
      sliderValueDeductibles: 500,
    });

    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: {
        config: [
          {
            repair_type: "Repair Type",
            sar: "SAR",
            viewBenefits: "View Benefits",
            selectRepairType: "Select Repair Type",
          },
        ],
      },
    });
  });

  test("renders RepairType component", () => {
    render(<RepairType onRepairTypeChecked={jest.fn()} />);
    expect(screen.getByText("Select Repair Type (3)")).toBeInTheDocument();
  });

  test("renders repair options", () => {
    render(<RepairType onRepairTypeChecked={jest.fn()} />);
    expect(screen.getByText("Workshop Repair")).toBeInTheDocument();
    expect(screen.getByText("Mawthoq Repair")).toBeInTheDocument();
    expect(screen.getByText("Agency Repair")).toBeInTheDocument();
  });

  test("selects repair type on click", () => {
    const { setRepairTypeSelected } = mockUseQuoteAndBuyContext();
    render(<RepairType onRepairTypeChecked={jest.fn()} />);
    const repairOption = screen.getByText("Mawthoq Repair");
    fireEvent.click(repairOption);
    expect(setRepairTypeSelected).toHaveBeenCalledWith("Mawthoq Repair");
  });

  test("opens and closes the modal", () => {
    render(<RepairType onRepairTypeChecked={jest.fn()} />);
    const tooltipIcon = screen.getByAltText("Tooltip_Logo");
    fireEvent.click(tooltipIcon);
    expect(screen.getByText("Repair Type")).toBeInTheDocument();
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);
    expect(screen.queryByText("Repair Type")).toBeInTheDocument();
  });

  test("opens and closes the ViewBenefitModal", () => {
    render(<RepairType onRepairTypeChecked={jest.fn()} />);
    const viewBenefitsLink = screen.getAllByText("View Benefits")[0];
    fireEvent.click(viewBenefitsLink);
    expect(screen.getAllByText("Workshop Repair")).toHaveLength(3);
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);
  });
});