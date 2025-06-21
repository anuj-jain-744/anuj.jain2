import { renderHook, act } from '@testing-library/react-hooks';
import { createPdf } from './createPdf';
import { useDownloadPolicy } from '../../Motor/Policy-services/AccessPolicyDocuments/hooks/useDownloadPolicy';

jest.mock('../../Motor/Policy-services/AccessPolicyDocuments/hooks/useDownloadPolicy');

describe('createPdf', () => {
  const policyUrl = 'test-policy-url';
  const policy = 'test-policy';

  it('should fetch PDF data successfully', async () => {
    const mockData = [{ name: 'test.pdf', data: 'pdf-data' }];
    (useDownloadPolicy as jest.Mock).mockReturnValue({
      data: mockData,
      doApiCall: jest.fn().mockResolvedValue(mockData),
    });

    const { result, waitForNextUpdate } = renderHook(() => createPdf(policyUrl, policy));

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.pdfData.policyData).toEqual([
      { id: 'policyData-0', name: 'test.pdf', document: 'pdf-data' },
    ]);
  });

  it('should handle error during PDF data fetch', async () => {
    (useDownloadPolicy as jest.Mock).mockReturnValue({
      data: null,
      doApiCall: jest.fn().mockRejectedValue(new Error('API error')),
    });

    const { result, waitForNextUpdate } = renderHook(() => createPdf(policyUrl, policy));

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error fetching PDF data');
    expect(result.current.pdfData.policyData).toEqual([]);
  });

  it('should set loading state correctly', async () => {
    (useDownloadPolicy as jest.Mock).mockReturnValue({
      data: null,
      doApiCall: jest.fn().mockImplementation(() => new Promise(() => {})),
    });

    const { result } = renderHook(() => createPdf(policyUrl, policy));

    expect(result.current.isLoading).toBe(true);
  });
});