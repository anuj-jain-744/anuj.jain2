import { renderHook } from '@testing-library/react-hooks';
import { useQueryClaim } from './useQueryClaim';
import { fetchQueryClaim } from './../../../api/dashboard/myRequests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('./../../../api/dashboard/myRequests', () => ({
  fetchQueryClaim: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useQueryClaim', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('should call fetchQueryClaim with correct parameters', async () => {
    (fetchQueryClaim as jest.Mock).mockResolvedValueOnce({ data: 'mocked data' });

    const { result, waitFor } = renderHook(
      () =>
        useQueryClaim({
          idNumber: '123456789',
          policyNo: 'POLICY123',
        }),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess);

    expect(fetchQueryClaim).toHaveBeenCalledWith('123456789', 'POLICY123');
    expect(result.current.data).toEqual({ data: 'mocked data' });
  });

  it('should not fetch data if idNumber is missing', async () => {
    const { result } = renderHook(
      () =>
        useQueryClaim({
          idNumber: null,
          policyNo: 'POLICY123',
        }),
      { wrapper }
    );

    expect(result.current.isIdle).toBeUndefined();
    expect(fetchQueryClaim).not.toHaveBeenCalled();
  });

    it('should handle API errors', async () => {
    (fetchQueryClaim as jest.Mock).mockRejectedValueOnce(new Error('["queryClaim","POLICY123"] data is undefined'));

    const { result, waitFor } = renderHook(
        () =>
        useQueryClaim({
            idNumber: '123456789',
            policyNo: 'POLICY123',
        }),
        { wrapper }
    );

    await waitFor(() => result.current.isError, { timeout: 5000 });

    expect(result.current.error).toEqual(new Error('["queryClaim","POLICY123"] data is undefined'));
    });
});