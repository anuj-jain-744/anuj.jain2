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
    const { VITE_BACKEND_COMMON_UTILITY_URL } = constant;
    try {
        const response = await callAPI('post', `${VITE_BACKEND_COMMON_UTILITY_URL}/Common/Utility/Query/V1/queryQuote`, requestBody);
        return response;
    } catch (error) {
        console.error('Failed to fetch policy:', error);
        throw error;
    }
};
