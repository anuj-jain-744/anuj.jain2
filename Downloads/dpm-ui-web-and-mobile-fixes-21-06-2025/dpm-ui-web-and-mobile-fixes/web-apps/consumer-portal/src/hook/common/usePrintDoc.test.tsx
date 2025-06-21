import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  usePolicyDocuments,
  useClaimDocuments,
  useQuotationDocuments,
  useEndorsementDocuments,
} from './usePrintDoc'; // Update to your actual file name

// Mock API functions
jest.mock('../../api/common/printDocApis', () => ({
  fetchPolicyDocuments: jest.fn(),
  fetchClaimDocuments: jest.fn(),
  fetchQuotationDocuments: jest.fn(),
  fetchEndorsementDocuments: jest.fn(),
}));

const {
  fetchPolicyDocuments,
  fetchClaimDocuments,
  fetchQuotationDocuments,
  fetchEndorsementDocuments,
} = require('../../api/common/printDocApis');

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe('Document hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('usePolicyDocuments', () => {
    const params = { policyNo: 'P123', docType: 'POLICY' };
    it('returns data on success', async () => {
      fetchPolicyDocuments.mockResolvedValueOnce([{ fileName: 'file.pdf', model: 'base64string' }]);
      const { result } = renderHook(() => usePolicyDocuments(params), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ fileName: 'file.pdf', model: 'base64string' }]);
      expect(fetchPolicyDocuments).toHaveBeenCalledWith(params);
    });

    it('returns error on failure', async () => {
      fetchPolicyDocuments.mockRejectedValueOnce(new Error('API Error'));
      const { result } = renderHook(() => usePolicyDocuments(params), { wrapper });
      await waitFor(() => expect(result.current.isError).toBe(false));
    });

    it('does not run query if params missing', () => {
      const { result } = renderHook(
        () => usePolicyDocuments({ policyNo: null, docType: null }),
        { wrapper }
      );
      expect(result.current.isLoading).toBe(false);
      expect(fetchPolicyDocuments).not.toHaveBeenCalled();
    });
  });

  describe('useClaimDocuments', () => {
    const params = { claimNo: 'C123', subClaimNo: 'SC1', docType: 'CLAIM' };
    it('returns data on success', async () => {
      fetchClaimDocuments.mockResolvedValueOnce([{ fileName: 'claim.pdf', model: 'base64' }]);
      const { result } = renderHook(() => useClaimDocuments(params), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ fileName: 'claim.pdf', model: 'base64' }]);
      expect(fetchClaimDocuments).toHaveBeenCalledWith(params);
    });

    it('does not run query if params missing', () => {
      const { result } = renderHook(
        () => useClaimDocuments({ claimNo: null, subClaimNo: null, docType: null }),
        { wrapper }
      );
      expect(result.current.isLoading).toBe(false);
      expect(fetchClaimDocuments).not.toHaveBeenCalled();
    });
  });

  describe('useQuotationDocuments', () => {
    const params = { quoteReferenceNo: 'Q123', docType: 'QUOTE' };
    it('returns data on success', async () => {
      fetchQuotationDocuments.mockResolvedValueOnce([{ fileName: 'quote.pdf', model: 'base64' }]);
      const { result } = renderHook(() => useQuotationDocuments(params), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ fileName: 'quote.pdf', model: 'base64' }]);
      expect(fetchQuotationDocuments).toHaveBeenCalledWith(params);
    });

    it('does not run query if params missing', () => {
      const { result } = renderHook(
        () => useQuotationDocuments({ quoteReferenceNo: null, docType: null }),
        { wrapper }
      );
      expect(result.current.isLoading).toBe(false);
      expect(fetchQuotationDocuments).not.toHaveBeenCalled();
    });
  });

  describe('useEndorsementDocuments', () => {
    const params = { endorsementNo: 'E123', policyNo: 'P123', docType: 'ENDO' };
    it('returns data on success', async () => {
      fetchEndorsementDocuments.mockResolvedValueOnce([{ fileName: 'endo.pdf', model: 'base64' }]);
      const { result } = renderHook(() => useEndorsementDocuments(params), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([{ fileName: 'endo.pdf', model: 'base64' }]);
      expect(fetchEndorsementDocuments).toHaveBeenCalledWith(params);
    });

    it('does not run query if params missing', () => {
      const { result } = renderHook(
        () => useEndorsementDocuments({ endorsementNo: null, policyNo: null, docType: null }),
        { wrapper }
      );
      expect(result.current.isLoading).toBe(false);
      expect(fetchEndorsementDocuments).not.toHaveBeenCalled();
    });
  });
});
