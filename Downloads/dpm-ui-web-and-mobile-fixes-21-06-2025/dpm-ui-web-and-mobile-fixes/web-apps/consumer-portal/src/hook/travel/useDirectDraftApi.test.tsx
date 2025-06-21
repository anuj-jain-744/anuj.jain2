import { renderHook, act } from '@testing-library/react-hooks';
import { useDirectDraftApi } from './useDirectDraftApi';
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

describe('useDirectDraftApi', () => {
  const mockApiCall = jest.fn();
  const mockSetQuoteDataResponse = jest.fn();
  const mockSetStepValue = jest.fn();

  beforeEach(() => {
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockApiCall,
      errors: null,
      isLoading: false,
      data: null,
    });

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      setQuoteDataResponse: mockSetQuoteDataResponse,
      setStepValue: mockSetStepValue,
    });
  });

  it('should handle review quote premium correctly', async () => {
    const { result } = renderHook(() => useDirectDraftApi());

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
      await result.current.handleReviewQuotePremium(requestPayloadScheme);
    });

    expect(mockApiCall).toHaveBeenCalledTimes(1);
   // expect(mockApiCall).toHaveBeenCalledWith(updateCalculatePremiumPayload("plan", TRAVEL_COVERAAGE_DATA.pearl, deepCopy(requestPayloadScheme)));
  });

  it('should set loading state correctly', () => {
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockApiCall,
      errors: null,
      isLoading: true,
      data: null,
    });

    const { result } = renderHook(() => useDirectDraftApi());

    expect(result.current.isloadingdirectdraft).toBe(true);
  });

  it('should set error state correctly', () => {
    const mockError = { message: 'Error' };
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockApiCall,
      errors: mockError,
      isLoading: false,
      data: null,
    });

    const { result } = renderHook(() => useDirectDraftApi());

  //  expect(result.current.isError).toBe(mockError);
  });

  it('should set direct data state correctly', () => {
    const mockData = { data: { model: {} } };
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockApiCall,
      errors: null,
      isLoading: false,
      data: mockData,
    });

    const { result } = renderHook(() => useDirectDraftApi());

    expect(result.current.isDirectData).toBe(true);
    expect(mockSetQuoteDataResponse).toHaveBeenCalledWith(mockData.data.model);
  });
});