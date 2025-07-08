import { renderHook } from '@testing-library/react-hooks';
import useLanguageData from './useLanguageData';
import { callAPI } from '@dpm/shared-module';
import {mockData} from './../../../../../__Mocks__/fixtures/languageDataMock';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));


describe('useLanguageData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useLanguageData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.languageData).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should fetch and set language data successfully', async () => {
    (callAPI as jest.Mock).mockResolvedValue({ config: [mockData] });

    const { result, waitForNextUpdate } = renderHook(() => useLanguageData());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.languageData).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle invalid response structure', async () => {
    (callAPI as jest.Mock).mockResolvedValue({ config: [] });

    const { result, waitForNextUpdate } = renderHook(() => useLanguageData());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.languageData).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Fetch error');
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useLanguageData());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.languageData).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });
});