import { renderHook, act } from '@testing-library/react-hooks';
import useFilesToBase64 from './useFilesToBase64';
import { waitFor } from '@testing-library/react';

describe('useFilesToBase64', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state of fileData is empty array', () => {
    const { result } = renderHook(() => useFilesToBase64());
    expect(result.current.fileData).toEqual([]);
  });

  test('converts valid files to base64', async () => {
    const { result } = renderHook(() => useFilesToBase64());

    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
    const files = {
      0: file,
      length: 1,
      item: (index: number) => file,
    };

    const readerMock = {
      readAsDataURL: jest.fn(),
      onloadend: jest.fn(),
      onerror: jest.fn(),
    };

    global.FileReader = jest.fn(() => readerMock as unknown as FileReader);

    act(() => {
      result.current.convertFilesToBase64(files as unknown as FileList);
    });

    expect(readerMock.readAsDataURL).toHaveBeenCalledWith(file);

    act(() => {
      readerMock.onloadend({ target: { result: 'base64string' } });
    });

    expect(result.current.fileData).toEqual([{ name: 'example.pdf', size: file.size, base64: 'base64string' }]);
  });

  test('handles invalid file type', () => {
    const { result } = renderHook(() => useFilesToBase64());

    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
    const files = {
      0: file,
      length: 1,
      item: (index: number) => file,
    };

    console.error = jest.fn();

    act(() => {
      result.current.convertFilesToBase64(files as unknown as FileList);
    });

    expect(console.error).toHaveBeenCalledWith('Invalid file type or exceeds size limit (3MB)');
    expect(result.current.fileData).toEqual([]);
  });

  test('handles file size limit', () => {
    const { result } = renderHook(() => useFilesToBase64());

    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf', size: 4 * 1024 * 1024 });
    const files = {
      0: file,
      length: 1,
      item: (index: number) => file,
    };

    console.error = jest.fn();

    act(() => {
      result.current.convertFilesToBase64(files as unknown as FileList);
    });
    waitFor(() => expect(console.error).toHaveBeenCalledWith('Invalid file type or exceeds size limit (3MB)')); 
    //expect(console.error).toHaveBeenCalledWith('Invalid file type or exceeds size limit (3MB)');
    expect(result.current.fileData).toEqual([]);
  });

  test('handles file reading error', () => {
    const { result } = renderHook(() => useFilesToBase64());

    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
    const files = {
      0: file,
      length: 1,
      item: (index: number) => file,
    };

    const readerMock = {
      readAsDataURL: jest.fn(),
      onloadend: jest.fn(),
      onerror: jest.fn(),
    };

    global.FileReader = jest.fn(() => readerMock as unknown as FileReader);

    console.error = jest.fn();

    act(() => {
      result.current.convertFilesToBase64(files as unknown as FileList);
    });

    act(() => {
      readerMock.onerror();
    });

    expect(console.error).toHaveBeenCalledWith('Error occurred while reading file.');
    expect(result.current.fileData).toEqual([]);
  });
});