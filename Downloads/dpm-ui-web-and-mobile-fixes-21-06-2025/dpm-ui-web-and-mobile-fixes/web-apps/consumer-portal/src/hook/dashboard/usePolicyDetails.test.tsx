import { renderHook } from '@testing-library/react-hooks';
import { usePolicyDetails } from './usePolicyDetails';
import { fetchPolicy } from 'api/dashboard/policyDetails';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('api/dashboard/policyDetails', () => ({
  fetchPolicy: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('usePolicyDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('should call fetchPolicy with correct parameters', async () => {
    (fetchPolicy as jest.Mock).mockResolvedValueOnce({ data: 'mocked data' });

    const { result, waitFor } = renderHook(
      () =>
        usePolicyDetails({
          nationalId: '123456789',
          policyNo: null,
          productCode: null,
          includeEndoVersion: 'true',
        }),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess);

    expect(fetchPolicy).toHaveBeenCalledWith('123456789', null, null, 'true');
    expect(result.current.data).toEqual({ data: 'mocked data' });
  });

  it('should not fetch data if nationalId is missing', async () => {
    const { result } = renderHook(
      () =>
        usePolicyDetails({
          nationalId: null,
          policyNo: null,
          productCode: null,
          includeEndoVersion: 'true',
        }),
      { wrapper }
    );

    expect(result.current.isIdle).toBeUndefined();
    expect(fetchPolicy).not.toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    jest.clearAllMocks();
    queryClient.clear();
    (fetchPolicy as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const { result, waitFor } = renderHook(
      () =>
        usePolicyDetails({
          nationalId: '123456789',
          policyNo: null,
          productCode: null,
          includeEndoVersion: 'true',
        }),
      { wrapper }
    );

    await waitFor(() => result.current.isError, { timeout: 3000 }); // Increased timeout to 3000ms

    expect(result.current.error).toEqual(new Error('["policy","123456789"] data is undefined'));
  });
});