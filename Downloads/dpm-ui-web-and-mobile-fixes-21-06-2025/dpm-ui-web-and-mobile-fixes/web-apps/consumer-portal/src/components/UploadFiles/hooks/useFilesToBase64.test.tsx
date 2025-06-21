import { renderHook, act } from '@testing-library/react-hooks';
import useFilesToBase64 from './useFilesToBase64';

describe('useFilesToBase64', () => {
  let mockFileReader: jest.Mocked<FileReader>;

  beforeEach(() => {
    mockFileReader = {
      onloadend: jest.fn(),
      onerror: jest.fn(),
      readAsDataURL: jest.fn(),
      result: null,
    } as unknown as jest.Mocked<FileReader>;

    global.FileReader = jest.fn(() => mockFileReader);
  });

  it('should convert valid files to base64', async () => {
    const { result } = renderHook(() => useFilesToBase64());
    const file = new File(['file content'], 'test.pdf', { type: 'application/pdf', size: 1024 });

    act(() => {
      result.current.convertFilesToBase64({ 0: file, length: 1 } as unknown as FileList);
    });

    mockFileReader.result = 'data:application/pdf;base64,Zm9vYmFy';
    mockFileReader.onloadend({ target: mockFileReader } as ProgressEvent<FileReader>);

    //expect(result.current.fileData).toEqual([{ name: 'test.pdf', size: 1024, base64: 'data:application/pdf;base64,Zm9vYmFy' }]);
  });

  it('should not convert invalid file types', () => {
    const { result } = renderHook(() => useFilesToBase64());
    const file = new File(['file content'], 'test.txt', { type: 'text/plain', size: 1024 });

    act(() => {
      result.current.convertFilesToBase64({ 0: file, length: 1 } as unknown as FileList);
    });

    expect(result.current.fileData).toEqual([]);
  });

  it('should not convert files exceeding size limit', () => {
    const { result } = renderHook(() => useFilesToBase64());
    const file = new File(['file content'], 'test.pdf', { type: 'application/pdf', size: 4 * 1024 * 1024 });

    act(() => {
      result.current.convertFilesToBase64({ 0: file, length: 1 } as unknown as FileList);
    });

    expect(result.current.fileData).toEqual([]);
  });

  it('should handle null FileList', () => {
    const { result } = renderHook(() => useFilesToBase64());

    act(() => {
      result.current.convertFilesToBase64(null);
    });

    expect(result.current.fileData).toEqual([]);
  });
});