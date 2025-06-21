import { DateObject } from "react-multi-date-picker";

interface PolicyCoverage {
  coverageCode: string;
}

interface PolicyRisk {
  dateOfBirth: string;
  dateOfBirthH: string;
  relation: string;
  travellerNameEnglish: string;
  travellerNameArabic: string;
  personAge: number;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiryDate: string;
  policyCoverage: PolicyCoverage[];
}

interface PolicyCustomer {
  nationalId: string;
  gender: string;
  customerNameEnglish: string;
  customerNameArabic: string;
  nationality: string;
  dateOfBirth: string;
  mobile: string;
}

export interface CalculatePremiumApiPayload {
  policyEffectiveDate: string;
  travelDateRange: DateObject[];
  familyIndividual: string;
  plan: string;
  ratingType: string;
  policyRisk: PolicyRisk[];
  policyCustomer: PolicyCustomer;
  schemeCode?: string;
}

interface NumberofTravllers {
  adult: string;
  childre : string;
  srCitizen: string;
  
}
export interface CoveragePanPremiumApiPayload {
  policyEffectiveDate: string;
  travelDateRange: DateObject[];
  familyIndividual: string;
  noOfTravelers: NumberofTravllers;
  policyCustomer: PolicyCustomer;
}