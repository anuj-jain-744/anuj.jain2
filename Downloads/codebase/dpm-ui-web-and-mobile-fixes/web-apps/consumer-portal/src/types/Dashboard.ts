export interface UserProfileData {
    name: string;
    gender: string;
    dateOfBirth: string | null;
    nationalID: string | null;
    address: string;
    ownerFullNameArabic: string;
    ownerDobG: string;
    ownerDobH: string;
    userId: string;
    nationality: string | null;
    nationalityCode: string;
    mobileNumber: string;
    email: string;
    lastUpdatedOn: string | null;
  }

  export interface PolicyDetails {
    additionalCode: string;
    buildingNo: string;
    creatorId: string;
    disabled: boolean;
    email: string;
    endoSubType: string | null;
    endorsementNo: string | null;
    endorsementType: string;
    insurerName: string;
    issueDate: string;
    mobileNo: string;
    nationalID: string;
    policyNo: string;
    postalCode: string;
    premium: number;
    productCode: string;
  }

  export interface PolicyDetail {
    additionalCode?: string;
    buildingNo?: string;
    creatorId?: string;
    email?: string;
    endorsementType?: string;
    insurerName?: string;
    effectiveDate?: string;
    issueDate?: string;
    mobileNo?: string;
    nationalID?: string;
    policyNo?: string;
    postalCode?: string;
    premium?: number | string;
    productCode?: string;
    endoSubType?: string;
    endorsementNo?: string;
    expiryDate?: string;
    policyStatus?: string;
    description?: string;
    productName?: string;
    quoteNo?: string;
    coverageType?: string;
    travellerType?: string;
  }
  
  export interface QuoteDetail {
    effectiveDate?: string;
    expiryDate?: string;
    issueDate?: string;
    nationalID?: string;
    premium?: number;
    productCode?: string;
    quoteNo?: string;
    quoteStatus?: string;
    description?: string;
  }

  export interface ClaimDetails {
    claimNo: string;
    policyNo: string;
    productName: string;
    policyHolderName: string;
    policyHolderId: string;
    dateOfLoss: string;
    dateOfNotification: string;
    dateOfRegistration: string;
    sourceType: string;
    caseReportId: string;
    subClaimStatus: string;
  }

  export enum PolicyStatus {
    Active = "Active",
    Open = "Open",
    Reopen = "Reopen",
    New = "New",
    Cancelled = "Cancelled",
    Closed = "Closed",
    Reject = "Reject",
    Expired = "Expired",
    ClaimRegister = "Claim Register",
  }