import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import NationalAddress from "./index";
import { useCommonContext } from "@dpm/shared-module";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { LanguageData } from "types/languageData";

// Mock the contexts
jest.mock("@dpm/shared-module", () => ({
  useCommonContext: jest.fn(),
}));

jest.mock("context/PHQuoteBuyContext", () => ({
  usePHQuoteBuyContext: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

const mockLanguageData: LanguageData = {
  property: "Property",
  property_type: "Property Type",
  national_address: "National Address",
  number_of_floors: "Number of Floors",
  age_of_building: "Age of Building",
  property_form_values_string: {
    type_form: {
      option: ["Type 1", "Type 2"],
    },
  },
};

const mockFormAddressSelection = {
  propertyNo: "1",
  propertyType: { activeIndex: 0 },
  propertyFloor: "5",
  propertyBuildYear: "2000",
};

const mockAddressData = {
  buildingNumber: "123",
  streetENG: "Main St",
  streetAR: "الشارع الرئيسي",
  districtENG: "Downtown",
  districtAR: "وسط المدينة",
  cityENG: "City",
  cityAR: "المدينة",
  postCode: "12345",
  additionalNumber: "678",
  regionNameENG: "Region",
  regionNameAR: "المنطقة",
};

describe("NationalAddress Component", () => {
  beforeEach(() => {
    (useCommonContext as jest.Mock).mockReturnValue({
      currentLanguage: "en",
    });

    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      formAddressSelection: mockFormAddressSelection,
    });

    (useLocation as jest.Mock).mockReturnValue({
      state: { data: { addressData: { addresses: [mockAddressData] } } },
    });
  });

  it("renders NationalAddress component correctly", () => {
    render(
      <Router>
        <NationalAddress languageData={mockLanguageData} />
      </Router>
    );

    expect(screen.getByText("Property")).toBeInTheDocument();
    expect(screen.getByText("Property Type")).toBeInTheDocument();
    expect(screen.getByText("National Address")).toBeInTheDocument();
    expect(screen.getByText("Number of Floors")).toBeInTheDocument();
    expect(screen.getByText("Age of Building")).toBeInTheDocument();
    expect(screen.getByText("Type 1")).toBeInTheDocument();
    expect(screen.getByText("123, Main St, Downtown, City, 12345, 678, Region")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("21 Yrs.")).toBeInTheDocument(); // Assuming the current year is 2021
  });
});