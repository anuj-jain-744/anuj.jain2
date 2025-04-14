import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import HomeInfoSuccess from "./HomeInfoSuccess";
import { useApiCall, useCommonContext } from "@dpm/shared-module";
import { displayHouseAddress } from "utils/quoteAndBuy";

// Mock dependencies
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
  useCommonContext: jest.fn(),
}));
jest.mock("utils/quoteAndBuy", () => ({
  displayHouseAddress: jest.fn(),
}));

describe("HomeInfoSuccess Component", () => {
  const mockMakeApiCall = jest.fn();
  const mockUseApiCall = {
    makeApiCall: mockMakeApiCall,
    data: null,
  };

  const mockUseCommonContext = {
    currentLanguage: "en",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useApiCall as jest.Mock).mockReturnValue(mockUseApiCall);
    (useCommonContext as jest.Mock).mockReturnValue(mockUseCommonContext);
    (displayHouseAddress as jest.Mock).mockReturnValue("Mocked Address");
  });

  it("renders without crashing", () => {
    render(<HomeInfoSuccess policyData={null} />);
    waitFor(() => { 
    expect(screen.getByText(/property/i)).toBeInTheDocument();
});
  });

  it("calls the API on mount", async () => {
    await act(async () => {
      render(<HomeInfoSuccess policyData={null} />);
    });
    expect(mockMakeApiCall).toHaveBeenCalled();
  });

  it("updates languageData when cmsData is available", async () => {
    const mockCmsData = {
      config: {
        property: "Property",
        coverage: "Coverage",
        sum_insured: "Sum Insured",
      },
    };
    (useApiCall as jest.Mock).mockReturnValue({
      ...mockUseApiCall,
      data: mockCmsData,
    });

    await act(async () => {
      render(<HomeInfoSuccess policyData={null} />);
    });

    expect(screen.getByText(/property/i)).toBeInTheDocument();
    expect(screen.getByText(/coverage/i)).toBeInTheDocument();
    expect(screen.getByText(/sum insured/i)).toBeInTheDocument();
  });

  it("renders address and plan details when policyData is provided", () => {
    const mockPolicyData = {
      policyHolderDetails: {
        address: {
          buildingNumber: "123",
          city: "City",
          cityInArabic: "مدينة",
          district: "District",
          streetName: "Street",
          streetNameInArabic: "شارع",
          districtNameInArabic: "حي",
          postCode: "12345",
        },
      },
      planDetails: {
        planCode: "Plan A",
      },
    };

    render(<HomeInfoSuccess policyData={mockPolicyData} />);

    expect(screen.getByText("Mocked Address")).toBeInTheDocument();
    expect(screen.getByText("Plan A")).toBeInTheDocument();
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(<HomeInfoSuccess policyData={null} />);
    expect(asFragment()).toMatchSnapshot();
  });
});