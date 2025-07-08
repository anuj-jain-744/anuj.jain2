 import ComprehensiveBanner from "../../src/assets/Travel/wordwide.png"
 import ThirdpartyBanner from "../../src/assets/Travel/wordwideexceptusa.png";
 import europeCoverImage from "assets/Travel/europe_cover.png";
 import { CompensationTypeKeys } from "types/coverageplan";

/// image factory function that reads the key and returns right banner for CompensationType
export const CompensationType = (name: CompensationTypeKeys) => {
  const CompensationTypeObj = {
    worldwide: ComprehensiveBanner,
    worldwide_except_usa: ThirdpartyBanner,
    europe: europeCoverImage
  };
  return CompensationTypeObj[name];
};

// Card factory function that reads the key and returns right selected card for CompensationType
export const CompensationTypeCard = (name: CompensationTypeKeys) => {
  const CompensationTypeCardObj = {
    worldwide: "worldwide",
    worldwide_except_usa: "worldwide_except_usa",
    europe:"europe",
  };
  return CompensationTypeCardObj[name];
};

export interface CMSRule {
  condition: {
    feildName: string;
    fieldName: string;
    operator: string;
    value: string | number | null;
  }[];
  documents: {
    key: string;
    value: string;
    required: boolean;
  }[];
}
 
export interface CMSRuleSection {
  home?: CMSRule[];
  motor?: CMSRule[];
}
export interface CMSDocument {
  key: string;
  value: string;
  required: boolean;
}

export type DocType = {
  Policy: {
    Policy_Schedule: string;
    Policy_Confirmation_Letter: string;
    Policy_Wording: string;
    E_Invoice: string;
  };
  Endorsement: {
    Endorsement_Letter: string;
    Risk_Object_Certificates: string;
    Policy_Wording: string;
    Endorsement_Schedule_Letter: string;
    E_Invoice: string;
    Policy_Confirmation_Letter: string;
  };
  Quotation: {
    Quotation_Letter: string;
    Policy_Schedule_Draft: string;
    Risk_Object_Certificates_Draft: string;
    Premium_Debit_Note_Draft: string;
  };
  ClaimSettlement: {
    Bank_Transfer_Slip: { code: string; transType: string };
    Credit_Debit_Note: { code: string; transType: string };
    Claim_Approval_Form: { code: string; transType: string };
    Discharge_Slip_With_Subro_Wording: { code: string; transType: string };
    Discharge_Slip_Without_Subro_Wording: { code: string; transType: string };
    Transfer_Request: { code: string; transType: string };
  };
  ClaimRegistration: {
    Claim_Rejection_Letter: { code: string; transType: string };
    Claim_Acknowledgment_Slip: { code: string; transType: string };
    Motor_Claim_Receipt_Letter: { code: string; transType: string };
    Motor_Theft_Letter: { code: string; transType: string };
  };
  ClaimFieldInvestigation: {
    Motor_Claim_Direction_Letter: { code: string; transType: string };
    Motor_Claim_Repair_Approval: { code: string; transType: string };
    Motor_Claim_Repair_Authorization: { code: string; transType: string };
  };
  ClaimTotalloss: {
    Motor_Claim_Total_Loss_Offer: { code: string; transType: string };
  };
  ClaimTowing: {
    Motor_Claim_Towing_Letter: { code: string; transType: string };
  };
};
