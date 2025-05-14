import  { constant, types, callAPI } from '@dpm/shared-module';

interface QuoteRequestBody {
    quoteNo: string | null;
    najmID: string | null;
    schemeCode: string | null;
    virtualBranch: string | null;
    mobileNo: string | null;
    nationalID: string | null;
    insurerName: string | null;
  }


  const { VITE_BACKEND_COMMON_UTILITY_URL, VITE_BACKEND_COMMON_DASHBOARD_URL } = constant;
export const fetchQueryQuote = async (nationalID: string | null, quoteNo: string | null) => {
    const requestBody: QuoteRequestBody = {
        quoteNo: quoteNo,
        najmID: null,
        schemeCode: null,
        virtualBranch: null,
        mobileNo: null,
        nationalID: nationalID,
        insurerName: null
      };
    try {
        const response = await callAPI('post', `${VITE_BACKEND_COMMON_UTILITY_URL}/Common/Utility/Query/V1/queryQuote`, requestBody);
        return response;
    } catch (error) {
        console.error('Failed to fetch policy:', error);
        throw error;
    }
};

export interface ClaimRequestBody {
  idNumber?: string | null | undefined;
  policyNo?: string | null | undefined;
}


export const fetchQueryClaim = async (ownerId: string, PolicyNo: string) => {
  const requestBody: ClaimRequestBody = {
    ...(ownerId && { idNumber: ownerId }),
    ...(PolicyNo && { policyNo: PolicyNo }),
  };

  try {
    const response = await callAPI(
      'post',
      `${VITE_BACKEND_COMMON_DASHBOARD_URL}/Common/Dashboard/V1/QueryClaim`,
      requestBody
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch claim data:', error);
    throw error;
  }
};
