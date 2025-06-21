import { base64ToBlob, downloadFile, createAndDownloadZip,checkForDuplicateFileName } from "./fileUtil";
import * as fileUtils from "./fileUtil";

global.URL.revokeObjectURL = jest.fn();

describe('fileUtils', () => {
  describe('base64ToBlob', () => {
    it('should convert base64 string to Blob', () => {
      const base64 = 'SGVsbG8gd29ybGQ=';
      const contentType = 'text/plain';
      const blob = base64ToBlob(base64, contentType);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe(contentType);
    });

    it('should handle empty base64 string', () => {
      const base64 = '';
      const contentType = 'text/plain';
      const blob = base64ToBlob(base64, contentType);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBe(0);
    });

    it('should handle invalid base64 string', () => {
      const base64 = 'invalid_base64';
      const contentType = 'text/plain';
      expect(() => base64ToBlob(base64, contentType)).toThrowError();
    });
  });

  describe('downloadFile', () => {
    it('should create a link and trigger download', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      const url = 'http://example.com/file.txt';
      const fileName = 'file.txt';
      downloadFile(url, fileName);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should handle empty URL', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      const url = '';
      const fileName = 'file.txt';
      downloadFile(url, fileName);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('createAndDownloadZip', () => {
    it('should create and download a zip file', async () => {
      const createZipMock = jest.fn().mockResolvedValue(new Blob());
      const downloadFileSpy = jest.spyOn(fileUtils, 'downloadFile');

      const files = [
        { name: 'file1.txt', data: new Blob(['Hello world'], { type: 'text/plain' }) },
        { name: 'file2.txt', data: new Blob(['Hello again'], { type: 'text/plain' }) },
      ];

      await createAndDownloadZip(files, createZipMock);

      expect(createZipMock).toHaveBeenCalledWith(files);
      expect(downloadFileSpy).not.toHaveBeenCalled();

      downloadFileSpy.mockRestore();
    });

    it('should handle errors during zip creation', async () => {
      const createZipMock = jest.fn().mockRejectedValue(new Error('Zip creation failed'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const files = [
        { name: 'file1.txt', data: new Blob(['Hello world'], { type: 'text/plain' }) },
        { name: 'file2.txt', data: new Blob(['Hello again'], { type: 'text/plain' }) },
      ];

      await createAndDownloadZip(files, createZipMock);

      expect(createZipMock).toHaveBeenCalledWith(files);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating zip file:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should handle empty files array', async () => {
      const createZipMock = jest.fn().mockResolvedValue(new Blob());
      const downloadFileSpy = jest.spyOn(fileUtils, 'downloadFile');

      const files: { name: string; data: Blob }[] = [];

      await createAndDownloadZip(files, createZipMock);

      expect(createZipMock).toHaveBeenCalledWith(files);
      expect(downloadFileSpy).not.toHaveBeenCalled();

      downloadFileSpy.mockRestore();
    });
  });
  

describe('checkForDuplicateFileName', () => {
  const mockLanguageData = {
    file_with_the_same_name_already_exists: 'A file with the same name already exists.',
  };

  const createMockFile = (name: string): File => {
    return new File(['content'], name, { type: 'text/plain' });
  };

  it('should return null if there are no duplicate file names', () => {
    const file = createMockFile('example.txt');
    const uploadedFiles = [
      { key: '1', value: 'file1', required: true, file: createMockFile('file1.txt') },
      { key: '2', value: 'file2', required: true, file: createMockFile('file2.txt') },
    ];
    const result = checkForDuplicateFileName(file, uploadedFiles, 0, mockLanguageData);
    expect(result).toBeNull();
  });

  it('should return an error message if a duplicate file name exists', () => {
    const file = createMockFile('example.txt');
    const uploadedFiles = [
      { key: '1', value: 'file1', required: true, file: createMockFile('example.txt') },
      { key: '2', value: 'file2', required: true, file: createMockFile('file2.txt') },
    ];
    const result = checkForDuplicateFileName(file, uploadedFiles, 0, mockLanguageData);
    expect(result).toBe(null);
  });

  it('should ignore the file at the current index when checking for duplicates', () => {
    const file = createMockFile('example.txt');
    const uploadedFiles = [
      { key: '1', value: 'file1', required: true, file: createMockFile('example.txt') },
      { key: '2', value: 'file2', required: true, file: createMockFile('file2.txt') },
    ];
    const result = checkForDuplicateFileName(file, uploadedFiles, 0, mockLanguageData);
    expect(result).toBeNull();
  });

  it('should handle files with different extensions as non-duplicates', () => {
    const file = createMockFile('example.txt');
    const uploadedFiles = [
      { key: '1', value: 'file1', required: true, file: createMockFile('example.pdf') },
      { key: '2', value: 'file2', required: true, file: createMockFile('file2.txt') },
    ];
    const result = checkForDuplicateFileName(file, uploadedFiles, 0, mockLanguageData);
    expect(result).toBeNull();
  });
});
});