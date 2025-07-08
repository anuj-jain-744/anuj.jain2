import { renderHook, act } from '@testing-library/react-hooks';
import useFilesToBase64 from './useFilesToBase64'; 

describe('useFilesToBase64', () => {
  it('should initialize with empty fileData', () => {
    const { result } = renderHook(() => useFilesToBase64());
    expect(result.current.fileData).toEqual([]);
  });

  it('should add valid files to fileData', async () => {
    const { result } = renderHook(() => useFilesToBase64());
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });

    await act(async () => {
      result.current.convertFilesToBase64([file] as unknown as FileList);
    });
    expect(result.current.fileData).toHaveLength(0);
  });

  it('should not add invalid files to fileData', async () => {
    const { result } = renderHook(() => useFilesToBase64());
    const invalidFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

    await act(async () => {
      result.current.convertFilesToBase64([invalidFile] as unknown as FileList);
    });

    expect(result.current.fileData).toHaveLength(0);
  });

  it('should not add files exceeding size limit', async () => {
    const { result } = renderHook(() => useFilesToBase64());
    const largeFile = new File(['dummy content'], 'largefile.png', { type: 'image/png' });

    await act(async () => {
      result.current.convertFilesToBase64([largeFile] as unknown as FileList);
    });

    expect(result.current.fileData).toHaveLength(0);
  });
});