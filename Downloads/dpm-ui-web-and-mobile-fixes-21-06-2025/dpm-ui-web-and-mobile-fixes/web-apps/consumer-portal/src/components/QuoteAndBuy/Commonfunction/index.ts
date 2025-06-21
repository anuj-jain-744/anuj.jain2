import { TravelApiResponse, TravelCoverageplanResponse } from "types/quoteAndBuy";

export const compensationTypeCardFinalVAT = (value: number) => {
  const VATPercentage: number = value * 100;
  return VATPercentage || 0;
};

export const worldwidecalculatePremium = (
  dataworldwidepearl: TravelApiResponse,
  dataworldwidetraveller: TravelApiResponse,

) => {


  const dataworldwidepearlFinalPrice = dataworldwidepearl?.pricingOptions[0].finalAmount;
  const dataworldwidepearlVAT = dataworldwidepearl?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwidepearladminfee = dataworldwidepearl?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwidepearlnetpremium = dataworldwidepearl?.pricingOptions[0]?.premiumDue;
  const dataworldwidepearlpurchasedCoverage = dataworldwidepearl?.purchasedCoverage;

  const dataworldwidetravellerFinalPrice = dataworldwidetraveller?.pricingOptions[0].finalAmount;
  const dataworldwidetravellerVAT = dataworldwidetraveller?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwidetravelleradminfee = dataworldwidetraveller?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwidetravellernetpremium = dataworldwidetraveller?.pricingOptions[0]?.premiumDue;
  const dataworldwidetravellerpurchasedCoverage = dataworldwidetraveller?.purchasedCoverage;

  const finalPrices = [
    dataworldwidepearlFinalPrice,
    dataworldwidetravellerFinalPrice,
  ].filter((price) => price !== undefined);


  const minFinalPrice =
    finalPrices.length > 0 ? Math.min(...finalPrices.map(Number)) : null;
  return {
    minFinalPrice,
    dataworldwidepearlFinalPrice,
    dataworldwidetravellerFinalPrice,
    dataworldwidepearlVAT,
    dataworldwidepearladminfee,
    dataworldwidepearlnetpremium,
    dataworldwidetravellerVAT,
    dataworldwidetravelleradminfee,
    dataworldwidetravellernetpremium,
    dataworldwidepearlpurchasedCoverage,
    dataworldwidetravellerpurchasedCoverage
  };
};


export const worldwideexceptcalculatePremium = (
  dataworldwideexceptpearl: TravelApiResponse,
  dataworldwideexcepttraveller: TravelApiResponse,

) => {


  const dataworldwideexceptpearlFinalPrice = dataworldwideexceptpearl?.pricingOptions[0].finalAmount;
  const dataworldwideexceptpearlVAT = dataworldwideexceptpearl?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwideexceptpearladminfee = dataworldwideexceptpearl?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwideexceptpearlnetpremium = dataworldwideexceptpearl?.pricingOptions[0]?.premiumDue;
  const dataworldwideexceptpearlpurchasedCoverage = dataworldwideexceptpearl?.purchasedCoverage;


  const dataworldwideexcepttravellerFinalPrice = dataworldwideexcepttraveller?.pricingOptions[0].finalAmount;
  const dataworldwideexcepttravellerVAT = dataworldwideexcepttraveller?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwideexcepttravelleradminfee = dataworldwideexcepttraveller?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwideexcepttravellernetpremium = dataworldwideexcepttraveller?.pricingOptions[0]?.premiumDue;
  const dataworldwideexcepttravellerpurchasedCoverage = dataworldwideexcepttraveller?.purchasedCoverage;

  const finalPrices = [
    dataworldwideexceptpearlFinalPrice,
    dataworldwideexcepttravellerFinalPrice,
  ].filter((price) => price !== undefined);


  const minFinalPrice =
    finalPrices.length > 0 ? Math.min(...finalPrices.map(Number)) : null;
  return {
    minFinalPrice,
    dataworldwideexceptpearlFinalPrice,
    dataworldwideexcepttravellerFinalPrice,
    dataworldwideexceptpearlVAT,
    dataworldwideexceptpearladminfee,
    dataworldwideexceptpearlnetpremium,
    dataworldwideexcepttravellerVAT,
    dataworldwideexcepttravelleradminfee,
    dataworldwideexcepttravellernetpremium,
    dataworldwideexceptpearlpurchasedCoverage,
    dataworldwideexcepttravellerpurchasedCoverage
  };
};




