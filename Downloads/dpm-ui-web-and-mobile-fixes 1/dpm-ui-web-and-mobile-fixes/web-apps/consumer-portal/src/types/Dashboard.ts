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