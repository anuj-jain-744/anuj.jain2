import { renderHook } from "@testing-library/react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { mapCalculatePremiumPayload } from "./mapCalculatePremiumPayload";
import useCalculatePremiumPayload from "./useCalculatePremiumPayload";

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("./mapCalculatePremiumPayload", () => ({
  mapCalculatePremiumPayload: jest.fn(),
}));

describe("useCalculatePremiumPayload Hook", () => {
  const mockSetDriverDetailsResponseData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      vehicleDetailsResponseData: null,
      ownerDetailsResponseData: null,
      driverDetailsResponseData: null,
      setDriverDetailsResponseData: mockSetDriverDetailsResponseData,
      vehicleDetails: null,
      schemeCode: null,
      countryData: null,
    });
  });

  it("should filter out duplicate drivers in driverDetailsResponseData", () => {
    const mockDriverDetailsResponseData = [
      { driverID: "1", name: "Driver 1" },
      { driverID: "2", name: "Driver 2" },
      { driverID: "1", name: "Driver 1" }, // Duplicate
    ];

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      driverDetailsResponseData: mockDriverDetailsResponseData,
      setDriverDetailsResponseData: mockSetDriverDetailsResponseData,
    });

    renderHook(() => useCalculatePremiumPayload());

    expect(mockSetDriverDetailsResponseData).toHaveBeenCalledWith([
      { driverID: "1", name: "Driver 1" },
      { driverID: "2", name: "Driver 2" },
    ]);
  });

  it("should set requestPayload when all required data is available", () => {
    const mockVehicleDetailsResponseData = { vehicleID: "123" };
    const mockOwnerDetailsResponseData = { ownerID: "456" };
    const mockDriverDetailsResponseData = [{ driverID: "1", name: "Driver 1" }];
    const mockVehicleDetails = { make: "Toyota" };
    const mockCountryData = { countryID: "US" };
    const mockSchemeCode = "SCHEME123";
    const mockPolicyStartDate = "2023-01-01";

    const mockPayload = { premium: 100 };

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      vehicleDetailsResponseData: mockVehicleDetailsResponseData,
      ownerDetailsResponseData: mockOwnerDetailsResponseData,
      driverDetailsResponseData: mockDriverDetailsResponseData,
      setDriverDetailsResponseData: mockSetDriverDetailsResponseData,
      vehicleDetails: mockVehicleDetails,
      schemeCode: mockSchemeCode,
      countryData: mockCountryData,
      policyStartDate: mockPolicyStartDate,
    });

    (mapCalculatePremiumPayload as jest.Mock).mockReturnValue(mockPayload);

    const { result } = renderHook(() => useCalculatePremiumPayload());

    expect(mapCalculatePremiumPayload).toHaveBeenCalledWith(
      mockVehicleDetailsResponseData,
      mockDriverDetailsResponseData,
      mockOwnerDetailsResponseData,
      mockVehicleDetails,
      mockCountryData,
      mockSchemeCode,
      mockPolicyStartDate // Include policyStartDate in the assertion
    );

    expect(result.current).toEqual(mockPayload);
  });

  it("should not set requestPayload when required data is missing", () => {
    const { result } = renderHook(() => useCalculatePremiumPayload());

    expect(result.current).toBeNull();
    expect(mapCalculatePremiumPayload).not.toHaveBeenCalled();
  });
});