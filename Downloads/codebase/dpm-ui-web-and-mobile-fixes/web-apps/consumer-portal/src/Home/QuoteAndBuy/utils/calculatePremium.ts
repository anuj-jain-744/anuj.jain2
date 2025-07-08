import { DEFAULT_HOME_COVERAGE_CODE } from 'constant';
import { CalculatePremiumApiResponse } from 'types/HomeCalculatePremiumApiPayload';
interface PCResponse {
  [key: string]: CalculatePremiumApiResponse;
}

export const calculatePremium = (
  premiumResponse: Record<string, PCResponse>
) => {

  const premiumKeys: string[] = Object.keys(premiumResponse) || [];

  const premiumFinalPrices: [] = [];

  premiumKeys.forEach((data) => {
    const pricingOptions: CalculatePremiumApiResponse = premiumResponse[data]?.purchasedCoverage;
    if (pricingOptions && pricingOptions?.length > 0) {
      const declarationIndex = pricingOptions?.findIndex(data => data?.coverageCode === DEFAULT_HOME_COVERAGE_CODE)
      const price = pricingOptions[declarationIndex]?.premiumInfo?.annualPremium as never;
      premiumFinalPrices?.push(price);
    }
  })

  const finalPrices = premiumFinalPrices?.filter((price) => price !== undefined);
  const pricingOptions: CalculatePremiumApiResponse = premiumResponse[premiumKeys[0]]?.pricingOptions;
  const vatPrice = pricingOptions ? pricingOptions[0]?.taxFeeBreakdowns[0]?.percentage : 0;
  const vatAmount = pricingOptions ? pricingOptions[0]?.taxFeeBreakdowns[0]?.amount : 0;
  const adminFees = pricingOptions ? pricingOptions[0]?.taxFeeBreakdowns[1]?.amount : 0;
  const netPremium = pricingOptions ? pricingOptions[0]?.premiumDue : 0;
  const subTotal = pricingOptions ? pricingOptions[0]?.finalAmount : 0;

  const minFinalPrice =
    finalPrices?.length > 0 ? Math.min(...finalPrices?.map(Number)) : 0;
  const maxFinalPrice =
    finalPrices?.length > 0 ? Math.max(...finalPrices?.map(Number)) : 0;
  return {
    minFinalPrice,
    maxFinalPrice,
    vatPrice,
    vatAmount,
    netPremium,
    subTotal,
    adminFees
  };
};