export const europecalculatePremium = (
  dataEuropeeurope: TravelApiResponse,
  dataEuropeschengen: TravelApiResponse,

) => {

  const dataEuropeeuropeFinalPrice = dataEuropeeurope?.pricingOptions[0].finalAmount;
  const dataEuropeeuropeVAT = dataEuropeeurope?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataEuropeeuropeadminfee = dataEuropeeurope?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataEuropeeuropenetpremium = dataEuropeeurope?.pricingOptions[0]?.premiumDue;
  const dataEuropeeuropepurchasedCoverage = dataEuropeeurope?.purchasedCoverage;


  const dataEuropeschengenFinalPrice = dataEuropeschengen?.pricingOptions[0].finalAmount;
  const dataEuropeschengenVAT = dataEuropeschengen?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataEuropeschengenadminfee = dataEuropeschengen?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataEuropeschengennetpremium = dataEuropeschengen?.pricingOptions[0]?.premiumDue;
  const dataEuropeschengenpurchasedCoverage = dataEuropeschengen?.purchasedCoverage;

  const finalPrices = [
    dataEuropeeuropeFinalPrice,
    dataEuropeschengenFinalPrice,
  ].filter((price) => price !== undefined);


  const minFinalPrice =
    finalPrices.length > 0 ? Math.min(...finalPrices.map(Number)) : null;
  return {
    minFinalPrice,
    dataEuropeeuropeFinalPrice,
    dataEuropeschengenFinalPrice,
    dataEuropeeuropeVAT,
    dataEuropeeuropeadminfee,
    dataEuropeeuropenetpremium,
    dataEuropeschengenVAT,
    dataEuropeschengenadminfee,
    dataEuropeschengennetpremium,
    dataEuropeeuropepurchasedCoverage,
    dataEuropeschengenpurchasedCoverage
  };
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};


export const worldwidecoveragePlanPremium = (

  dataworldwide: TravelCoverageplanResponse,

) => {


  const dataworldwidetravellerFinalPrice = dataworldwide?.coverageTypes[0]?.pricingOptions[0].finalAmount;
  const dataworldwidetravellerVAT = dataworldwide?.coverageTypes[0]?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwidetravelleradminfee = dataworldwide?.coverageTypes[0]?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwidetravellernetpremium = dataworldwide?.coverageTypes[0]?.pricingOptions[0]?.premiumDue;
  const dataworldwidetravellerpurchasedCoverage = dataworldwide?.coverageTypes[0]?.purchasedCoverage;

  const dataworldwidepearlFinalPrice = dataworldwide?.coverageTypes[1]?.pricingOptions[0].finalAmount;
  const dataworldwidepearlVAT = dataworldwide?.coverageTypes[1]?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwidepearladminfee = dataworldwide?.coverageTypes[1]?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwidepearlnetpremium = dataworldwide?.coverageTypes[1]?.pricingOptions[0]?.premiumDue;
  const dataworldwidepearlpurchasedCoverage = dataworldwide?.coverageTypes[1]?.purchasedCoverage;

  const finalPrices = [
    dataworldwidepearlFinalPrice,
    dataworldwidetravellerFinalPrice,
  ].filter((price) => price !== undefined);


  const minFinalPrice =
    finalPrices.length > 0 ? Math.min(...finalPrices.map(Number)) : null;
  return {
    minFinalPrice,
    dataworldwidepearlFinalPrice,
    dataworldwidetravellerFinalPrice,
    dataworldwidepearlVAT,
    dataworldwidepearladminfee,
    dataworldwidepearlnetpremium,
    dataworldwidetravellerVAT,
    dataworldwidetravelleradminfee,
    dataworldwidetravellernetpremium,
    dataworldwidetravellerpurchasedCoverage,
    dataworldwidepearlpurchasedCoverage
  };
};
export const worldwidecoverageFamilyPlanPremium = (

  dataworldwidefamily: TravelCoverageplanResponse,

) => {


  const dataworldwidefamilyFinalPrice = dataworldwidefamily?.coverageTypes[0]?.pricingOptions[0].finalAmount;
  const dataworldwidefamilyVAT = dataworldwidefamily?.coverageTypes[0]?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwidefamilyadminfee = dataworldwidefamily?.coverageTypes[0]?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwidefamilynetpremium = dataworldwidefamily?.coverageTypes[0]?.pricingOptions[0]?.premiumDue;
  const dataworldwidefamilypurchasedCoverage = dataworldwidefamily?.coverageTypes[0]?.purchasedCoverage;


  const minFinalPrice = Math.min(dataworldwidefamilyFinalPrice);
  return {
    minFinalPrice,
    dataworldwidefamilyFinalPrice,
    dataworldwidefamilyVAT,
    dataworldwidefamilyadminfee,
    dataworldwidefamilynetpremium,
    dataworldwidefamilypurchasedCoverage,

  };
};
export const worldwideexceptcoveragePlanPremium = (

  dataworldwideexcpt: TravelCoverageplanResponse

) => {

  const dataworldwideexcepttravellerFinalPrice = dataworldwideexcpt?.coverageTypes[0]?.pricingOptions[0].finalAmount;
  const dataworldwideexcepttravellerVAT = dataworldwideexcpt?.coverageTypes[0]?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwideexcepttravelleradminfee = dataworldwideexcpt?.coverageTypes[0]?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwideexcepttravellernetpremium = dataworldwideexcpt?.coverageTypes[0]?.pricingOptions[0]?.premiumDue;
  const dataworldwideexcepttravellerpurchasedCoverage = dataworldwideexcpt?.coverageTypes[0]?.purchasedCoverage;

  const dataworldwideexceptpearlFinalPrice = dataworldwideexcpt?.coverageTypes[1]?.pricingOptions[0].finalAmount;
  const dataworldwideexceptpearlVAT = dataworldwideexcpt?.coverageTypes[1]?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwideexceptpearladminfee = dataworldwideexcpt?.coverageTypes[1]?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwideexceptpearlnetpremium = dataworldwideexcpt?.coverageTypes[1]?.pricingOptions[0]?.premiumDue;
  const dataworldwideexceptpearlpurchasedCoverage = dataworldwideexcpt?.coverageTypes[1]?.purchasedCoverage;



  const finalPrices = [
    dataworldwideexceptpearlFinalPrice,
    dataworldwideexcepttravellerFinalPrice,
  ].filter((price) => price !== undefined);


  const minFinalPrice =
    finalPrices.length > 0 ? Math.min(...finalPrices.map(Number)) : null;
  return {
    minFinalPrice,
    dataworldwideexceptpearlFinalPrice,
    dataworldwideexcepttravellerFinalPrice,
    dataworldwideexceptpearlVAT,
    dataworldwideexceptpearladminfee,
    dataworldwideexceptpearlnetpremium,
    dataworldwideexcepttravellerVAT,
    dataworldwideexcepttravelleradminfee,
    dataworldwideexcepttravellernetpremium,
    dataworldwideexcepttravellerpurchasedCoverage,
    dataworldwideexceptpearlpurchasedCoverage
  };
};

