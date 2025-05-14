import ComprehensiveBanner from "assets/QuoteAndBuy/ComprehensiveBanner.png";
import ThirdpartyBanner from "assets/QuoteAndBuy/ThirdpartyBanner.png";
import { CompensationTypeKeys } from "types/coverageplan";
import { PolicyDetails } from "types/quoteAndBuy";
import { deductibleReferenceNo } from "../ConstantValue/ConstantValue";
import { repairCond } from "../../../../constant";

// image factory function that reads the key and returns right banner for CompensationType
export const compensationType = (name: CompensationTypeKeys) => {
  const CompensationTypeObj = {
    comprehensive: ComprehensiveBanner,
    thirdparty: ThirdpartyBanner,
  };
  return CompensationTypeObj[name];
};

// Card factory function that reads the key and returns right selected card for CompensationType
export const compensationTypeCard = (name: CompensationTypeKeys) => {
  const CompensationTypeCardObj = {
    'comprehensive': "Comprehensive",
    'thirdparty': "Thirdparty",
    'building+contents': "BuildingContents",
    'contents': "Contents",
  };
  return CompensationTypeCardObj[name];
};

// Card factory function that reads the value and returns final VAT percentage
export const compensationTypeCardFinalVAT = (value: number) => {
  const VATPercentage: number = value * 100;
  return VATPercentage || 0;
};

// Card final value for Comprehensive
export const compensationTypeCardComprehensiveFinalVal = (
  compWorkShop: PolicyDetails | null,
  compAgency: PolicyDetails | null,
  compMath: PolicyDetails | null
) => {
  const compWorkShopFinalPrice = compWorkShop?.pricingOptions.find(
    (option) => option?.deductibleReferenceNo === deductibleReferenceNo
  )?.finalAmount;
  const compAgencyFinalPrice = compAgency?.pricingOptions.find(
    (option) => option.deductibleReferenceNo === deductibleReferenceNo
  )?.finalAmount;
  const compMathFinalPrice = compMath?.pricingOptions.find(
    (option) => option.deductibleReferenceNo === deductibleReferenceNo
  )?.finalAmount;

  const finalPrices = [
    compWorkShopFinalPrice,
    compAgencyFinalPrice,
    compMathFinalPrice,
  ].filter((price) => price !== undefined);

  const minFinalPrice =
    finalPrices.length > 0 ? Math.min(...finalPrices) : null;
  return minFinalPrice ?? 0;
};

// auto suggest (Apply Recommendation) amount fn
export const autoSuggestFinalVal = (
  comprehensiveVal: number,
  thirdpartyVal: number
) => {
  return Math.abs(comprehensiveVal - thirdpartyVal) || 0;
};

// return date in dd/mm/yyyy format
export const getFormattedDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Add 1 day to today's date
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

// convert date format from dd/mm/yyyy to mm/dd/yyyy
export const convertDateFormat = (dateString: string): string => {
  const [dd, mm, yyyy] = dateString.split('/');
  return `${mm}/${dd}/${yyyy}`;
};


export const formatDateDmy = (dateString: string): string => {
  // Extract the date part before 'T00'
  const datePart = dateString ? dateString.split('T')[0] : '';
  // Parse the date string
  const date = new Date(datePart);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// steps progress component for user coverage plan renew to ignore first key
export const stepProgressRenew = (motorBuySteps) => {
  const updateobj = {};
  Object?.keys(motorBuySteps)?.forEach((k, i) => {
    if (i > 0) {
      updateobj[k] = motorBuySteps[k];
    }
  });
  return updateobj;
};

// repair condition
export const getRepairCondition = (repairCondition: number) => {
  switch (repairCondition) {
    case 1:
      return repairCond.WORKSHOP;
    case 2:
      return repairCond.AGENCY;
    case 3:
      return repairCond.MAWTH;
  }
}

// DOB format function
export const formatDOB = (dob: string | undefined): string | undefined => {
  if (!dob) return undefined;
  const parts = dob.split('-');
  const month = parts[1];
  const year = parts[2];
  return `${month}-${year}`;
};
