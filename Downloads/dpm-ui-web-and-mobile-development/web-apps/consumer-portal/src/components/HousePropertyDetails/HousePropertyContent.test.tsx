import { render, screen } from "@testing-library/react";
import HousePropertyContent from "./HousePropertyContent"; // Default import
import { useCommonContext } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";

// Mock the context hook
jest.mock("@dpm/shared-module", () => ({
  useCommonContext: jest.fn(),
}));

// Mock the data to simulate test cases
const mockLanguageData: LanguageData = {
  property: "Property",
};

const mockHousePropertyData = [
  { label: "Area", value: "100m²" },
  { label: "Price", value: "$100,000" },
];

const mockHousePropertyAddress = {
  buildingNumber: "123",
  streetAR: "شارع الملك",
  streetENG: "King Street",
  districtAR: "المنطقة الشرقية",
  districtENG: "Eastern District",
  cityAR: "الرياض",
  cityENG: "Riyadh",
  postCode: "12345",
  additionalNumber: "B2",
  regionNameAR: "المنطقة الوسطى",
  regionNameENG: "Central Region",
};

describe("HousePropertyContent", () => {
  beforeEach(() => {
    // Mock the current language (ar for Arabic, en for English)
    useCommonContext.mockReturnValue({ currentLanguage: "en" });
  });

  it("should render the property number and house property data", () => {
    render(
      <HousePropertyContent
        housePropertyData={mockHousePropertyData}
        languageData={mockLanguageData}
        housePropertyAddress={mockHousePropertyAddress}
      />
    );

    // Check if the property number is rendered correctly
    expect(screen.getByText("Property 1")).toBeInTheDocument();

    // Check if the house property data is rendered correctly
    mockHousePropertyData.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });

  it("should render the house address in English when current language is English", () => {
    render(
      <HousePropertyContent
        housePropertyData={mockHousePropertyData}
        languageData={mockLanguageData}
        housePropertyAddress={mockHousePropertyAddress}
      />
    );

    // Check if the address is rendered correctly in English
    expect(screen.getByText("123 King Street, Eastern District, Riyadh, 12345, B2, Central Region")).toBeInTheDocument();
  });

  it("should render the house address in Arabic when current language is Arabic", () => {
    useCommonContext.mockReturnValue({ currentLanguage: "ar" }); // Set the language to Arabic

    render(
      <HousePropertyContent
        housePropertyData={mockHousePropertyData}
        languageData={mockLanguageData}
        housePropertyAddress={mockHousePropertyAddress}
      />
    );

    // Check if the address is rendered correctly in Arabic
    expect(screen.getByText("123 شارع الملك, المنطقة الشرقية, الرياض, 12345, B2, المنطقة الوسطى")).toBeInTheDocument();
  });

  it("should render 'Property' text with the correct number", () => {
    render(
      <HousePropertyContent
        housePropertyData={mockHousePropertyData}
        languageData={mockLanguageData}
        housePropertyAddress={mockHousePropertyAddress}
      />
    );

    // Verify that the text 'Property 1' is rendered correctly
    expect(screen.getByText("Property 1")).toBeInTheDocument();
  });

  it("should render the correct labels and values for the house property data", () => {
    render(
      <HousePropertyContent
        housePropertyData={mockHousePropertyData}
        languageData={mockLanguageData}
        housePropertyAddress={mockHousePropertyAddress}
      />
    );

    // Check that each label and value from housePropertyData is displayed
    mockHousePropertyData.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });

  it("should not render house address if not provided", () => {
    render(
      <HousePropertyContent
        housePropertyData={mockHousePropertyData}
        languageData={mockLanguageData}
        housePropertyAddress={null}
      />
    );

    // Ensure address is not rendered when no address is provided
    expect(screen.queryByText(/street/i)).not.toBeInTheDocument();
  });
});
