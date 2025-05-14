import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import HousePropertyDetails from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { MemoryRouter } from "react-router-dom";

// Mocking the child components
jest.mock("./HousePropertyContent", () => ({
  HousePropertyContent: jest.fn(() => <div>HousePropertyContent</div>),
}));

jest.mock("./HousePropertyLinks", () => ({
  HousePropertyLinks: jest.fn(() => <div>HousePropertyLinks</div>),
}));

jest.mock("./HousePremiumDetails", () => ({
  HousePremiumDetails: jest.fn(() => <div>HousePremiumDetails</div>),
}));

// Mocking the context hooks
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("context/PHQuoteBuyContext", () => ({
  usePHQuoteBuyContext: jest.fn(),
}));

// Mocked data for the tests
// Remove the unused variable 'mockedLanguageData'

const mockedContext = {
  policyStartDateAPI: "2025-01-01",
  repairTypeSelected: "repair",
  coverageType: "coverage",
  homePremiumResponse: {
    repair: { minFinalPrice: 5000 },
    coverage: { minFinalPrice: 10000 },
  },
};

const mockedFormAddressSelection = {
  propertyNo: "1",
  propertyFloor: "2",
  propertyBuildYear: 1990,
  propertyType: { activeIndex: 0 },
};

describe("HousePropertyDetails", () => {
  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue(mockedContext);
    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      formAddressSelection: mockedFormAddressSelection,
    });
  });

interface LanguageData {
    total_floors: string;
    age_of_building: string;
    property_type: string;
    sar: string;
    policy_period: string;
    premium_amount: string;
    property_form_values_string: {
        type_form: {
            option: string[];
        };
    };
    benefits: string[];
}

const mockedLanguageData: LanguageData = {
    total_floors: "Total Floors",
    age_of_building: "Age of Building",
    property_type: "Property Type",
    sar: "SAR",
    policy_period: "Policy Period",
    premium_amount: "Premium Amount",
    property_form_values_string: {
        type_form: {
            option: ["Option1", "Option2"],
        },
    },
    benefits: ["Benefit 1", "Benefit 2"],
};

  it("sets and displays the house property data correctly", async () => {
    render(
        <MemoryRouter>
        <HousePropertyDetails languageData={mockedLanguageData as unknown as import("c:/Users/vishal.bauri/Development/NewProject/dpm-ui-web-and-mobile/web-apps/consumer-portal/src/types/languageData").LanguageData} />
    </MemoryRouter>
    );

    // Check if the data passed to the child components is correct
    await waitFor(() => {
      // The component should correctly display the property data
      expect(screen.getByText("Total Floors")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Age of Building")).toBeInTheDocument();
      expect(screen.getByText("35 Yrs.")).toBeInTheDocument(); // Assuming the year difference is correct
      expect(screen.getByText("Property Type")).toBeInTheDocument();
      expect(screen.getByText("Option1")).toBeInTheDocument();
    });
  });

  it("sets and displays the house premium details correctly", async () => {
    render(
        <MemoryRouter>
            <HousePropertyDetails languageData={mockedLanguageData as unknown as import("c:/Users/vishal.bauri/Development/NewProject/dpm-ui-web-and-mobile/web-apps/consumer-portal/src/types/languageData").LanguageData} />
        </MemoryRouter>
    );

    // Check if the premium details are displayed
    await waitFor(() => {
      expect(screen.getByText("Benefit 1")).toBeInTheDocument();
      expect(screen.getByText("SAR 5000")).toBeInTheDocument(); // Using mocked premium data
      expect(screen.getByText("Benefit 2")).toBeInTheDocument();
      expect(screen.getByText("SAR 5000")).toBeInTheDocument();
      expect(screen.getByText("Policy Period")).toBeInTheDocument();
      expect(screen.getByText("01 Jan, 2025 - 01 Jan, 2026")).toBeInTheDocument(); // Using mocked start date
      expect(screen.getByText("Premium Amount")).toBeInTheDocument();
      expect(screen.getByText("SAR 5000")).toBeInTheDocument(); // Using mocked premium price
    });
  });

  it("handles undefined propsData and prevents crashes", async () => {
    const modifiedContext = { ...mockedContext, policyStartDateAPI: undefined };
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue(modifiedContext);

    render(
        <MemoryRouter>
        <HousePropertyDetails languageData={mockedLanguageData as unknown as import("c:/Users/vishal.bauri/Development/NewProject/dpm-ui-web-and-mobile/web-apps/consumer-portal/src/types/languageData").LanguageData} />
    </MemoryRouter>
    );

    // Check if the component doesn't crash with missing or undefined data
    await waitFor(() => {
      expect(screen.getByText("HousePropertyContent")).toBeInTheDocument();
    });
  });

  it("calculates the premium correctly based on context and languageData", () => {
    const premiumData = mockedContext.homePremiumResponse.repair;
    const price = premiumData.minFinalPrice;

    render(
        <MemoryRouter>
        <HousePropertyDetails languageData={mockedLanguageData as unknown as import("c:/Users/vishal.bauri/Development/NewProject/dpm-ui-web-and-mobile/web-apps/consumer-portal/src/types/languageData").LanguageData} />
    </MemoryRouter>
    );

    // Check if the premium price is displayed correctly
    expect(screen.getByText(`SAR ${price}`)).toBeInTheDocument();
  });
});
