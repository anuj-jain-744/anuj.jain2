import { fetchQueryQuote, fetchQueryClaim } from './myRequests';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  constant: {
    VITE_BACKEND_COMMON_UTILITY_URL: 'https://mock-utility-url.com',
    VITE_BACKEND_COMMON_DASHBOARD_URL: 'https://mock-dashboard-url.com',
  },
  callAPI: jest.fn(),
}));

describe('myRequests API functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchQueryQuote', () => {
    it('should call callAPI with correct parameters', async () => {
      (callAPI as jest.Mock).mockResolvedValueOnce({ data: 'mocked quote response' });

      const nationalID = '123456789';
      const quoteNo = 'QUOTE123';

      const response = await fetchQueryQuote(nationalID, quoteNo);

      expect(callAPI).toHaveBeenCalledWith(
        'post',
        'https://mock-utility-url.com/Common/Utility/Query/V1/queryQuote',
        {
          quoteNo: quoteNo,
          najmID: null,
          schemeCode: null,
          virtualBranch: null,
          mobileNo: null,
          nationalID: nationalID,
          insurerName: null,
        }
      );
      expect(response).toEqual({ data: 'mocked quote response' });
    });

    it('should handle API errors', async () => {
      (callAPI as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const nationalID = '123456789';
      const quoteNo = 'QUOTE123';

      await expect(fetchQueryQuote(nationalID, quoteNo)).rejects.toThrow('API Error');
      expect(callAPI).toHaveBeenCalledWith(
        'post',
        'https://mock-utility-url.com/Common/Utility/Query/V1/queryQuote',
        {
          quoteNo: quoteNo,
          najmID: null,
          schemeCode: null,
          virtualBranch: null,
          mobileNo: null,
          nationalID: nationalID,
          insurerName: null,
        }
      );
    });
  });

  describe('fetchQueryClaim', () => {
    it('should call callAPI with correct parameters', async () => {
      (callAPI as jest.Mock).mockResolvedValueOnce({ data: 'mocked claim response' });

      const ownerId = '123456789';
      const policyNo = 'POLICY123';

      const response = await fetchQueryClaim(ownerId, policyNo);

      expect(callAPI).toHaveBeenCalledWith(
        'post',
        'https://mock-dashboard-url.com/Common/Dashboard/V1/QueryClaim',
        {
          idNumber: ownerId,
          policyNo: policyNo,
        }
      );
      expect(response).toEqual({ data: 'mocked claim response' });
    });

    it('should handle API errors', async () => {
      (callAPI as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const ownerId = '123456789';
      const policyNo = 'POLICY123';

      await expect(fetchQueryClaim(ownerId, policyNo)).rejects.toThrow('API Error');
      expect(callAPI).toHaveBeenCalledWith(
        'post',
        'https://mock-dashboard-url.com/Common/Dashboard/V1/QueryClaim',
        {
          idNumber: ownerId,
          policyNo: policyNo,
        }
      );
    });
  });
});