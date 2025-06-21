import { downloadPDF } from './CancelPolicyDownload';
import { isBase64 } from './policyDocuments';
import useZipFiles from 'Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles';

jest.mock('./policyDocuments', () => ({
  isBase64: jest.fn(),
}));

jest.mock('Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    createZip: jest.fn(),
  })),
}));

describe('downloadPDF', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if response data is not an array', async () => {
    const mockDataForPolicy = { data: 'not an array' };

    await expect(downloadPDF(mockDataForPolicy)).rejects.toThrow('Response data is not an array');
  });

  it('should process valid base64 strings and create a zip file', async () => {
    const mockDataForPolicy = {
      data: [
        { model: 'validBase64String1', fileName: 'file1' },
        { model: 'validBase64String2' },
        { model: 'invalidBase64String' },
      ],
    };

    (isBase64 as jest.Mock).mockImplementation((str) => str.startsWith('valid'));

    const createZipMock = jest.fn().mockResolvedValue(new Blob());
    (useZipFiles as jest.Mock).mockReturnValue({ createZip: createZipMock });
    global.URL.revokeObjectURL = jest.fn();

    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');

    await downloadPDF(mockDataForPolicy);

    expect(isBase64).toHaveBeenCalledTimes(3);
    expect(createZipMock).toHaveBeenCalledTimes(1);
   // expect(createElementSpy).toHaveBeenCalledWith('a');
   // expect(appendChildSpy).toHaveBeenCalledTimes(1);
   // expect(removeChildSpy).toHaveBeenCalledTimes(1);
   // expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle errors during zip file creation', async () => {
    const mockDataForPolicy = {
      data: [
        { model: 'validBase64String1', fileName: 'file1' },
      ],
    };

    (isBase64 as jest.Mock).mockImplementation((str) => str.startsWith('valid'));

    const createZipMock = jest.fn().mockRejectedValue(new Error('Zip creation failed'));
    (useZipFiles as jest.Mock).mockReturnValue({ createZip: createZipMock });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await downloadPDF(mockDataForPolicy);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating zip file:', expect.any(Error));
  });
});