export interface PolicyDetail {
    expiryDate: any;
    ownerId: any;
    productCode: any;
    vehicleSequenceNumber: any;
    policyNo: string;
    isNotificationEnable?: boolean;
    endorsementNo: string | null;
    endorsementType: string | null;
    additionalCode?: string;
    buildingNo?: string;
    creatorId?: string;
    email?: string;
    insurerName?: string;
    issueDate?: string;
    mobileNo?: string;
    nationalID?: string;
    postalCode?: string;
    premium?: number;
    endoSubType?: string | null;
    policyStatus?: string;
    description?: string;
    productName?: string;
}