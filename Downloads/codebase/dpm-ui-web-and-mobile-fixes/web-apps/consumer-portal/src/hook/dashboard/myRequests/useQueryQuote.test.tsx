import { renderHook } from '@testing-library/react-hooks';
import { useQueryQuote } from './useQueryQuote';
import { fetchQueryQuote } from 'api/dashboard/myRequests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('api/dashboard/myRequests', () => ({
  fetchQueryQuote: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useQueryQuote', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('should call fetchQueryQuote with correct parameters', async () => {
    (fetchQueryQuote as jest.Mock).mockResolvedValueOnce({ data: 'mocked data' });

    const { result, waitFor } = renderHook(
      () =>
        useQueryQuote({
          quoteNo: 'QUOTE123',
          nationalID: '123456789',
        }),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess);

    expect(fetchQueryQuote).toHaveBeenCalledWith('123456789', 'QUOTE123');
    expect(result.current.data).toEqual({ data: 'mocked data' });
  });

  it('should not fetch data if nationalID is missing', async () => {
    const { result } = renderHook(
      () =>
        useQueryQuote({
          quoteNo: 'QUOTE123',
          nationalID: null,
        }),
      { wrapper }
    );

    expect(result.current.isIdle).toBeUndefined();
    expect(fetchQueryQuote).not.toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    jest.clearAllMocks();
    queryClient.clear();
    (fetchQueryQuote as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const { result, waitFor } = renderHook(
      () =>
        useQueryQuote({
          quoteNo: 'QUOTE123',
          nationalID: '123456789',
        }),
      { wrapper }
    );

    await waitFor(() => result.current.isError, { timeout: 3000 });

    expect(result.current.error).toEqual(new Error('["queryQuote"] data is undefined'));
  });
});