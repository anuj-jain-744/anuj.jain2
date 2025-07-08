import { renderHook, act } from "@testing-library/react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";
import useDriverData, { formatDOB } from "./useDriverDetails";

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

describe("useDriverData Hook", () => {
  const mockSetDriverDetailsResponseData = jest.fn();
  const mockMakeApiCall = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      setDriverDetailsResponseData: mockSetDriverDetailsResponseData,
    });

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      isLoading: false,
      errors: null,
      data: null,
    });
  });


  it("should not call the API when mainDriverInd is 'Y' and vehicleId is missing", async () => {
    const driverDetails = {
      driverId: "123",
      dob: "01-01-1990",
      mainDriverInd: "Y",
      vehicleDefinitionType: "Car",
      vehicleId: "",
    };

    renderHook(() => useDriverData(driverDetails));

    // Wait for the timeout to trigger
    await act(async () => {
      jest.advanceTimersByTime(600);
    });

    expect(mockMakeApiCall).not.toHaveBeenCalled();
  });

  it("should update driver details response data when API call returns data", async () => {
    const driverDetails = {
      driverId: "123",
      dob: "01-01-1990",
      mainDriverInd: "N",
      vehicleDefinitionType: "Car",
      vehicleId: "456",
    };

    const mockDriverDetailsData = {
      driverID: "123",
      driverName: "John Doe",
    };

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      isLoading: false,
      errors: null,
      data: mockDriverDetailsData,
    });

    renderHook(() => useDriverData(driverDetails));

    // Wait for the timeout to trigger
    await act(async () => {
      jest.advanceTimersByTime(600);
    });

    expect(mockSetDriverDetailsResponseData).toHaveBeenCalledWith(
      expect.any(Function)
    );

    // Simulate the callback function
    const callback = mockSetDriverDetailsResponseData.mock.calls[0][0];
    const updatedDrivers = callback([{ driverID: "456" }]);

    expect(updatedDrivers).toEqual([
      { driverID: "456" },
      mockDriverDetailsData,
    ]);
  });

  it("should clear the timeout on unmount", () => {
    const driverDetails = {
      driverId: "123",
      dob: "01-01-1990",
      mainDriverInd: "N",
      vehicleDefinitionType: "Car",
      vehicleId: "456",
    };

    const { unmount } = renderHook(() => useDriverData(driverDetails));

    unmount();

    // Ensure no API call is made after unmount
    jest.advanceTimersByTime(600);
    expect(mockMakeApiCall).not.toHaveBeenCalled();
  });

  it("should format DOB correctly", () => {
    expect(formatDOB("01-01-1990")).toBe("01-1990");
    expect(formatDOB(undefined)).toBeUndefined();
  });
});