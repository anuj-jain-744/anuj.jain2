import { renderHook, act } from '@testing-library/react-hooks';
import { useCalculatePremiumApi } from './useCalculatePremiumApi';
import { useApiCall } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { TRAVEL_COVERAAGE_DATA } from "../../constant";
import { CalculatePremiumApiPayload } from "./CalculatePremiumApiPayload";
import { deepCopy, updateCalculatePremiumPayload } from "utils/quoteAndBuyTravel";

// Mock the useApiCall hook
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

// Mock the useQuoteAndBuyContext hook
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

describe('useCalculatePremiumApi', () => {
  const mockApiCall = jest.fn();
  const mockSetWorldwidepearl = jest.fn();
  const mockSetWorldwidetraveller = jest.fn();
  const mockSetWorldwideexceptpearl = jest.fn();
  const mockSetWorldwideexcepttraveller = jest.fn();
  const mockSetEuropeeurope = jest.fn();
  const mockSetEuropeschengen = jest.fn();
  const mockSetStepValue = jest.fn();
  const mockSetDeleteStatus= jest.fn();

  beforeEach(() => {
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockApiCall,
      errors: null,
      isLoading: false,
      data: null,
    });

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      setWorldwidepearl: mockSetWorldwidepearl,
      setWorldwidetraveller: mockSetWorldwidetraveller,
      setWorldwideexceptpearl: mockSetWorldwideexceptpearl,
      setWorldwideexcepttraveller: mockSetWorldwideexcepttraveller,
      setEuropeeurope: mockSetEuropeeurope,
      setEuropeschengen: mockSetEuropeschengen,
      setStepValue: mockSetStepValue,
      setDeleteStatus:mockSetDeleteStatus
    });
  });

  it('should handle calculate premium correctly', async () => {
    const { result } = renderHook(() => useCalculatePremiumApi());

    const requestPayloadScheme: CalculatePremiumApiPayload = {
        policyEffectiveDate: '',
        travelDuration: '',
        familyIndividual: '',
        plan: '',
        ratingType: '',
        policyRisk: [],
        policyCustomer: undefined
    };

    await act(async () => {
      await result.current.handleCalculatePremium(requestPayloadScheme);
    });

   // expect(mockApiCall).toHaveBeenCalledTimes(6);
   // expect(mockApiCall).toHaveBeenCalledWith(updateCalculatePremiumPayload("plan", TRAVEL_COVERAAGE_DATA.pearl, deepCopy(requestPayloadScheme)));
    // expect(mockApiCall).toHaveBeenCalledWith(updateCalculatePremiumPayload("plan", TRAVEL_COVERAAGE_DATA.traveller, deepCopy(requestPayloadScheme)));
    // expect(mockApiCall).toHaveBeenCalledWith(updateCalculatePremiumPayload("plan", TRAVEL_COVERAAGE_DATA.pearl, deepCopy(requestPayloadScheme)));
    // expect(mockApiCall).toHaveBeenCalledWith(updateCalculatePremiumPayload("plan", TRAVEL_COVERAAGE_DATA.traveller, deepCopy(requestPayloadScheme)));
    // expect(mockApiCall).toHaveBeenCalledWith(updateCalculatePremiumPayload("plan", TRAVEL_COVERAAGE_DATA.europe, deepCopy(requestPayloadScheme)));
    // expect(mockApiCall).toHaveBeenCalledWith(updateCalculatePremiumPayload("plan", TRAVEL_COVERAAGE_DATA.schengen, deepCopy(requestPayloadScheme)));
  });

  it('should set loading state correctly', () => {
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockApiCall,
      errors: null,
      isLoading: true,
      data: null,
    });

    const { result } = renderHook(() => useCalculatePremiumApi());

  //  expect(result.current.isLoadingCalculatePremium).toBe(true);
  });

  it('should set error state correctly', () => {
    const mockError = { message: 'Error' };
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockApiCall,
      errors: mockError,
      isLoading: false,
      data: null,
    });

    const { result } = renderHook(() => useCalculatePremiumApi());

   // expect(result.current.isError).toBe(mockError);
  });

  it('should set calculate data state correctly', () => {
    const mockData = { data: { model: {} } };
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockApiCall,
      errors: null,
      isLoading: false,
      data: mockData,
    });

    const { result } = renderHook(() => useCalculatePremiumApi());

   // expect(result.current.isCalculateData).toBe(true);
  //  expect(mockSetStepValue).toHaveBeenCalledWith(2);
  });
});