export const europecoveragePlanPremium = (

  dataEuropeeurope: TravelCoverageplanResponse,


) => {

  const dataEuropeschengenFinalPrice = dataEuropeeurope?.coverageTypes[0]?.pricingOptions[0].finalAmount;
  const dataEuropeschengenVAT = dataEuropeeurope?.coverageTypes[0]?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataEuropeschengenadminfee = dataEuropeeurope?.coverageTypes[0]?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataEuropeschengennetpremium = dataEuropeeurope?.coverageTypes[0]?.pricingOptions[0]?.premiumDue;
  const dataEuropeschengenpurchasedCoverage = dataEuropeeurope?.coverageTypes[0]?.purchasedCoverage;

  const dataEuropeeuropeFinalPrice = dataEuropeeurope?.coverageTypes[1]?.pricingOptions[0].finalAmount;
  const dataEuropeeuropeVAT = dataEuropeeurope?.coverageTypes[1]?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataEuropeeuropeadminfee = dataEuropeeurope?.coverageTypes[1]?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataEuropeeuropenetpremium = dataEuropeeurope?.coverageTypes[1]?.pricingOptions[0]?.premiumDue;
  const dataEuropeeuropepurchasedCoverage = dataEuropeeurope?.coverageTypes[1]?.purchasedCoverage;

  const finalPrices = [
    dataEuropeeuropeFinalPrice,
    dataEuropeschengenFinalPrice,
  ].filter((price) => price !== undefined);


  const minFinalPrice =
    finalPrices.length > 0 ? Math.min(...finalPrices.map(Number)) : null;
  return {
    minFinalPrice,
    dataEuropeeuropeFinalPrice,
    dataEuropeschengenFinalPrice,
    dataEuropeeuropeVAT,
    dataEuropeeuropeadminfee,
    dataEuropeeuropenetpremium,
    dataEuropeschengenVAT,
    dataEuropeschengenadminfee,
    dataEuropeschengennetpremium,
    dataEuropeschengenpurchasedCoverage,
    dataEuropeeuropepurchasedCoverage
  };
};

export const worldwideFamilycalculatePremium = (
  dataworldwideCoverageFamily: TravelApiResponse,


) => {


  const dataworldwideFamilyFinalPrice = dataworldwideCoverageFamily?.pricingOptions[0].finalAmount;
  const dataworldwideFamilyVAT = dataworldwideCoverageFamily?.pricingOptions[0]?.taxFeeBreakdowns[0]?.amount;
  const dataworldwideFamilyadminfee = dataworldwideCoverageFamily?.pricingOptions[0]?.taxFeeBreakdowns[1]?.amount;
  const dataworldwideFamilynetpremium = dataworldwideCoverageFamily?.pricingOptions[0]?.premiumDue;
  const dataworldwideFamilypurchasedCoverage = dataworldwideCoverageFamily?.purchasedCoverage;
  const minFinalPrice = Math.min(dataworldwideFamilyFinalPrice)
  return {
    minFinalPrice,
    dataworldwideFamilyFinalPrice,
    dataworldwideFamilyVAT,
    dataworldwideFamilyadminfee,
    dataworldwideFamilynetpremium,
    dataworldwideFamilypurchasedCoverage
  };
};
