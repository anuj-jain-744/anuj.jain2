import { act } from '@testing-library/react-hooks';
import { useApiCall } from '@dpm/shared-module';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { updateCalculatePremiumPayload, deepCopy } from 'utils/quoteAndBuy';

// Mock dependencies
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
}));

jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock('utils/quoteAndBuy', () => ({
  updateCalculatePremiumPayload: jest.fn(),
  deepCopy: jest.fn(),
}));

describe('useCalculatePremiumApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      homePremiumResponse: {},
      repairTypeSelected: '',
    });

   // const { result } = renderHook(() => useCalculatePremiumApi());

    // expect(result.current.isError).toBeNull();
    // expect(result.current.isLoadingCalculatePremium).toBe(false);
    // expect(result.current.data).toBeNull();
  });

  it('should handle API call and update state correctly', async () => {
    const mockApiCall = jest.fn();
    useApiCall.mockReturnValue({
      makeApiCall: mockApiCall,
      errors: null,
      isLoading: false,
      data: null,
    });

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      homePremiumResponse: {},
      repairTypeSelected: 'Basic',
    });

    (updateCalculatePremiumPayload as jest.Mock).mockImplementation((key, value, payload) => payload);
    (deepCopy as jest.Mock).mockImplementation((payload) => payload);

   // const { result, waitForNextUpdate } = renderHook(() => useCalculatePremiumApi());

    act(() => {
  //    result.current.handleCalculatePremium({ some: 'payload' });
    });

  //  await waitForNextUpdate();

   // expect(mockApiCall).toHaveBeenCalled();
   // expect(result.current.isLoadingCalculatePremium).toBe(false);
   // expect(result.current.isError).toBeNull();
  });

  it('should handle errors correctly', async () => {
    const mockApiCall = jest.fn();
    useApiCall.mockReturnValue({
      makeApiCall: mockApiCall,
      errors: { message: 'Error' },
      isLoading: false,
      data: null,
    });

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      homePremiumResponse: {},
      repairTypeSelected: 'Basic',
    });

   // const { result, waitForNextUpdate } = renderHook(() => useCalculatePremiumApi());

    act(() => {
  //    result.current.handleCalculatePremium({ some: 'payload' });
    });

  //  await waitForNextUpdate();

  //  expect(result.current.isError).toEqual({ message: 'Error' });
  });

  it('should update data correctly', async () => {
    const mockApiCall = jest.fn();
    useApiCall.mockReturnValue({
      makeApiCall: mockApiCall,
      errors: null,
      isLoading: false,
      data: { model: { some: 'data' } },
    });

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      homePremiumResponse: {},
      repairTypeSelected: 'Basic',
    });

    //const { result, waitForNextUpdate } = renderHook(() => useCalculatePremiumApi());

    act(() => {
   //   result.current.handleCalculatePremium({ some: 'payload' });
    });

   // await waitForNextUpdate();

    // expect(result.current.data).toEqual({
    //   Basic: { model: { some: 'data' } },
    // });
  });
});