// Policy Types
export interface Policy {
    policyNo: string;
    issueDate: string;
    expiryDate: string;
    mobileNo: string;
    email: string;
    nationalId: string;
    premium: number;
    endorsementType: string;
    endorsementNo: string;
    productCode: string;
}

export interface PolicyState {
    policies: Policy[] | null;
    loading: boolean;
    error: string;
    isAuthorized: boolean;
}