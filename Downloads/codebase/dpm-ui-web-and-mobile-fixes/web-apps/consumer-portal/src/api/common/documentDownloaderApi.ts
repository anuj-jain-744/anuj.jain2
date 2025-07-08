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
  transType?: string;
  fetchFn: () => Promise<DocumentData>;
}

export interface DownloadParams {
  policyNumber?: string | null;
  quoteNumber?: string;
  endorsementNo?: string | null;
  claimNumber?: string;
  subClaimNumber?: string;
  transType?: string | null;
}

  export class DocumentDownloaderService {

    private static docTypeMapping: Record<string, { code: string; transType?: string }> = {
      // Policy documents
      'Policy Schedule': docType.Policy.Policy_Schedule,
      'Policy Confirmation Letter': docType.Policy.Policy_Confirmation_Letter,
      'E-Invoice': docType.Policy.E_Invoice,
      
      // Quotation documents
      'Quotation Letter': docType.Quotation.Quotation_Letter,
      
      // Claim documents
      'Claim Acknowledgment Slip': docType.ClaimRegistration.Claim_Acknowledgment_Slip,
      'Bank Transfer Slip': docType.ClaimSettlement.Bank_Transfer_Slip,
      'Credit/Debit Note': docType.ClaimSettlement.Credit_Debit_Note,
      'Claim Rejection letter': docType.ClaimRegistration.Claim_Rejection_Letter,
      'Motor Claim Direction Letter': docType.ClaimFieldInvestigation.Motor_Claim_Direction_Letter,
      'Motor Claim Repair Approval': docType.ClaimFieldInvestigation.Motor_Claim_Repair_Approval,
      'Motor Claim Total Loss Offer': docType.ClaimTotalloss.Motor_Claim_Total_Loss_Offer,
    };
  
    static getDocumentTypeMapping(docTypeName: string): string | null {
      const mapping = this.docTypeMapping[docTypeName];
      return mapping ? mapping.code : null;
    }
  
    static getTransTypeMapping(docTypeName: string): string | null {
      return this.docTypeMapping[docTypeName].transType || null;
    }
  
    static async fetchDocumentByType(
      documentType: DocumentType,
      docTypeParam: string,
      params: DownloadParams,
      transType?: string | null | undefined
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
            if (!params.claimNumber && !params.subClaimNumber) {
              throw new ApiError("Policy does not have any claim. Please check the claim number and sub-claim number.");
            }
            result = await fetchClaimDocuments({ 
              transType: transType, 
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


    static createDocumentConfigs(
      params: DownloadParams,
      customDocNames?: string[]
    ): DocumentConfig[] {
      const { policyNumber, quoteNumber, endorsementNo, claimNumber, subClaimNumber } = params;
  
      // Mapping from docType code to docName
      const codeToDocName: Record<string, string> = {
        [docType.Policy.E_Invoice.code]: 'E-Invoice',
        [docType.Policy.Policy_Schedule.code]: 'Policy Schedule',
        [docType.Policy.Policy_Confirmation_Letter.code]: 'Policy Confirmation Letter',
        [docType.Policy.Policy_Wording.code]: 'Policy Wording',
  
        [docType.Quotation.Quotation_Letter.code]: 'Quotation Letter',
  
        [docType.ClaimRegistration.Claim_Acknowledgment_Slip.code]: 'Claim Acknowledgment Slip',
        [docType.ClaimSettlement.Bank_Transfer_Slip.code]: 'Bank Transfer Slip',
        [docType.ClaimSettlement.Credit_Debit_Note.code]: 'Credit/Debit Note',
        [docType.ClaimRegistration.Claim_Rejection_Letter.code]: 'Claim Rejection Letter',
  
        [docType.ClaimFieldInvestigation.Motor_Claim_Direction_Letter.code]: 'Motor Claim Direction Letter',
        [docType.ClaimFieldInvestigation.Motor_Claim_Repair_Approval.code]: 'Motor Claim Repair Approval',
        [docType.ClaimFieldInvestigation.Motor_Claim_Repair_Authorization.code]: 'Motor Claim Repair Authorization',
  
        [docType.ClaimRegistration.Motor_Claim_Receipt_Letter.code]: 'Motor Claim Receipt Letter',
        [docType.ClaimRegistration.Motor_Theft_Letter.code]: 'Motor Theft Letter',
  
        [docType.ClaimSettlement.Claim_Approval_Form.code]: 'Claim Approval Form',
        [docType.ClaimSettlement.Discharge_Slip_With_Subro_Wording.code]: 'Discharge Slip With Subro Wording',
        [docType.ClaimSettlement.Discharge_Slip_Without_Subro_Wording.code]: 'Discharge Slip Without Subro Wording',
        [docType.ClaimSettlement.Transfer_Request.code]: 'Transfer Request',
  
        [docType.ClaimTotalloss.Motor_Claim_Total_Loss_Offer.code]: 'Motor Claim Total Loss Offer',
        [docType.ClaimTowing.Motor_Claim_Towing_Letter.code]: 'Motor Claim Towing Letter',
      };
  
      const allConfigs: DocumentConfig[] = [
        // Policy
        {
          type: 'policy',
          docType: docType.Policy.E_Invoice.code,
          enabled: !!policyNumber,
          fetchFn: () => this.fetchDocumentByType('policy', docType.Policy.E_Invoice.code, params)
        },
        {
          type: 'policy',
          docType: docType.Policy.Policy_Schedule.code,
          enabled: !!policyNumber,
          fetchFn: () => this.fetchDocumentByType('policy', docType.Policy.Policy_Schedule.code, params)
        },
        {
          type: 'policy',
          docType: docType.Policy.Policy_Confirmation_Letter.code,
          enabled: !!policyNumber,
          fetchFn: () => this.fetchDocumentByType('policy', docType.Policy.Policy_Confirmation_Letter.code, params)
        },
        {
          type: 'policy',
          docType: docType.Policy.Policy_Wording.code,
          enabled: !!policyNumber,
          fetchFn: () => this.fetchDocumentByType('policy', docType.Policy.Policy_Wording.code, params)
        },
  
        // Quotation
        {
          type: 'quotation',
          docType: docType.Quotation.Quotation_Letter.code,
          enabled: !!quoteNumber,
          fetchFn: () => this.fetchDocumentByType('quotation', docType.Quotation.Quotation_Letter.code, params)
        },
  
        // Claims
        {
          type: 'claim',
          docType: docType.ClaimRegistration.Claim_Acknowledgment_Slip.code,
          transType: docType.ClaimRegistration.Claim_Acknowledgment_Slip.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimRegistration.Claim_Acknowledgment_Slip.code,
            params,
            docType.ClaimRegistration.Claim_Acknowledgment_Slip.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimSettlement.Bank_Transfer_Slip.code,
          transType: docType.ClaimSettlement.Bank_Transfer_Slip.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimSettlement.Bank_Transfer_Slip.code,
            params,
            docType.ClaimSettlement.Bank_Transfer_Slip.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimSettlement.Credit_Debit_Note.code,
          transType: docType.ClaimSettlement.Credit_Debit_Note.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimSettlement.Credit_Debit_Note.code,
            params,
            docType.ClaimSettlement.Credit_Debit_Note.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimRegistration.Claim_Rejection_Letter.code,
          transType: docType.ClaimRegistration.Claim_Rejection_Letter.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimRegistration.Claim_Rejection_Letter.code,
            params,
            docType.ClaimRegistration.Claim_Rejection_Letter.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimFieldInvestigation.Motor_Claim_Direction_Letter.code,
          transType: docType.ClaimFieldInvestigation.Motor_Claim_Direction_Letter.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimFieldInvestigation.Motor_Claim_Direction_Letter.code,
            params,
            docType.ClaimFieldInvestigation.Motor_Claim_Direction_Letter.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimFieldInvestigation.Motor_Claim_Repair_Approval.code,
          transType: docType.ClaimFieldInvestigation.Motor_Claim_Repair_Approval.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimFieldInvestigation.Motor_Claim_Repair_Approval.code,
            params,
            docType.ClaimFieldInvestigation.Motor_Claim_Repair_Approval.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimFieldInvestigation.Motor_Claim_Repair_Authorization.code,
          transType: docType.ClaimFieldInvestigation.Motor_Claim_Repair_Authorization.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimFieldInvestigation.Motor_Claim_Repair_Authorization.code,
            params,
            docType.ClaimFieldInvestigation.Motor_Claim_Repair_Authorization.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimRegistration.Motor_Claim_Receipt_Letter.code,
          transType: docType.ClaimRegistration.Motor_Claim_Receipt_Letter.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimRegistration.Motor_Claim_Receipt_Letter.code,
            params,
            docType.ClaimRegistration.Motor_Claim_Receipt_Letter.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimRegistration.Motor_Theft_Letter.code,
          transType: docType.ClaimRegistration.Motor_Theft_Letter.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimRegistration.Motor_Theft_Letter.code,
            params,
            docType.ClaimRegistration.Motor_Theft_Letter.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimSettlement.Claim_Approval_Form.code,
          transType: docType.ClaimSettlement.Claim_Approval_Form.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimSettlement.Claim_Approval_Form.code,
            params,
            docType.ClaimSettlement.Claim_Approval_Form.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimSettlement.Discharge_Slip_With_Subro_Wording.code,
          transType: docType.ClaimSettlement.Discharge_Slip_With_Subro_Wording.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimSettlement.Discharge_Slip_With_Subro_Wording.code,
            params,
            docType.ClaimSettlement.Discharge_Slip_With_Subro_Wording.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimSettlement.Discharge_Slip_Without_Subro_Wording.code,
          transType: docType.ClaimSettlement.Discharge_Slip_Without_Subro_Wording.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimSettlement.Discharge_Slip_Without_Subro_Wording.code,
            params,
            docType.ClaimSettlement.Discharge_Slip_Without_Subro_Wording.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimSettlement.Transfer_Request.code,
          transType: docType.ClaimSettlement.Transfer_Request.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimSettlement.Transfer_Request.code,
            params,
            docType.ClaimSettlement.Transfer_Request.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimTotalloss.Motor_Claim_Total_Loss_Offer.code,
          transType: docType.ClaimTotalloss.Motor_Claim_Total_Loss_Offer.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimTotalloss.Motor_Claim_Total_Loss_Offer.code,
            params,
            docType.ClaimTotalloss.Motor_Claim_Total_Loss_Offer.transType
          )
        },
        {
          type: 'claim',
          docType: docType.ClaimTowing.Motor_Claim_Towing_Letter.code,
          transType: docType.ClaimTowing.Motor_Claim_Towing_Letter.transType,
          enabled: !!claimNumber && !!subClaimNumber,
          fetchFn: () => this.fetchDocumentByType(
            'claim',
            docType.ClaimTowing.Motor_Claim_Towing_Letter.code,
            params,
            docType.ClaimTowing.Motor_Claim_Towing_Letter.transType
          )
        },
      ];
  
      // If customDocNames are provided, filter here
      if (customDocNames && customDocNames.length > 0) {
        return allConfigs.filter(config => {
          const docName = codeToDocName[config.docType];
          return docName && customDocNames.includes(docName);
        });
      }
  
      return allConfigs;
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