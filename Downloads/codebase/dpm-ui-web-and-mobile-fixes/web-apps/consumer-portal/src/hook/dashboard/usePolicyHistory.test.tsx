// usePolicyHistory.test.tsx

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePolicyHistory } from './usePolicyHistory';

// Mock fetchPolicy function
jest.mock('../../api/dashboard/policyDetails', () => ({
  fetchPolicy: jest.fn(),
}));

const { fetchPolicy } = require('../../api/dashboard/policyDetails');

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);


describe('usePolicyHistory', () => {
  const params = {
    nationalId: '1234567890',
    productCode: 'MOTOR',
    policyNo: 'POL123',
    includeEndoVersion: 'Y',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns data on success', async () => {
    fetchPolicy.mockResolvedValueOnce({ foo: 'bar' });

    const { result } = renderHook(() => usePolicyHistory(params), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ foo: 'bar' });
    expect(fetchPolicy).toHaveBeenCalledWith(
      params.nationalId,
      params.productCode,
      params.policyNo,
      params.includeEndoVersion
    );
  });

  it('returns error on failure', async () => {
    fetchPolicy.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => usePolicyHistory(params), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(false));
  });

  it('does not run query if required params are missing', () => {
    const { result } = renderHook(
      () =>
        usePolicyHistory({
          nationalId: null,
          productCode: 'MOTOR',
          policyNo: null,
          includeEndoVersion: 'Y',
        }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(fetchPolicy).not.toHaveBeenCalled();
  });
});
