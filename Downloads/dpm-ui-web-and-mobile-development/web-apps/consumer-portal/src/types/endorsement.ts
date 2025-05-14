
import { CompensationTypeKeys } from "./coverageplan";
import { DriverProps } from "./driver";
import { DriverDetailsResponseData } from "./quoteAndBuy";
export interface NewDriverProps {
  driverNameArabic: string;
  driverName: string;
  premium: number;
  driverID: string;
  relation?: number;
}

export interface AddDriverProps {
  taxableAmount: number;
  totalAmount: number;
  vatAmount: number;
  driver?: DriverProps;
}

type policyDetails = {
  premiumInfo: { finalPremium: number };
  benefitCategory: string;
  coverageCode: string;
  coverageName?: CompensationTypeKeys | null;
}

export interface ViewPolicy {
  policyLob: [{
    planCode: string, policyRisk: [
      { vehicleCustomID?:string; manufactureYear?:string; drivers: DriverDetailsResponseData[], vehicleSequenceNo: string | null, vehicleOwnerId: string | null, policyCoverage?: [policyDetails | undefined] }, { policyCoverage?: [policyDetails] }, { policyCoverage?: [policyDetails] },
    ]
  }],
  policyCustomer: [{ dateOfBirth?: string; dateOfBirthH?: string; nationalId: string; customerNameArabic: string, customerNameEnglish: string, primaryAddress: {} }],
  policyCoverage: [{ coverageCode: string, premiumInfo: { finalPremium: number } }]
  policyBasic: { effectiveDate: string, policyNumber: string, expiryDate: string, quoteDate: string, premiumInfo: { finalPremium: number, taxFeeBreakdowns: [{ percentage: number; }] } };
}

export interface EndorsmentPolicyRisk {
  policyCoverage: [{
    benefitCategory: string, coverageCode: string, premiumInfo: { finalPremium: number }
  }]
}

export interface PolicyInterestUpdate {
  policyEffectiveDate: string,
  policyExpiryDate: string,
  vatAmount: number,
  policyRisk: EndorsmentPolicyRisk[]
}

interface BenefitsPremiumData {
  benefitCategory: string,
  benefitCode: string,
  benefitNameAr: string,
  benefitNameEn: string,
  benefitPrice: number,
  effectiveDate: string,
  expiryDate: string,
  vatAmount: number,
  isSelected: boolean
}

export interface PolicyEndorsementPayemt {
  policyNo: string,
  benefitsPremiumData: BenefitsPremiumData[],
  orderSummary: { policyBenefits: [], subtotal: number; vatAmount: number; netPremium: number } | null;
}

export interface PolicyEndorsementDetails {
  policyNo: string,
  selectedPolicyNumber: string | null;
  viewPolicy: ViewPolicy;
  orderSummary: { policyBenefits: [], subtotal: number; vatAmount: number; netPremium: number } | null | boolean;
  benefitsClaimed?: any;
  loading: boolean;
  isBenefitLoaded: string | null;
  requestPaymentData: PolicyEndorsementPayemt | null;
  isTermCondition: boolean;
  endorsementNo: string | null;
  purchasedBenefits: EndorsmentPolicyRisk[] | null;
 }



