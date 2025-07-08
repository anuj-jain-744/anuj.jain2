import { AddDriverProps } from "types/endorsement";

export interface EndorsementDataProps {
    benefitsPremiumData: {
      benefitNameEn: string;
      effectiveDate: string;
      benefitPrice: string | number;
      vatAmount: string | number;
      expiryDate: string;
    }[];
    driversPremiumData?: AddDriverProps[];
    productType?: string; 
    totalAmount:{totalAmount:number}
    selectBenefit: {
        benefit: boolean
    },
    selectManagerDriver: {
        manage: boolean
    },
    endoEffectiveDate: string
}
export interface ClaimDataProps {
  claimLabel: string;
  claimNo: string;
  claimsInfo: {
    refNo: string;
    ownerId: string;
    SourceType: number;
    type: string;
    mailPhone: string;
    sessionId: string;
  };
  claimResponse: {
    claimNo: string;
    status: string;
  };
  validationData:{
    ownerName: string;
    referenceNo: string;
    claimRequestType: string;
    caseReportId: string | null;
    ownerId: string | null;
    vehicleOwnerDob: string | null;
    vehicleOwnerDobArabicH: string | null;
    sequenceNo: string;
    estimatedAmount: number | null;
    liability: string;
    mobileNo: number;
    email: string;
    city: string;
    claimSystem: string;
    validationResult: string | null;
    policyNumber: string;
    vehicleMake: string;
    vehicleMakeTextEn: string;
    vehicleModel: string;
    vehicleModelTextEn: string;
    plateNo: string;
    policyExpiryDate: string | null;
    policyStartDate: string | null;
  }
}