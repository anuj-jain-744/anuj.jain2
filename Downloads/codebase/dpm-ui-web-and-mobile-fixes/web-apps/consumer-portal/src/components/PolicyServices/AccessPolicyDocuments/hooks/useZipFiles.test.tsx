import JSZip from 'jszip';
import useZipFiles from './useZipFiles';

jest.mock('jszip', () => {
  const fileMock = jest.fn();
  const generateAsyncMock = jest.fn().mockResolvedValue(new Blob());

  return jest.fn().mockImplementation(() => {
    return {
      file: fileMock,
      generateAsync: generateAsyncMock,
    };
  });
});

describe('useZipFiles', () => {
  let createZip: (files: Array<{ name: string; data: string }>) => Promise<Blob>;
  let zip: any;

  beforeEach(() => {
    createZip = useZipFiles().createZip;
    zip = new JSZip();
  });

  it('creates a zip file with the correct files', async () => {
    const files = [
      { name: 'file1', data: 'data1' },
      { name: 'file2', data: 'data2' },
    ];

    await createZip(files);

    expect(zip.file).toHaveBeenCalledWith('file1', 'data1', { binary: true });
    expect(zip.file).toHaveBeenCalledWith('file2', 'data2', { binary: true });
  });

  it('handles duplicate file names correctly', async () => {
    const files = [
      { name: 'file', data: 'data1' },
      { name: 'file', data: 'data2' },
    ];

    await createZip(files);

    expect(zip.file).toHaveBeenCalledWith('file', 'data1', { binary: true });
    expect(zip.file).toHaveBeenCalledWith('file_1', 'data2', { binary: true });
  });

  it('returns a blob', async () => {
    const files = [
      { name: 'file1.txt', data: 'data1' },
    ];

    const result = await createZip(files);

    expect(result).toBeInstanceOf(Blob);
  });
});