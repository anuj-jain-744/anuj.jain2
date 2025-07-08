import { fetchPolicy } from './policyDetails';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  constant: {
    VITE_BACKEND_MOTOR_URL: 'https://mock-backend-url.com',
  },
  callAPI: jest.fn(),
}));

describe('fetchPolicy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call callAPI with correct parameters', async () => {
    (callAPI as jest.Mock).mockResolvedValueOnce({ data: 'mocked response' });

    const nationalId = '123456789';
    const productCode = 'PRODUCT123';
    const policyNo = 'POLICY123';
    const includeEndoVersion = 'true';

    const response = await fetchPolicy(nationalId, productCode, policyNo, includeEndoVersion);

    expect(callAPI).toHaveBeenCalledWith(
      'post',
      'https://mock-backend-url.com/Dashboard/V1/GetPolicyList',
      {
        nationalID: nationalId,
        productCode: productCode,
        policyNo: policyNo,
        includeEndoVersion: includeEndoVersion,
      }
    );
    expect(response).toEqual({ data: 'mocked response' });
  });

  it('should handle missing optional parameters', async () => {
    (callAPI as jest.Mock).mockResolvedValueOnce({ data: 'mocked response' });

    const nationalId = '123456789';

    const response = await fetchPolicy(nationalId);

    expect(callAPI).toHaveBeenCalledWith(
      'post',
      'https://mock-backend-url.com/Dashboard/V1/GetPolicyList',
      {
        nationalID: nationalId,
        productCode: undefined,
        policyNo: undefined,
        includeEndoVersion: undefined,
      }
    );
    expect(response).toEqual({ data: 'mocked response' });
  });

  it('should throw an error when API call fails', async () => {
    (callAPI as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const nationalId = '123456789';

    await expect(fetchPolicy(nationalId)).rejects.toThrow('API Error');
    expect(callAPI).toHaveBeenCalledWith(
      'post',
      'https://mock-backend-url.com/Dashboard/V1/GetPolicyList',
      {
        nationalID: nationalId,
        productCode: undefined,
        policyNo: undefined,
        includeEndoVersion: undefined,
      }
    );
  });
});