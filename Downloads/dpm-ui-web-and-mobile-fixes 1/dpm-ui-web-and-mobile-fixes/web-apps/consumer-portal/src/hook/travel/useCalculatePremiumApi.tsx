import { useApiCall } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { TRAVEL_COVERAAGE_DATA, TRAVELER_TYPE } from "../../constant";
import { useEffect, useState } from "react";
import { CalculatePremiumApiPayload } from "./CalculatePremiumApiPayload";
import { ErrorResponse } from "types/ErrorResponse";
import { TravelApiResponse } from "types/quoteAndBuy";
import { deepCopy, updateCalculatePremiumPayload, updateTravelCovergaePlanPayload } from "utils/quoteAndBuyTravel";

interface PolicyDetailsResponse {
  model: TravelApiResponse;
}

export function useCalculatePremiumApi() {
  const [isError, setIsError] = useState<ErrorResponse | null>(null);
  const [isLoadingCalculatePremium, setIsLoadingCalculatePremium] = useState(false);
  const [isCalculateData, setIsCalculateData] = useState<boolean>(false);
  const [isLoadingWorldwideFamily, setIsLoadingWorldwideFamily] = useState(false);
  const {
    setWorldwidepearl,
    setWorldwidetraveller,
    setWorldwideexceptpearl,
    setWorldwideexcepttraveller,
    setEuropeeurope,
    setEuropeschengen,
    setStepValue,
    setdataworldwideFamily,
    setMinDeductibleAmount,
    setMaxDeductibleAmount,
    setDeductibleAmounts,
    setDeleteStatus
  } = useQuoteAndBuyContext();


  const {
    makeApiCall: apiWorldwidepearl,
    errors: errorWorldwidepearl,
    isLoading: isLoadingWorldwidepearl,
    data: dataWorldwidepearl,
  } = useApiCall<TravelApiResponse, CalculatePremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/Calculate/Premium/Worldwide", "post");

  const {
    makeApiCall: apiWorldwidetraveller,
    errors: errorWorldwidetraveller,
    isLoading: isLoadingWorldwidetraveller,
    data: dataWorldwidepetraveller,
  } = useApiCall<TravelApiResponse, CalculatePremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/Calculate/Premium/Worldwide", "post");

  const {
    makeApiCall: apiWorldwideexceptpearl,
    errors: errorWorldwideexceptpearl,
    isLoading: isLoadingWorldwideexceptpearl,
    data: dataWorldwideexceptpearl,
  } = useApiCall<TravelApiResponse, CalculatePremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/Calculate/Premium/Worldwide/Except/USA/Canada", "post");

  const {
    makeApiCall: apiWorldwideexcepttraveller,
    errors: errorWorldwideexcepttraveller,
    isLoading: isLoadingWorldwideexcepttraveller,
    data: dataWorldwideexcepttraveller,
  } = useApiCall<TravelApiResponse, CalculatePremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/Calculate/Premium/Worldwide/Except/USA/Canada", "post");


  const {
    makeApiCall: apiEuropeeurope,
    errors: errorEuropeeurope,
    isLoading: isLoadingEuropeeurope,
    data: dataEuropeeurope,
  } = useApiCall<TravelApiResponse, CalculatePremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/Calculate/Premium/Europe", "post");

  const {
    makeApiCall: apiEuropeeschengen,
    errors: errorEuropeschengen,
    isLoading: isLoadingEuropeschengen,
    data: dataEuropeeschengen,
  } = useApiCall<TravelApiResponse, CalculatePremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/Calculate/Premium/Europe", "post");

  const handleCalculatePremium = async (
    requestPayloadScheme: CalculatePremiumApiPayload,
  ) => {
    const payloadWorldwidepearl = updateCalculatePremiumPayload(
      "plan",
      TRAVEL_COVERAAGE_DATA.pearl,
      deepCopy(requestPayloadScheme)
    );

    const payloadWorldwidetraveller = updateCalculatePremiumPayload(
      "plan",
      TRAVEL_COVERAAGE_DATA.traveller,
      deepCopy(requestPayloadScheme)
    );

    const payloadWorldwideexceptpearl = updateCalculatePremiumPayload(
      "plan",
      TRAVEL_COVERAAGE_DATA.pearl,
      deepCopy(requestPayloadScheme)
    );

    const payloadWorldwideexcepttraveller = updateCalculatePremiumPayload(
      "plan",
      TRAVEL_COVERAAGE_DATA.traveller,
      deepCopy(requestPayloadScheme)
    );

    const payloadEuropeeurope = updateCalculatePremiumPayload(
      "plan",
      TRAVEL_COVERAAGE_DATA.europe,
      deepCopy(requestPayloadScheme)
    );

    const payloadEuropeschengen = updateCalculatePremiumPayload(
      "plan",
      TRAVEL_COVERAAGE_DATA.schengen,
      deepCopy(requestPayloadScheme)
    );


    await Promise.all([
      apiWorldwidepearl(payloadWorldwidepearl),
      apiWorldwidetraveller(payloadWorldwidetraveller),
      apiWorldwideexceptpearl(payloadWorldwideexceptpearl),
      apiWorldwideexcepttraveller(payloadWorldwideexcepttraveller),
      apiEuropeeurope(payloadEuropeeurope),
      apiEuropeeschengen(payloadEuropeschengen),

    ]);
  };

  useEffect(() => {
    setIsLoadingCalculatePremium(
      isLoadingWorldwidepearl || isLoadingWorldwidetraveller || isLoadingWorldwideexceptpearl || isLoadingWorldwideexcepttraveller || isLoadingEuropeeurope || isLoadingEuropeschengen
    );
  }, [
    isLoadingWorldwidepearl,
    isLoadingWorldwidetraveller,
    isLoadingWorldwideexceptpearl,
    isLoadingWorldwideexcepttraveller,
    isLoadingEuropeeurope,
    isLoadingEuropeschengen

  ]);

  useEffect(() => {
    setIsError(
      errorWorldwidepearl || errorWorldwidetraveller || errorWorldwideexceptpearl || errorWorldwideexcepttraveller || errorEuropeeurope 
      || errorEuropeschengen
    );
  }, [errorWorldwidepearl, errorWorldwidetraveller, errorWorldwideexceptpearl, errorWorldwideexcepttraveller, errorEuropeeurope, errorEuropeschengen]);

  useEffect(() => {
    setIsLoadingCalculatePremium(
      isLoadingWorldwidepearl || isLoadingWorldwidetraveller || isLoadingWorldwideexceptpearl || isLoadingWorldwideexcepttraveller || isLoadingEuropeeurope || isLoadingEuropeschengen
    );
  }, [
    isLoadingWorldwidepearl,
    isLoadingWorldwidetraveller,
    isLoadingWorldwideexceptpearl,
    isLoadingWorldwideexcepttraveller,
    isLoadingEuropeeurope,
    isLoadingEuropeschengen,

  ]);

  useEffect(() => {
    dataWorldwidepearl && setWorldwidepearl(dataWorldwidepearl?.data?.model);
    dataWorldwidepetraveller && setWorldwidetraveller(dataWorldwidepetraveller?.data?.model);
    dataWorldwideexceptpearl && setWorldwideexceptpearl(dataWorldwideexceptpearl?.data?.model);
    dataWorldwideexcepttraveller && setWorldwideexcepttraveller(dataWorldwideexcepttraveller?.data?.model);
    dataEuropeeurope && setEuropeeurope(dataEuropeeurope?.data?.model);
    dataEuropeeschengen && setEuropeschengen(dataEuropeeschengen?.data?.model);

    if (dataWorldwidepearl && dataWorldwidepetraveller && dataWorldwideexceptpearl && dataWorldwideexcepttraveller && dataEuropeeurope && dataEuropeeschengen) {
      setIsCalculateData(true);
      setStepValue(2);
    }
  }, [
    dataWorldwidepearl,
    dataWorldwidepetraveller,
    dataWorldwideexceptpearl,
    dataWorldwideexcepttraveller,
    dataEuropeeurope,
    dataEuropeeschengen,
    setStepValue,

  ]);


  const {
    makeApiCall: apiworldwideFamily,
    errors: errorworldwideFamily,
    isLoading: isLoadingworldwideFamily,
    data: dataworldwideCoverageFamily,
  } = useApiCall<TravelApiResponse, CalculatePremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/Calculate/Premium/Worldwide", "post");

  const handleCalculatePremiumFamily = async (
    requestPayloadScheme: CalculatePremiumApiPayload,
  ) => {
    const worldwideefamilypayload = updateTravelCovergaePlanPayload(
      "familyIndividual",
      "plan",
      TRAVELER_TYPE.family,
      TRAVEL_COVERAAGE_DATA.family,
      deepCopy(requestPayloadScheme)
    );

    await Promise.all([

      apiworldwideFamily(worldwideefamilypayload)

    ]);

  }
  useEffect(() => {
    setIsLoadingWorldwideFamily(isLoadingworldwideFamily);
  }, [isLoadingworldwideFamily]);

  useEffect(() => {
    setIsError(errorworldwideFamily);
    setDeleteStatus(errorworldwideFamily);    
  }, [errorworldwideFamily]);

  useEffect(() => {

    dataworldwideCoverageFamily && setdataworldwideFamily(dataworldwideCoverageFamily?.data?.model);     
     
  }, [
    dataworldwideCoverageFamily,

  ]);

  return { handleCalculatePremium, handleCalculatePremiumFamily, isError, isLoadingCalculatePremium, isCalculateData };
}
