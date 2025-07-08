import { renderHook, waitFor } from '@testing-library/react';
import useLanguageData from './useLanguageData';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

describe('useLanguageData', () => {
  const mockValidResponse = {
    config: [{ language: 'en', label: 'English' }],
  };

  const mockInvalidResponse = {
    config: [],
  };

  const mockError = new Error('API Error');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return language data on successful API call', async () => {
    (callAPI as jest.Mock).mockResolvedValue(mockValidResponse);

    const { result } = renderHook(() => useLanguageData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.languageData).toEqual(mockValidResponse.config[0]);
    expect(result.current.error).toBe(null);
  });

  it('should handle invalid API response structure', async () => {
    (callAPI as jest.Mock).mockResolvedValue(mockInvalidResponse);

    const { result } = renderHook(() => useLanguageData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.languageData).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should handle API call failure', async () => {
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLanguageData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.languageData).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useLanguageData());

    expect(result.current.languageData).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });
});