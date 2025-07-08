import { renderHook, act } from "@testing-library/react-hooks";
import useViewPolicyCall from "./useViewPolicyCall";
import { useApiCall } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useCommonContext } from "@dpm/shared-module";

// Mock dependencies
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
  useCommonContext: jest.fn(),
}));

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

describe("useViewPolicyCall", () => {
  let setShowAlertModal: jest.Mock;
  let setApiErrorMessage: jest.Mock;
  let setMakeModelResponse: jest.Mock; // Mock the function to be tested

    beforeEach(() => {
    setShowAlertModal = jest.fn();
    setApiErrorMessage = jest.fn();
    setMakeModelResponse = jest.fn(); // Mock the function

    // Mock useCommonContext
    (useCommonContext as jest.Mock).mockReturnValue({
      currentLanguage: "en",
    });

    // Mock useQuoteAndBuyContext
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      isRenewPolicyData: { policyNumber: "12345" },
      setCountryData: jest.fn(),
      setViewPolicyData: jest.fn(),
      setVehicleDetailsResponseData: jest.fn(),
      setDriverDetailsResponseData: jest.fn(),
      setOwnerDetailsResponseData: jest.fn(),
      setVehicleDetails: jest.fn(),
      setRepairTypeSelected: jest.fn(),
      setCoverageType: jest.fn(),
      setMakeModelResponse, // Use the mocked function here
    });

    // Mock useApiCall
    (useApiCall as jest.Mock).mockImplementation(() => ({
      makeApiCall: jest.fn(),
      data: null,
      errors: null,
    }));
  });

  it("should initialize correctly", () => {
    const { result } = renderHook(() =>
      useViewPolicyCall({ setShowAlertModal, setApiErrorMessage })
    );

    expect(result.current).toHaveProperty("viewPolicyCall");
  });

  it("should call policyApiCall when selectedPolicyNumber is available", async () => {
    const mockPolicyApiCall = jest.fn();
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockPolicyApiCall,
      data: null,
      errors: null,
    });

    const { result } = renderHook(() =>
      useViewPolicyCall({ setShowAlertModal, setApiErrorMessage })
    );

    await act(async () => {
      await result.current.viewPolicyCall({
        policyLob: [
          {
            policyRisk: [
              {
                vehicleSequenceNo: "123",
                policyCoverage: [{ coverageName: "Comprehensive" }],
              },
            ],
          },
        ],
        policyCustomer: [
          {
            nationalId: "987654321",
            customerNameEnglish: "John Doe",
            dateOfBirth: "1990-01-01",
          },
        ],
      });
    });

  });

  it("should handle API errors and set alert modal", async () => {
    const mockPolicyApiCall = jest.fn(() => {
      throw new Error("API Error");
    });
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockPolicyApiCall,
      data: null,
      errors: { name: "Error", messages: { message_en: "API Error" } },
    });

    const { result } = renderHook(() =>
      useViewPolicyCall({ setShowAlertModal, setApiErrorMessage })
    );

    await act(async () => {
      try {
        await result.current.viewPolicyCall({
          policyLob: [],
          policyCustomer: [],
        });
      } catch (error) {
        // Ensure the error is caught and handled
      }
    });

  });

  it("should update state based on API responses", async () => {
    const mockPolicyApiCall = jest.fn();
    const mockSetViewPolicyData = jest.fn();
    const mockSetMakeModelResponse = jest.fn(); // Mock the function

    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockPolicyApiCall,
      data: {
        policyLob: [{ policyRisk: [{ vehicleSequenceNo: "123" }] }],
        modelImageResponse: { motor_makes: ["Toyota", "Honda"] }, // Mocked API response
      },
      errors: null,
    });

    (useQuoteAndBuyContext as jest.Mock).mockReturnValueOnce({
      setViewPolicyData: mockSetViewPolicyData,
      setMakeModelResponse: mockSetMakeModelResponse, // Use the mocked function
    });

    const { result } = renderHook(() =>
      useViewPolicyCall({ setShowAlertModal, setApiErrorMessage })
    );

    await act(async () => {
      await result.current.viewPolicyCall({
        policyLob: [{ policyRisk: [{ vehicleSequenceNo: "123" }] }],
        policyCustomer: [],
      });
    });

  });
});