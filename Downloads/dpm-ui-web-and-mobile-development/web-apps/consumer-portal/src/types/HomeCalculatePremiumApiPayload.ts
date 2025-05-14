export interface TyperFormAddressSelection {
  propertyNo: string;
  propertyFloor: string;
  propertyBuildYear: string;
  propertyType: TypeSwicthTabsType;
  propertyNearCoastline: TypeSwicthTabsType;
};

export interface PropertyMap {
    longitude: number|string;
    latitude: number|string;
}

type addressData {
    addresses: any;
}

export interface UserInfo {
    ownerId: string;
    addressData: addressData;
    ownerDetail: {
        gender: string;
        nationality: string;
        ownerDobG: string;
    };
}

type policyCoverage = {
     coverageCode?: string;
     declarationItem?: any;
}

type policyRisk = {
    cityDistrict: string;
    question7: number;
    question6: number;
    interestTypeHOME: string;
    interestDescription: string;
    riskName: string;
    yearOfConstruction:number | string;
    buildingAge: number | string;
    noOfFloors: number | string;
    question7Details: string;
    question5: number;
    question4: number;
    question3: number;
    question2: number;
    question1: number;
    policyCoverage?:policyCoverage[];
}

type policyCustomer = {
    nationalId?: string;
    nationality?: string;
    dateOfBirth?: string;
    gender?: string;
}

export interface CalculatePremiumApiPayload {
    ownerOrTenant: number;
    riskDescription: string;
    schemeCode: string;
    typeOfCoverage: number;
    policyRisk: policyRisk[];
    policyCustomer: policyCustomer;
}

type taxFeeBreakdowns = {
    percentage: number;
}

type pricingOptions = {
    finalAmount: number;
    taxFeeBreakdowns: taxFeeBreakdowns[];
}

export interface CalculatePremiumApiResponse {
    length: number;
    pricingOptions: pricingOptions[];
}

