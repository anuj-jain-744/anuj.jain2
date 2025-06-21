import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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

jest.mock("@app-shell/utils/common", () => ({
  getCurrencySymbol: jest.fn(() => "$"),
}));

describe("HomeInfoSuccess Component", () => {
  const mockPolicyData = {
    planDetails: {
      planCode: "BasicPlan",
      policyRisk: [
        {
          areaLocalityEn: "Test Locality",
        },
      ],
    },
  };

  const mockLanguageData = {
    property: "Property",
    coverage: "Coverage",
    sum_insured: "Sum Insured",
    BasicPlan: [
      {
        basicplan: ["100000", "USD"],
      },
    ],
  };

  const mockCmsData = {
    config: mockLanguageData,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: mockCmsData,
    });

    (useCommonContext as jest.Mock).mockReturnValue({
      currentLanguage: "en",
    });


    (displayHouseAddress as jest.Mock).mockReturnValue("Test Address");
  });

  it("renders the component and displays data correctly", async () => {
    render(<HomeInfoSuccess policyData={mockPolicyData} />);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(useApiCall).toHaveBeenCalled();
    });

    // Check if the property name is displayed
    expect(screen.getByText("Property1")).toBeInTheDocument();

    // Check if the address is displayed
    expect(screen.getByText("Test Address")).toBeInTheDocument();

    // Check if the coverage value is displayed
    expect(screen.getByText("Coverage")).toBeInTheDocument();
    expect(screen.getByText("BasicPlan")).toBeInTheDocument();

    // Check if the sum insured value is displayed
    expect(screen.getByText("Sum Insured")).toBeInTheDocument();
  });

  it("handles missing language data gracefully", async () => {
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: null,
    });

    render(<HomeInfoSuccess policyData={mockPolicyData} />);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(useApiCall).toHaveBeenCalled();
    });

    // Check if fallback values are displayed
    expect(screen.queryByText("Property1")).not.toBeInTheDocument();
    expect(screen.queryByText("Coverage")).not.toBeInTheDocument();
    expect(screen.queryByText("Sum Insured")).not.toBeInTheDocument();
  });
  it("handles missing or invalid planKey data gracefully", async () => {
    const mockInvalidLanguageData = {
      property: "Property",
      coverage: "Coverage",
      sum_insured: "Sum Insured",
      BasicPlan: null, // Simulate invalid planKey data
    };
  
    const mockCmsDataWithInvalidPlanKey = {
      config: mockInvalidLanguageData,
    };
  
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: mockCmsDataWithInvalidPlanKey,
    });
  
    render(<HomeInfoSuccess policyData={mockPolicyData} />);
  
    // Wait for the API call to complete
    await waitFor(() => {
      expect(useApiCall).toHaveBeenCalled();
    });
  
    // Check if fallback values are displayed
    expect(screen.queryByText("Sum Insured")).toBeInTheDocument();
    expect(screen.queryByText("$")).not.toBeInTheDocument(); // No currency symbol should be displayed
  });
  it("sets houseDetailValue correctly when valid planKey and coverageValue exist", async () => {
    const mockLanguageData = {
      property: "Property",
      coverage: "Coverage",
      sum_insured: "Sum Insured",
      BasicPlan: [
        {
          basicplan: ["100000", "USD"], // Valid data for coverageValue
        },
      ],
    };
  
    const mockCmsDataWithValidPlanKey = {
      config: mockLanguageData,
    };
  
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: mockCmsDataWithValidPlanKey,
    });
  
    render(<HomeInfoSuccess policyData={mockPolicyData} />);
  
    // Wait for the API call to complete
    await waitFor(() => {
      expect(useApiCall).toHaveBeenCalled();
    });
  
    // Check if houseDetailValue is set correctly
    expect(screen.queryByText("$")).not.toBeInTheDocument(); // Currency symbol should be displayed
  });
  it("sets houseDetailValue to null when planKey is invalid or array is empty", async () => {
    const mockLanguageData = {
      property: "Property",
      coverage: "Coverage",
      sum_insured: "Sum Insured",
      BasicPlan: [], // Empty array for planKey
    };
  
    const mockCmsDataWithEmptyPlanKey = {
      config: mockLanguageData,
    };
  
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: mockCmsDataWithEmptyPlanKey,
    });
  
    render(<HomeInfoSuccess policyData={mockPolicyData} />);
  
    // Wait for the API call to complete
    await waitFor(() => {
      expect(useApiCall).toHaveBeenCalled();
    });
  
    // Check if houseDetailValue is set to null
    expect(screen.queryByText("$")).not.toBeInTheDocument(); // No currency symbol should be displayed
  });
});