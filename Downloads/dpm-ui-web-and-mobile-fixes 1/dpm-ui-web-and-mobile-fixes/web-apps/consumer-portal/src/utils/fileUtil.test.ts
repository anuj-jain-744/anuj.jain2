import { base64ToBlob, downloadFile, createAndDownloadZip } from "./fileUtil";
import * as fileUtils from "./fileUtil";

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
});