import { PolicyDetails } from "types/quoteAndBuy";

export const calculatePremium = (
  compWorkShop: PolicyDetails | null | undefined,
  compAgency: PolicyDetails | null | undefined,
  compMath: PolicyDetails | null | undefined,
) => {
  
  const minDeductibleReferenceNoWorkShop = compWorkShop?.pricingOptions?.reduce(
    (minOption, currentOption) => {
      return currentOption.deductibleReferenceNo <
        minOption.deductibleReferenceNo
        ? currentOption
        : minOption;
    },
    compWorkShop?.pricingOptions[0] // Provide an initial value here
  )?.deductibleReferenceNo;

  const minDeductibleReferenceNoAgency = compAgency?.pricingOptions?.reduce(
    (minOption, currentOption) => {
      return currentOption.deductibleReferenceNo <
        minOption.deductibleReferenceNo
        ? currentOption
        : minOption;
    },
    compAgency?.pricingOptions[0] // Provide an initial value here
  )?.deductibleReferenceNo;

  const minDeductibleReferenceNoMath = compMath?.pricingOptions?.reduce(
    (minOption, currentOption) => {
      return currentOption.deductibleReferenceNo <
        minOption.deductibleReferenceNo
        ? currentOption
        : minOption;
    },
    compMath?.pricingOptions[0] // Provide an initial value here
  )?.deductibleReferenceNo;

  const compWorkShopData = compWorkShop?.pricingOptions?.find((option) => {
    return option.deductibleReferenceNo === minDeductibleReferenceNoWorkShop;
  }); //.toFixed(2);
  const  compWorkShopFinalPrice = compWorkShopData?.finalAmount;

  const compAgencyData = compAgency?.pricingOptions?.find(
    (option) => option.deductibleReferenceNo === minDeductibleReferenceNoAgency
  ); //.toFixed(2);
  const compAgencyFinalPrice = compAgencyData?.finalAmount

  const compMataData = compMath?.pricingOptions?.find(
    (option) => option.deductibleReferenceNo === minDeductibleReferenceNoMath
  ); //.toFixed(2);
  const compMathFinalPrice= compMataData?.finalAmount;
  const finalPrices = [
    compWorkShopFinalPrice,
    compAgencyFinalPrice,
    compMathFinalPrice,
  ].filter((price) => price !== undefined);

  const minFinalPrice =
    finalPrices.length > 0 ? Math.min(...finalPrices.map(Number)) : null;
  return {
    minFinalPrice,
    compWorkShopFinalPrice,
    compAgencyFinalPrice,
    compMathFinalPrice,
    compWorkShopData,
    compAgencyData,
    compMataData,
  };
};
