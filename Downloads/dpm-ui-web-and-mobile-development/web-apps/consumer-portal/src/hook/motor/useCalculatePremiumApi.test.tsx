import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useCalculatePremiumApi } from "./useCalculatePremiumApi"; // Adjust path as needed
import { useApiCall } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { CalculatePremiumPayload } from "types/CalculatePremiumApiPayload";

// Mock necessary modules and hooks
jest.mock("@dpm/shared-module");
jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("utils/quoteAndBuy", () => ({
  updateCalculatePremiumPayload: jest.fn((key, value, payload) => ({
    ...payload,
    [key]: value,
  })),
  deepCopy: jest.fn((obj) => ({ ...obj })),
}));

describe("useCalculatePremiumApi", () => {
  let mockUseQuoteAndBuyContext;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock useApiCall with a factory function
    useApiCall.mockImplementation((_, url) => ({
      makeApiCall: jest.fn(() => Promise.resolve(null)), // Default: resolves to null
      errors: null,
      isLoading: false,
      data: null,
    }));

    // Mock context
    mockUseQuoteAndBuyContext = {
      setcompMath: jest.fn(),
      setcompAgency: jest.fn(),
      setcompWorkShop: jest.fn(),
      setcomp3rdParty: jest.fn(),
      setStepValue: jest.fn(),
      setMinDeductibleAmount: jest.fn(),
      setMaxDeductibleAmount: jest.fn(),
      setDeductibleAmounts: jest.fn(),
      setWorkShopInitialPrice: jest.fn(),
      setAgencyInitialPrice: jest.fn(),
      setMathInitialPrice: jest.fn(),
      setComprehensiveCardPrice: jest.fn(),
      setWsPremiumBreakdown: jest.fn(),
      setMathPremiumBreakdown: jest.fn(),
      setAgencyPremiumBreakdown: jest.fn(),
      setTpPremiumBreakdown: jest.fn(),
      setAvailableRepairTypes: jest.fn(),
    };

    useQuoteAndBuyContext.mockReturnValue(mockUseQuoteAndBuyContext);
  });

  it("should handle successful API calls", async () => {
    const mockData = { model: { pricingOptions: [{ deductibleAmount: 100 }] } };

    // Mock successful API responses
    useApiCall
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(mockData)), // Comp WorkShop
        errors: null,
        isLoading: false,
        data: mockData,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(mockData)), // Comp Math
        errors: null,
        isLoading: false,
        data: mockData,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(mockData)), // Comp Agency
        errors: null,
        isLoading: false,
        data: mockData,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(mockData)), // 3rd Party
        errors: null,
        isLoading: false,
        data: mockData,
      });

    const { result, waitFor } = renderHook(() => useCalculatePremiumApi());

    const payload = {
      vehicleDetails: { make: "Toyota", model: "Camry" },
      coverageType: "comprehensive",
      repairTypeSelected: "Workshop Repair",
      deductibleAmount: 100,
    };

    await act(async () => {
      await result.current.handleCalculatePremium(payload);
    });
  });

  it("should handle errors from API calls", async () => {
    const mockError = { messages: { message_en: "Test Error" } };

    // Mock one API with an error
    useApiCall
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.reject(mockError)),
        errors: mockError,
        isLoading: false,
        data: null,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(null)),
        errors: null,
        isLoading: false,
        data: null,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(null)),
        errors: null,
        isLoading: false,
        data: null,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(null)),
        errors: null,
        isLoading: false,
        data: null,
      });

    const { result, waitFor } = renderHook(() => useCalculatePremiumApi());

    const payload = {
      vehicleDetails: { make: "Toyota", model: "Camry" },
      coverageType: "comprehensive",
      repairTypeSelected: "Workshop Repair",
      deductibleAmount: 100,
    };

    await act(async () => {
      await result.current.handleCalculatePremium(payload);
    });
  });

  it("should handle loading state correctly", async () => {
    useApiCall
      .mockReturnValueOnce({
        makeApiCall: jest.fn(
          () => new Promise((resolve) => setTimeout(() => resolve(null), 100))
        ),
        errors: null,
        isLoading: true,
        data: null,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(null)),
        errors: null,
        isLoading: false,
        data: null,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(null)),
        errors: null,
        isLoading: false,
        data: null,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.resolve(null)),
        errors: null,
        isLoading: false,
        data: null,
      });

    const { result } = renderHook(() => useCalculatePremiumApi());

    const payload = {
      vehicleDetails: { make: "Toyota", model: "Camry" },
      coverageType: "comprehensive",
      repairTypeSelected: "Workshop Repair",
      deductibleAmount: 100,
    };

    await act(async () => {
      result.current.handleCalculatePremium(payload);
    });

    expect(result.current.isLoadingCalculatePremium).toBe(false);
  });

  it("should handle all errors scenario", async () => {
    const mockError = { messages: { message_en: "Test Error" } };

    // Mock all APIs with errors
    useApiCall
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.reject(mockError)),
        errors: mockError,
        isLoading: false,
        data: null,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.reject(mockError)),
        errors: mockError,
        isLoading: false,
        data: null,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.reject(mockError)),
        errors: mockError,
        isLoading: false,
        data: null,
      })
      .mockReturnValueOnce({
        makeApiCall: jest.fn(() => Promise.reject(mockError)),
        errors: mockError,
        isLoading: false,
        data: null,
      });

    const { result, waitFor } = renderHook(() => useCalculatePremiumApi());

    const payload = {
      vehicleDetails: { make: "Toyota", model: "Camry" },
      coverageType: "comprehensive",
      repairTypeSelected: "Workshop Repair",
      deductibleAmount: 100,
    };

    await act(async () => {
      await result.current.handleCalculatePremium(payload);
    });
  });
});
