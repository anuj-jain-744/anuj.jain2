// Define the type for the request body
interface RequestBody {
  apiSource: string;
  transType: string;
  docType: number;
  endorsementNo: string;
  policyNo: string;
  language: string;
  loginUser: {
    userId: string;
    isBrokerUser: string;
  };
}

// Define the return type for the hook
interface UseSagApiCallReturn {
  makeApiCall: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  data: any | null;
}

interface LanguageData {
  download_all?: string;
  renew_you_policy?: string;
  endorsements?: string;
  back?: string;
  comprehensive?: string;
  policy_placeholder?: string;
  policy_documents?: string;
  quotation?: string;
  policy_related?: string;
  endorsement_related?: string;
  claims_related?: string;
}

interface DocumentData {
  id: string;
  name: string;
  document: string;
}

interface DocumentClaimData{

  fileName: string;
  model: string;
}

interface PDFDataStructure {
  endorsementData: DocumentData[];
  policyData: DocumentData[];
  quotationData: DocumentData[];
  claimsData?: DocumentClaimData[];
}

interface PolicyPayload {
  policyNo: string;
  endorsementNo?: string;
  quoteReferenceNo?: string;
}

interface PdfDocument {
  name: string;
  data: Uint8Array;
}

interface DocumentData {
  id: string;
  name: string;
  document: string;
}


interface DocumentSection {
  id: string;
  name: string;
  document: string;
}

export type {
  RequestBody,
  UseSagApiCallReturn,
  LanguageData,
  PolicyPayload,
  PdfDocument,
  DocumentData,
  PDFDataStructure,
  DocumentSection,
};
