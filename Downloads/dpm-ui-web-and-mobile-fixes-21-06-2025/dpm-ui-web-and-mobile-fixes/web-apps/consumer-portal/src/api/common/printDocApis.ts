import { constant, callAPI } from '@dpm/shared-module';
import {
  PolicyDocumentsParams,
  ClaimDocumentsParams,
  QuotationDocumentsParams,
  EndorsementDocumentsParams,
} from 'hook/common/usePrintDoc';

const { VITE_BACKEND_COMMON_DASHBOARD_URL } = constant;

// Define the API response type
interface ApiResponse {
  code: number;
  transactionId: string | null;
  customerRefNum: string | null;
  message: string;
  data: Array<{
    fileName: string;
    model: string;
  }> | null;
  errors: Array<{
    name: string;
    code: string;
    messages: {
      message_en: string;
      message_ar: string;
      details: {
        field: string | null;
        additionalInfo: string;
      };
    };
  }> | null;
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public transactionId: string | null,
    public customerRefNum: string | null,
    public errors: ApiResponse['errors'],
    public messageEn: string,
    public messageAr: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper to extract error messages
const extractErrorMessages = (apiResponse: ApiResponse) => {
  const messageEn = apiResponse?.errors?.[0]?.messages?.message_en || apiResponse?.message || '';
  const messageAr = apiResponse?.errors?.[0]?.messages?.message_ar || apiResponse?.message || '';
  return { messageEn, messageAr };
};

// Helper to handle API errors
const handleApiError = (apiResponse: ApiResponse) => {
  const { messageEn, messageAr } = extractErrorMessages(apiResponse);
  throw new ApiError(
    messageEn,
    apiResponse?.code || 0,
    apiResponse?.transactionId || null,
    apiResponse?.customerRefNum || null,
    apiResponse?.errors || null,
    messageEn,
    messageAr
  );
};

export const fetchClaimDocuments = async ({
  claimNo,
  subClaimNo,
  docType,
}: ClaimDocumentsParams) => {
  const requestBody = { docType, claimNo, subClaimNo };
  try {
    const response = await callAPI(
      'post',
      `${VITE_BACKEND_COMMON_DASHBOARD_URL}/Dashboard/V1/Download/Claim`,
      requestBody
    );
    const apiResponse: ApiResponse = response;
    if (apiResponse?.code !== 1) {
      handleApiError(apiResponse);
    }
    return apiResponse.data || [];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Failed to fetch claim documents:', error);
    throw error;
  }
};

export const fetchQuotationDocuments = async ({
  quoteReferenceNo,
  docType,
}: QuotationDocumentsParams) => {
  const requestBody = { docType, quoteReferenceNo };
  try {
    const response = await callAPI(
      'post',
      `${VITE_BACKEND_COMMON_DASHBOARD_URL}/Dashboard/V1/Download/Quotation`,
      requestBody
    );
    const apiResponse: ApiResponse = response;
    if (apiResponse?.code !== 1) {
      handleApiError(apiResponse);
    }
    return apiResponse.data || [];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Failed to fetch quotation documents:', error);
    throw error;
  }
};

export const fetchEndorsementDocuments = async ({
  endorsementNo,
  policyNo,
  docType,
}: EndorsementDocumentsParams) => {
  const requestBody = { docType, endorsementNo, policyNo };
  try {
    const response = await callAPI(
      'post',
      `${VITE_BACKEND_COMMON_DASHBOARD_URL}/Dashboard/V1/Download/Endorsement`,
      requestBody
    );
    const apiResponse: ApiResponse = response;
    if (apiResponse?.code !== 1) {
      handleApiError(apiResponse);
    }
    return apiResponse.data || [];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Failed to fetch endorsement documents:', error);
    throw error;
  }
};

export const fetchPolicyDocuments = async ({
  policyNo,
  docType,
}: PolicyDocumentsParams) => {
  const requestBody = { docType, policyNo };
  try {
    const response = await callAPI(
      'post',
      `${VITE_BACKEND_COMMON_DASHBOARD_URL}/Dashboard/V1/Download/Policy`,
      requestBody
    );
    const apiResponse: ApiResponse = response;
    if (apiResponse?.code !== 1) {
      handleApiError(apiResponse);
    }
    return apiResponse.data || [];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Failed to fetch policy documents:', error);
    throw error;
  }
};