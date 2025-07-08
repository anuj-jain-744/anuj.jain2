import { renderHook, act } from '@testing-library/react-hooks';
import { useUploadFile } from './useUploadClaimFile';
import { callAPI } from "@dpm/shared-module";

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
  VITE_BACKEND_BASE_URL: 'http://mockedurl.com'
}));

describe('useUploadFile', () => {
  it('should handle successful API call', async () => {
    const mockResponse = { status: 'success' };
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUploadFile());

    await act(async () => {
      const response = await result.current.makeApiCall({
        taskId: '123',
        fileList: [{ documentId: 'doc1', fileName: 'file1', file: 'fileContent' }]
      });
      expect(response).toEqual(mockResponse);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should handle API call failure', async () => {
    const mockError = new Error('API call failed');
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUploadFile());

    await act(async () => {
      const response = await result.current.makeApiCall({
        taskId: '123',
        fileList: [{ documentId: 'doc1', fileName: 'file1', file: 'fileContent' }]
      });
      expect(response).toBe(null);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(`API call failed: ${mockError}`);
    expect(result.current.data).toBe(null);
  });

  it('should handle loading state', async () => {
    const mockResponse = { status: 'success' };
    (callAPI as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100)));

    const { result } = renderHook(() => useUploadFile());

    act(() => {
      result.current.makeApiCall({
        taskId: '123',
        fileList: [{ documentId: 'doc1', fileName: 'file1', file: 'fileContent' }]
      });
    });

    expect(result.current.isLoading).toBe(true);
  });
});