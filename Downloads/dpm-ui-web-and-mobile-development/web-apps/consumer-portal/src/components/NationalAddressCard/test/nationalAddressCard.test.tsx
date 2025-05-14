import { render, screen, fireEvent } from "@testing-library/react";
import { NationalAddressCard } from "../index";
import { useCommonContext } from "@dpm/shared-module";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { MemoryRouter } from "react-router-dom";

jest.mock("@dpm/shared-module", () => ({
  useCommonContext: jest.fn(),
  stringToBoolean: jest.fn((val) => val === "true"),
}));

jest.mock("context/PHQuoteBuyContext", () => ({
  usePHQuoteBuyContext: jest.fn(),
}));

describe("NationalAddressCard Component", () => {
  beforeEach(() => {
    useCommonContext.mockReturnValue({
      currentLanguage: "en",
    });

    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      homeConfig: {
        select_your_property: "Select Your Property",
        property: "Property",
        national_address: "National Address",
        placeholder_detail: "Details",
        map_label: "Map",
      },
      formAddressSelection: { propertyNo: "0", propertyNearCoastline: { activeIndex: 1 } },
      setFormAddressSelection: jest.fn(),
      resetFormAddressSelection: jest.fn(),
      resetPropertyCoodinates: jest.fn(),
      setShowPropertyMap: jest.fn(),
      showPropertyMap: { show: false },
    });
  });

  it("renders the NationalAddressCard component correctly", () => {
    const addressData = {
      addresses: [
        {
          buildingNumber: "123",
          streetENG: "Main St",
          districtENG: "Central",
          cityENG: "Metropolis",
          postCode: "12345",
          additionalNumber: "678",
          regionNameENG: "North",
          isPrimaryAddress: "true",
          latitude: "12.34",
          longitude: "56.78",
        },
        {
          buildingNumber: "456",
          streetENG: "Second St",
          districtENG: "Downtown",
          cityENG: "Metropolis",
          postCode: "67890",
          additionalNumber: "101",
          regionNameENG: "South",
          isPrimaryAddress: "false",
          latitude: "22.34",
          longitude: "66.78",
        },
      ],
    };

    render(
      <MemoryRouter>
        <NationalAddressCard addressData={addressData} />
      </MemoryRouter>
    );

    expect(screen.getByText("Select Your Property")).toBeInTheDocument();
    expect(screen.getByText("Property 1")).toBeInTheDocument();
    expect(screen.getByText("Property 2")).toBeInTheDocument();
  });

  it("selects the primary address first", () => {
    const addressData = {
      addresses: [
        { buildingNumber: "123", isPrimaryAddress: "false" },
        { buildingNumber: "456", isPrimaryAddress: "true" },
      ],
    };

    render(
      <MemoryRouter>
        <NationalAddressCard addressData={addressData} />
      </MemoryRouter>
    );

    const firstProperty = screen.getByLabelText("1");
    expect(firstProperty).toBeChecked();
  });

  it("calls property selection handler on radio button change", () => {
    const addressData = {
      addresses: [
        { buildingNumber: "123", isPrimaryAddress: "true" },
        { buildingNumber: "456", isPrimaryAddress: "false" },
      ],
    };

    const mockHandlePropertySelection = jest.fn();

    jest.mock("../../hooks/usePropertSelection", () => ({
      usePropertySelection: () => ({ handlePropertySelection: mockHandlePropertySelection }),
    }));

    render(
      <MemoryRouter>
        <NationalAddressCard addressData={addressData} />
      </MemoryRouter>
    );

    const secondProperty = screen.getByLabelText("2");
    fireEvent.click(secondProperty);

    expect(mockHandlePropertySelection).toHaveBeenCalled();
  });
});
