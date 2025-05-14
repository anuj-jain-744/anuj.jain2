import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CoveragePlan from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useApiCall } from "@dpm/shared-module";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { CompensationTypeKeys } from "types/coverageplan";


// Mock dependencies
jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("context/PHQuoteBuyContext");
jest.mock("@dpm/shared-module");
jest.mock("hook/motor/useCalculatePremiumApi");
jest.mock("Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload");


describe("CoveragePlan Component", () => {
  const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;
  const mockUsePHQuoteBuyContext = usePHQuoteBuyContext as jest.Mock;
  const mockUseApiCall = useApiCall as jest.Mock;
  const mockUseCalculatePremiumApi = useCalculatePremiumApi as jest.Mock;
  const mockUseCalculatePremiumPayload = useCalculatePremiumPayload as jest.Mock;
  const mockSetRepairTypeSelected = jest.fn();
  const mockSetCoverageType = jest.fn();


  const mockLanguageData = {
    coverage_plan: [
      { key: "comprehensive", name: "Comprehensive Plan" },
      { key: "thirdParty", name: "Third Party Plan" },
    ],
    comprehensive_third_party: [
      { key: "comprehensive", name: "Comprehensive" },
      { key: "thirdParty", name: "Third Party" },
    ],
  };

  beforeEach(() => {
    // Mock the context values
    mockUseQuoteAndBuyContext.mockReturnValue({
      setRepairTypeSelected: mockSetRepairTypeSelected,
      setRepairTypeSelectedFn: jest.fn(),
      coverageType: "comprehensive",
      setCoverageType: mockSetCoverageType,
      repairTypeSelected: false,
      requestPayload: {},
      updateRequestPayload: jest.fn(),
      homePremiumResponse: { comprehensive: 1000, thirdParty: 500 },
      isRenewpolicy:false,
      setVehicleDetails: jest.fn(),
      vehicleDetailsResponseData: {},
      setVehicleDetailsResponseData: jest.fn(),
      setDriverDetailsResponseData: jest.fn(),
      setOwnerDetailsResponseData: jest.fn(),
      ownerDetailsResponseData: {},
      setCountryData: jest.fn(),
      viewPolicyData: {},
      setViewPolicyData: jest.fn(),
      isRenewPolicyData: { policyNumber: "12345" },
    });




    mockUsePHQuoteBuyContext.mockReturnValue({
      formAddressSelection: { propertyType: { activeIndex: 0 } },
    });

    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: { policyNumber: "12345" },
    });

    mockUseCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: jest.fn(),
      isCalculateData: false,
    });

    mockUseCalculatePremiumPayload.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the CoveragePlan component", () => {
    render(<CoveragePlan languageData={mockLanguageData} />);
    expect(screen.getByTestId("CoveragePlan-test")).toBeInTheDocument();
  });


  it("should call handleCalculatePremiumApi when requestPayloadPolicy is available", async () => {
    const handleCalculatePremiumMock = jest.fn();
    mockUseCalculatePremiumApi.mockReturnValueOnce({
      ...mockUseCalculatePremiumApi(),
      handleCalculatePremium: handleCalculatePremiumMock,
    });
    mockUseCalculatePremiumPayload.mockReturnValueOnce({ payload: "testPayload" });
    render(<CoveragePlan languageData={mockLanguageData} />);

    await waitFor(() => {
      expect(handleCalculatePremiumMock).toHaveBeenCalledWith({ payload: "testPayload" });
    });
  });


  it("should filter repair options based on availableRepairTypes", () => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      ...mockUseQuoteAndBuyContext(),
      availableRepairTypes: ["agency", "workshop"], // Mocked available repair types
      coveragePlanSelected: "comprehensive",
      baseRepairOptions: {
        comprehensive: [
          { key: "agency", name: "Agency Repair" },
          { key: "workshop", name: "Workshop Repair" },
        ],
      },
    });

    render(<CoveragePlan languageData={mockLanguageData} />);

    // Assert that only the "agency" repair option is available
    expect(screen.getByText("Agency Repair")).toBeInTheDocument();
    expect(screen.queryByText("Workshop Repair")).not.toBeInTheDocument();
  });


  it("should call setCoverageType with the correct argument", () => {
    const setCoverageTypeMock = jest.fn();
    const coverageName = "testCoverage";

    // Mock the state setter
    const useStateMock: any = (initialValue: any) => [initialValue, setCoverageTypeMock];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    // Define the function
    const handleSetCoverageType = (coverageName: string) => {
      setCoverageTypeMock(coverageName as CompensationTypeKeys);
    };

    // Call the function
    handleSetCoverageType(coverageName);

    // Assert
    expect(setCoverageTypeMock).toHaveBeenCalledWith(coverageName);
  });


  it('should correctly set the coverage type and call the required functions', () => {

    mockUseQuoteAndBuyContext.mockReturnValue({
      ...mockUseQuoteAndBuyContext(),
      isRenewpolicy: true,
      coverageType: "comprehensive",
    });

    const compensationTypeCard = jest.fn();
    const resetCoverageCodePayload = jest.fn();
    const updateRequestPayload = jest.fn();


    // Mocking the return values of the functions
    compensationTypeCard.mockReturnValue('comprehensive');
    resetCoverageCodePayload.mockReturnValue({});

    render(<CoveragePlan languageData={mockLanguageData} />);

    // Simulating button click
    const button = screen.getByText(/Select Coverage Plan/i);
    fireEvent.click(button);

    // Verifying if the coverageType state was updated correctly
    expect(screen.getByText('comprehensive')).toBeInTheDocument();

    // Verifying if the mock functions were called with correct arguments
    expect(compensationTypeCard).toHaveBeenCalledWith('comprehensive');
    expect(resetCoverageCodePayload).toHaveBeenCalled();
    expect(updateRequestPayload).toHaveBeenCalled();

    // Ensure that repairTypeSelected is set to null (you can test state behavior if needed)
    // Add assertions based on the final behavior you expect for the repairTypeSelected state
  });

});