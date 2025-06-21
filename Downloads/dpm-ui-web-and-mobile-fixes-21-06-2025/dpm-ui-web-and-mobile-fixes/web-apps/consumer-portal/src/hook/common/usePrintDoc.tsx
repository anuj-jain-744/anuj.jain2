import { useQuery } from '@tanstack/react-query';
import {
  fetchPolicyDocuments,
  fetchClaimDocuments,
  fetchQuotationDocuments,
  fetchEndorsementDocuments,
  ApiError,
} from '../../api/common/printDocApis';

export interface PolicyDocumentsParams {
  docType: string | null;
  policyNo: string | null;
}

export interface ClaimDocumentsParams {
  docType: string | null;
  claimNo: string | null;
  subClaimNo: string | null;
}

export interface QuotationDocumentsParams {
  docType: string | null;
  quoteReferenceNo: string | null;
}

export interface EndorsementDocumentsParams {
  docType: string | null;
  endorsementNo: string | null;
  policyNo: string | null;
}

type DocumentData = Array<{ fileName: string; model: string }>;

/**
 * Policy Documents Hook
 */
export const usePolicyDocuments = ({ policyNo, docType }: PolicyDocumentsParams) => {
  return useQuery<DocumentData, ApiError>({
    queryKey: ['policyDocuments', policyNo, docType],
    queryFn: () => fetchPolicyDocuments({ policyNo, docType }),
    enabled: !!policyNo && !!docType,
    retry: (failureCount) => failureCount < 3,
    staleTime: 0,
  });
};

/**
 * Claim Documents Hook
 */
export const useClaimDocuments = ({ claimNo, subClaimNo, docType }: ClaimDocumentsParams) => {
  return useQuery<DocumentData, ApiError>({
    queryKey: ['claimDocuments', claimNo, subClaimNo, docType],
    queryFn: () => fetchClaimDocuments({ claimNo, subClaimNo, docType }),
    enabled: !!claimNo && !!subClaimNo && !!docType,
    retry: (failureCount) => failureCount < 3,
    staleTime: 0,
  });
};

/**
 * Quotation Documents Hook
 */
export const useQuotationDocuments = ({ quoteReferenceNo, docType }: QuotationDocumentsParams) => {
  return useQuery<DocumentData, ApiError>({
    queryKey: ['quotationDocuments', quoteReferenceNo, docType],
    queryFn: () => fetchQuotationDocuments({ quoteReferenceNo, docType }),
    enabled: !!quoteReferenceNo && !!docType,
    retry: (failureCount) => failureCount < 3,
    staleTime: 0,
  });
};

/**
 * Endorsement Documents Hook
 */
export const useEndorsementDocuments = ({ endorsementNo, policyNo, docType }: EndorsementDocumentsParams) => {
  return useQuery<DocumentData, ApiError>({
    queryKey: ['endorsementDocuments', endorsementNo, policyNo, docType],
    queryFn: () => fetchEndorsementDocuments({ endorsementNo, policyNo, docType }),
    enabled: !!endorsementNo && !!policyNo && !!docType,
    retry: (failureCount) => failureCount < 3,
    staleTime: 0,
  });
};
