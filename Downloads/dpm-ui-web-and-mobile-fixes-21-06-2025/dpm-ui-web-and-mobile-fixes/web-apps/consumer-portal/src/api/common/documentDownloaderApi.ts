import { docType, fileExtension } from "constant";
import {
  fetchPolicyDocuments,
  fetchClaimDocuments,
  fetchQuotationDocuments,
  fetchEndorsementDocuments,
  ApiError,
} from './printDocApis';

export type DocumentType = 'policy' | 'endorsement' | 'quotation' | 'claim';
export type DocumentData = Array<{ fileName: string; model: string }>;

export interface DocumentConfig {
  type: DocumentType;
  docType: string;
  enabled: boolean;
  fetchFn: () => Promise<DocumentData>;
}

export interface DownloadParams {
  policyNumber?: string | null;
  quoteNumber?: string;
  endorsementNo?: string | null;
  claimNumber?: string;
  subClaimNumber?: string;
}

export class DocumentDownloaderService {
  private static docTypeMapping: Record<string, string> = {
    // Policy documents
    'Policy Schedule': docType.Policy.Policy_Schedule,
    'Policy Confirmation Letter': docType.Policy.Policy_Confirmation_Letter,
    'Policy Wording': docType.Policy.Policy_Wording,
    'E-Invoice': docType.Policy.E_Invoice,
    
    // Quotation documents
    'Quotation Letter': docType.Quotation.Quotation_Letter,
    
    // Claim documents
    'Claim Acknowledgment Slip': docType.ClaimRegistration.Claim_Acknowledgment_Slip,
    'Bank Transfer Slip': docType.ClaimSettlement.Bank_Transfer_Slip,
    'Credit/Debit Note': docType.ClaimSettlement.Credit_Debit_Note,
    'Claim Rejection letter': docType.ClaimRegistration.Claim_Rejection_Letter,
  };

  static getDocumentTypeMapping(docTypeName: string): string | null {
    return this.docTypeMapping[docTypeName] || null;
  }

  static async fetchDocumentByType(
    documentType: DocumentType,
    docTypeParam: string,
    params: DownloadParams
  ): Promise<DocumentData> {
    try {
      let result: DocumentData;

      switch (documentType) {
        case 'policy':
          result = await fetchPolicyDocuments({ 
            policyNo: params.policyNumber, 
            docType: docTypeParam 
          });
          break;
        case 'endorsement':
          result = await fetchEndorsementDocuments({ 
            endorsementNo: params.endorsementNo, 
            policyNo: params.policyNumber, 
            docType: docTypeParam 
          });
          break;
        case 'quotation':
          result = await fetchQuotationDocuments({ 
            quoteReferenceNo: params.quoteNumber, 
            docType: docTypeParam 
          });
          break;
        case 'claim':
          result = await fetchClaimDocuments({ 
            claimNo: params.claimNumber, 
            subClaimNo: params.subClaimNumber, 
            docType: docTypeParam 
          });
          break;
        default:
          throw new ApiError(`Unknown document type: ${documentType}`);
      }

      // Check if the API returned an error even with 200 status
      if (result && typeof result === 'object' && 'error' in result) {
        throw new ApiError(result.error || `${documentType} documents fetch failed`);
      }

      return result || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch ${documentType} documents`);
    }
  }

  static createDocumentConfigs(params: DownloadParams): DocumentConfig[] {
    const { policyNumber, quoteNumber, endorsementNo, claimNumber, subClaimNumber } = params;

    return [
      {
        type: 'policy',
        docType: docType.Policy.E_Invoice,
        enabled: !!policyNumber,
        fetchFn: () => this.fetchDocumentByType('policy', docType.Policy.E_Invoice, params)
      },
      {
        type: 'policy',
        docType: docType.Policy.Policy_Schedule,
        enabled: !!policyNumber,
        fetchFn: () => this.fetchDocumentByType('policy', docType.Policy.Policy_Schedule, params)
      },
      {
        type: 'policy',
        docType: docType.Policy.Policy_Confirmation_Letter,
        enabled: !!policyNumber,
        fetchFn: () => this.fetchDocumentByType('policy', docType.Policy.Policy_Confirmation_Letter, params)
      },
      {
        type: 'policy',
        docType: docType.Policy.Policy_Wording,
        enabled: !!policyNumber,
        fetchFn: () => this.fetchDocumentByType('policy', docType.Policy.Policy_Wording, params)
      },
      {
        type: 'quotation',
        docType: docType.Quotation.Quotation_Letter,
        enabled: !!quoteNumber,
        fetchFn: () => this.fetchDocumentByType('quotation', docType.Quotation.Quotation_Letter, params)
      },
      {
        type: 'claim',
        docType: docType.ClaimRegistration.Claim_Acknowledgment_Slip,
        enabled: !!claimNumber && !!subClaimNumber,
        fetchFn: () => this.fetchDocumentByType('claim', docType.ClaimRegistration.Claim_Acknowledgment_Slip, params)
      },
      {
        type: 'claim',
        docType: docType.ClaimSettlement.Bank_Transfer_Slip,
        enabled: !!claimNumber && !!subClaimNumber,
        fetchFn: () => this.fetchDocumentByType('claim', docType.ClaimSettlement.Bank_Transfer_Slip, params)
      },
      {
        type: 'claim',
        docType: docType.ClaimSettlement.Credit_Debit_Note,
        enabled: !!claimNumber && !!subClaimNumber,
        fetchFn: () => this.fetchDocumentByType('claim', docType.ClaimSettlement.Credit_Debit_Note, params)
      },
      {
        type: 'claim',
        docType: docType.ClaimRegistration.Claim_Rejection_Letter,
        enabled: !!claimNumber && !!subClaimNumber,
        fetchFn: () => this.fetchDocumentByType('claim', docType.ClaimRegistration.Claim_Rejection_Letter, params)
      }
    ];
  }

  static prepareDocumentsForZip(
    documents: DocumentData,
    folderType: DocumentType
  ): Array<{ fileName: string; model: string }> {
    return documents.map(doc => ({
      ...doc,
      fileName: `${folderType}/${doc.fileName}.${fileExtension.PDF}`
    }));
  }
}