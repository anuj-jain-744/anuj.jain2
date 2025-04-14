import  { constant, types, callAPI } from '@dpm/shared-module';

interface QuoteRequestBody {
    quoteNo: string;
    najmID: string | null;
    schemeCode: string | null;
    virtualBranch: string | null;
    mobileNo: string | null;
    nationalID: string;
    insurerName: string | null;
  }


export const fetchQueryQuote = async (nationalID: string, quoteNo: string) => {
    const requestBody: QuoteRequestBody = {
        quoteNo: quoteNo ?? "Q-25-605-0003178",
        najmID: null,
        schemeCode: null,
        virtualBranch: null,
        mobileNo: null,
        nationalID: nationalID ?? "108881301",
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
