import {
  fetchClaimDocuments,
  fetchQuotationDocuments,
  fetchEndorsementDocuments,
  fetchPolicyDocuments,
  ApiError,
} from './printDocApis';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  constant: {
    VITE_BACKEND_COMMON_DASHBOARD_URL: 'https://mock-dashboard-url.com',
  },
  callAPI: jest.fn(),
}));

describe('printDocApis', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


// jest.mock('@dpm/shared-module', () => ({
//   callAPI: jest.fn(),
// }));

describe('fetchClaimDocuments', () => {
  it('should call callAPI with correct parameters and return data', async () => {
    const mockResponse = {
      code: 1,
      transactionId: '12345',
      customerRefNum: '67890',
      message: 'Success',
      data: [
        {
          fileName: 'document1.pdf',
          model: 'Claim',
        },
      ],
      errors: null,
    };

    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const params = {
      claimNo: 'CL123',
      subClaimNo: 'SUB123',
      docType: 'PDF',
      transType: 'CLAIM',
    };

    const result = await fetchClaimDocuments(params);

    expect(callAPI).toHaveBeenCalledWith(
      'post',
      expect.stringContaining('/Dashboard/V1/Download/Claim'),
      {
        docType: 'PDF',
        claimNo: 'CL123',
        subClaimNo: 'SUB123',
        transType: 'CLAIM',
      }
    );

    expect(result).toEqual(mockResponse.data);
  });

  it('should throw an error if required parameters are missing', async () => {
    await expect(
      fetchClaimDocuments({
        claimNo: '',
        subClaimNo: '',
        docType: 'PDF',
        transType: '',
      })
    ).rejects.toThrow(
      'Policy does not have any claim. Please check the claim number and sub-claim number.'
    );
  });
});

  describe('fetchQuotationDocuments', () => {
    it('should call callAPI with correct parameters and return data', async () => {
      (callAPI as jest.Mock).mockResolvedValueOnce({
        code: 1,
        data: [{ fileName: 'quotation.pdf', model: 'QuotationModel' }],
      });

      const params = { quoteReferenceNo: 'QUOTE123', docType: 'PDF' };
      const response = await fetchQuotationDocuments(params);

      expect(callAPI).toHaveBeenCalledWith(
        'post',
        'https://mock-dashboard-url.com/Dashboard/V1/Download/Quotation',
        params
      );
      expect(response).toEqual([{ fileName: 'quotation.pdf', model: 'QuotationModel' }]);
    });

    it('should throw ApiError for API error response', async () => {
      (callAPI as jest.Mock).mockResolvedValueOnce({
        code: 0,
        message: 'Error occurred',
        errors: [
          {
            name: 'ErrorName',
            code: 'ErrorCode',
            messages: {
              message_en: 'English error message',
              message_ar: 'Arabic error message',
              details: { field: 'fieldName', additionalInfo: 'info' },
            },
          },
        ],
      });

      const params = { quoteReferenceNo: 'QUOTE123', docType: 'PDF' };

      await expect(fetchQuotationDocuments(params)).rejects.toThrow(ApiError);
    });
  });

  describe('fetchEndorsementDocuments', () => {
    it('should call callAPI with correct parameters and return data', async () => {
      (callAPI as jest.Mock).mockResolvedValueOnce({
        code: 1,
        data: [{ fileName: 'endorsement.pdf', model: 'EndorsementModel' }],
      });

      const params = { endorsementNo: 'ENDORSE123', policyNo: 'POLICY123', docType: 'PDF' };
      const response = await fetchEndorsementDocuments(params);

      expect(callAPI).toHaveBeenCalledWith(
        'post',
        'https://mock-dashboard-url.com/Dashboard/V1/Download/Endorsement',
        params
      );
      expect(response).toEqual([{ fileName: 'endorsement.pdf', model: 'EndorsementModel' }]);
    });

    it('should throw ApiError for API error response', async () => {
      (callAPI as jest.Mock).mockResolvedValueOnce({
        code: 0,
        message: 'Error occurred',
        errors: [
          {
            name: 'ErrorName',
            code: 'ErrorCode',
            messages: {
              message_en: 'English error message',
              message_ar: 'Arabic error message',
              details: { field: 'fieldName', additionalInfo: 'info' },
            },
          },
        ],
      });

      const params = { endorsementNo: 'ENDORSE123', policyNo: 'POLICY123', docType: 'PDF' };

      await expect(fetchEndorsementDocuments(params)).rejects.toThrow(ApiError);
    });
  });

  describe('fetchPolicyDocuments', () => {
    it('should call callAPI with correct parameters and return data', async () => {
      (callAPI as jest.Mock).mockResolvedValueOnce({
        code: 1,
        data: [{ fileName: 'policy.pdf', model: 'PolicyModel' }],
      });

      const params = { policyNo: 'POLICY123', docType: 'PDF' };
      const response = await fetchPolicyDocuments(params);

      expect(callAPI).toHaveBeenCalledWith(
        'post',
        'https://mock-dashboard-url.com/Dashboard/V1/Download/Policy',
        params
      );
      expect(response).toEqual([{ fileName: 'policy.pdf', model: 'PolicyModel' }]);
    });

    it('should throw ApiError for API error response', async () => {
      (callAPI as jest.Mock).mockResolvedValueOnce({
        code: 0,
        message: 'Error occurred',
        errors: [
          {
            name: 'ErrorName',
            code: 'ErrorCode',
            messages: {
              message_en: 'English error message',
              message_ar: 'Arabic error message',
              details: { field: 'fieldName', additionalInfo: 'info' },
            },
          },
        ],
      });

      const params = { policyNo: 'POLICY123', docType: 'PDF' };

      await expect(fetchPolicyDocuments(params)).rejects.toThrow(ApiError);
    });
  });
});