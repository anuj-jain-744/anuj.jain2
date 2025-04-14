import { renderHook, act } from '@testing-library/react-hooks';
import { useDownloadPDF } from './useDownloadPdf';

// Mock createObjectURL and revokeObjectURL
URL.createObjectURL = jest.fn();
URL.revokeObjectURL = jest.fn();

// Mock document methods
document.createElement = jest.fn();
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

// Mock console methods
console.warn = jest.fn();
console.error = jest.fn();

describe('useDownloadPDF', () => {
  // Sample valid base64 PDF data
  const validBase64 = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';

  // Sample test data
  const validPDFData = {
    fileName: 'test',
    model: validBase64
  };

  const invalidPDFData = {
    fileName: 'test',
    model: 'invalid-base64'
  };

  // Mock zip function
  const mockCreateZip = jest.fn().mockResolvedValue(new Blob(['mock zip content']));

  // Mock click function
  const mockClick = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup document.createElement mock
    (document.createElement as jest.Mock).mockReturnValue({
      href: '',
      download: '',
      click: mockClick
    });

    // Setup URL.createObjectURL mock
    (URL.createObjectURL as jest.Mock).mockReturnValue('mock-url');
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useDownloadPDF(mockCreateZip));
      
      expect(result.current.isProcessing).toBeFalsy();
      expect(result.current.error).toBeNull();
      expect(typeof result.current.processPDFs).toBe('function');
      expect(typeof result.current.downloadFiles).toBe('function');
    });
  });

  describe('processPDFs', () => {
    it('should process valid PDF data and create zip file', async () => {
      const { result } = renderHook(() => useDownloadPDF(mockCreateZip));

      await act(async () => {
        await result.current.processPDFs(validPDFData, {
          format: 'zip',
          autoDownload: true
        });
      });

      expect(mockCreateZip).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
    });

    it('should handle multiple PDF files', async () => {
      const { result } = renderHook(() => useDownloadPDF(mockCreateZip));
      const multipleFiles = [validPDFData, validPDFData];

      await act(async () => {
        await result.current.processPDFs(multipleFiles, {
          format: 'zip',
          autoDownload: true
        });
      });

      expect(mockCreateZip).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
    });

    it('should throw error for invalid PDF data', async () => {
      const { result } = renderHook(() => useDownloadPDF(mockCreateZip));

      await act(async () => {
        try {
          await result.current.processPDFs(invalidPDFData, {
            format: 'zip',
            autoDownload: true
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe('No valid PDF files could be created');
        }
      });
    });

    it('should handle PDF format option', async () => {
      const { result } = renderHook(() => useDownloadPDF(mockCreateZip));

      await act(async () => {
        const response = await result.current.processPDFs(validPDFData, {
          format: 'pdf',
          autoDownload: false
        });

        expect(Array.isArray(response)).toBeTruthy();
        expect((response as PDFFile[])[0].name).toBe('test.pdf');
      });
    });

    it('should throw error when createZip is not provided for zip format', async () => {
      const { result } = renderHook(() => useDownloadPDF());

      await act(async () => {
        try {
          await result.current.processPDFs(validPDFData, {
            format: 'zip',
            autoDownload: true
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe('Zip functionality not provided');
        }
      });
    });
  });

  describe('validation', () => {
    it('should validate PDF data structure', async () => {
      const { result } = renderHook(() => useDownloadPDF(mockCreateZip));
      const invalidData = { wrongKey: 'value' };

      await act(async () => {
        try {
          await result.current.processPDFs(invalidData, {
            format: 'zip',
            autoDownload: true
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe('Invalid document data provided');
        }
      });
    });

    it('should handle empty data array', async () => {
      const { result } = renderHook(() => useDownloadPDF(mockCreateZip));

      await act(async () => {
        try {
          await result.current.processPDFs([], {
            format: 'zip',
            autoDownload: true
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe('No valid documents to process');
        }
      });
    });
  });

  describe('error handling', () => {
    it('should handle blob creation errors', async () => {
      const { result } = renderHook(() => useDownloadPDF(mockCreateZip));
      const invalidBase64Data = {
        fileName: 'test',
        model: 'invalid-base64-string'
      };

      await act(async () => {
        try {
          await result.current.processPDFs(invalidBase64Data, {
            format: 'zip',
            autoDownload: true
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(console.warn).toHaveBeenCalledWith('Invalid base64 string provided');
        }
      });
    });

    it('should handle zip creation errors', async () => {
      const mockFailedZip = jest.fn().mockRejectedValue(new Error('Zip creation failed'));
      const { result } = renderHook(() => useDownloadPDF(mockFailedZip));

      await act(async () => {
        try {
          await result.current.processPDFs(validPDFData, {
            format: 'zip',
            autoDownload: true
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });

  describe('downloadFiles', () => {
    it('should download multiple files individually', async () => {
      const { result } = renderHook(() => useDownloadPDF(mockCreateZip));
      const files = [
        { name: 'test1.pdf', blob: new Blob(['content1']) },
        { name: 'test2.pdf', blob: new Blob(['content2']) }
      ];

      act(() => {
        result.current.downloadFiles(files);
      });

      expect(document.createElement).toHaveBeenCalledTimes(2);
      expect(mockClick).toHaveBeenCalledTimes(2);
      expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
      expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
    });
  });
});