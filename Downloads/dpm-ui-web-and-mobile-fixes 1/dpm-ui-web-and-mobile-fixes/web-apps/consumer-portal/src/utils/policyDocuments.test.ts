import { convertBase64toPdf, isBase64, openPdfInNewTab } from './policyDocuments';
import { PDFDocument } from 'pdf-lib';

// Mock pdf-lib
jest.mock('pdf-lib', () => ({
  PDFDocument: {
    load: jest.fn(),
  },
}));

// Mock global functions
global.atob = jest.fn();
global.btoa = jest.fn();
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe('PDF Utility Functions', () => {
  describe('convertBase64toPdf', () => {
    it('should convert a valid base64 string to PDF bytes', async () => {
      const mockPdfDoc = {
        save: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
      };
      (PDFDocument.load as jest.Mock).mockResolvedValue(mockPdfDoc);
      (global.atob as jest.Mock).mockReturnValue('mockBinaryString');

      const result = await convertBase64toPdf('validBase64String');
      expect(result).toEqual(new Uint8Array([1, 2, 3]));
    });

    it('should throw an error for invalid input', async () => {
      await expect(convertBase64toPdf('')).rejects.toThrow('Invalid Base64 string provided.');
      await expect(convertBase64toPdf(null as any)).rejects.toThrow('Invalid Base64 string provided.');
    });

    it('should handle errors during conversion', async () => {
      (PDFDocument.load as jest.Mock).mockRejectedValue(new Error('Mock error'));
      await expect(convertBase64toPdf('validBase64String')).rejects.toThrow('Failed to convert Base64 to PDF!!');
    });
  });

  describe('isBase64', () => {
    beforeEach(() => {
      (global.atob as jest.Mock).mockImplementation((str) => str);
      (global.btoa as jest.Mock).mockImplementation((str) => str);
    });

    it('should return true for valid base64 strings', () => {
      expect(isBase64('SGVsbG8gV29ybGQ=')).toBe(true);
      expect(isBase64('SGVsbG8gV29ybGQ==')).toBe(false);
    });

    it('should return false for invalid base64 strings', () => {
      expect(isBase64('invalid!@#')).toBe(false);
      expect(isBase64('SGVsbG8gV29ybGQ===')).toBe(false);
    });
  });

  describe('openPdfInNewTab', () => {
    let mockCreateElement: jest.SpyInstance;
    let mockDispatchEvent: jest.Mock;

    beforeEach(() => {
      mockDispatchEvent = jest.fn();
      mockCreateElement = jest.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        target: '',
        download: '',
        dispatchEvent: mockDispatchEvent,
      } as unknown as HTMLAnchorElement);

      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      mockCreateElement.mockRestore();
    });

    it('should create a link and trigger a click event', () => {
      openPdfInNewTab(new Uint8Array([1, 2, 3]), 'test.pdf');

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockDispatchEvent).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      
      jest.runAllTimers();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});