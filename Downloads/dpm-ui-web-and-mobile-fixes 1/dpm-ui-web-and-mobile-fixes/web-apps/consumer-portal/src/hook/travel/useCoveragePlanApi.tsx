import { useApiCall } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { TRAVELER_TYPE,TRAVELER_COVERGE_TYPES } from "../../constant";
import { useEffect, useState } from "react";
import { CoveragePanPremiumApiPayload } from "./CalculatePremiumApiPayload";
import { ErrorResponse } from "types/ErrorResponse";
import { TravelApiResponse } from "types/quoteAndBuy";
import { deepCopy, updateTravelCovergaePlanPayload } from "utils/quoteAndBuyTravel";

interface PolicyDetailsResponse {
  model: TravelApiResponse;
}
export function useCoveragePlanApi(setLeftStep) {
  const [PlanError, setPlanError] = useState<ErrorResponse | null>(null);
  const [isLoadingCoveragePlan, setIsLoadingCoveragePlanPremium] =useState(false);
  const [isCovergePlaData, setIsCoveragePlanData] = useState<boolean>(false);
  const {
    setCoverageplanselfworldwide,setCoverageplanselfworldwideusa,
    setCoverageplanselfworldwideeurope,setCoverageplanfamilyworldwide,
    setCoverageplanfamilyworldwideusa,setCoverageplanfamilyeurope,
  } = useQuoteAndBuyContext();


  const {
    makeApiCall: apiselfworldwide,
    errors: errorselfworldwide,
    isLoading: isLoadingselfworldwide,
    data: dataselfworldwide,
  } = useApiCall<TravelApiResponse, CoveragePanPremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/CoveragePlans", "post");

  const {
    makeApiCall: apiselfworldwideusa,
    errors: errorselfworldwideusa,
    isLoading: isLoadingselfworldwideusa,
    data: dataselfworldwideusa,
  } = useApiCall<TravelApiResponse, CoveragePanPremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/CoveragePlans", "post");

  const {
    makeApiCall: apiselfeurope,
    errors: errorselfeurope,
    isLoading: isLoadingselfeurope,
    data: dataselfeurope,
  } = useApiCall<TravelApiResponse, CoveragePanPremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/CoveragePlans", "post");

 

  const {
    makeApiCall: apifamilyworldwide,
    errors: errorfamilyworldwide,
    isLoading: isLoadingfamilyworldwide,
    data: datafamilyworldwide,
  } = useApiCall<TravelApiResponse, CoveragePanPremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/CoveragePlans", "post");

  const {
    makeApiCall: apifamilyworldwideusa,
    errors: errorfamilyworldwideusa,
    isLoading: isLoadingfamilyworldwideusa,
    data: datafamilyworldwideusa,
  } = useApiCall<TravelApiResponse, CoveragePanPremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/CoveragePlans", "post");

  const {
    makeApiCall: apifamilyeurope,
    errors: errorfamilyeurope,
    isLoading: isLoadingfamilyeurope,
    data: datafamilyeurope,
  } = useApiCall<TravelApiResponse, CoveragePanPremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/CoveragePlans", "post");

 
  const handlecoveragePlanSelf = async (
    requestPayloadCoveragePlan: CoveragePanPremiumApiPayload,
  ) => {
    const payloadselfworldwide = updateTravelCovergaePlanPayload(
      "familyIndividual",
      "typeOfCoverage",
      TRAVELER_TYPE.individual,
      TRAVELER_COVERGE_TYPES.worldwide,
      deepCopy(requestPayloadCoveragePlan)
    );

    const payloadselfworldwideusa= updateTravelCovergaePlanPayload(
      "familyIndividual",
      "typeOfCoverage",
      TRAVELER_TYPE.individual,
      TRAVELER_COVERGE_TYPES.worldwideusa,
      deepCopy(requestPayloadCoveragePlan)
    );

    const payloadselfeurope = updateTravelCovergaePlanPayload(
      "familyIndividual",
      "typeOfCoverage",
      TRAVELER_TYPE.individual,
      TRAVELER_COVERGE_TYPES.europe,
      deepCopy(requestPayloadCoveragePlan)
    );

    await Promise.all([
      apiselfworldwide(payloadselfworldwide),
      apiselfworldwideusa(payloadselfworldwideusa),
      apiselfeurope(payloadselfeurope),
      

    ]);
  };


  const handlecoveragePlanFamily = async (
    requestPayloadCoveragePlan: CoveragePanPremiumApiPayload,
  ) => {
    const payloadfamilyworldwide = updateTravelCovergaePlanPayload(
      "familyIndividual",
      "typeOfCoverage",
      TRAVELER_TYPE.family,
      TRAVELER_COVERGE_TYPES.worldwide,
      deepCopy(requestPayloadCoveragePlan)
    );
   
    await Promise.all([
      apifamilyworldwide(payloadfamilyworldwide)
    ]);

  }

  useEffect(() => {
    setIsLoadingCoveragePlanPremium(
      isLoadingselfworldwide || isLoadingselfworldwideusa || isLoadingselfeurope 
    );
  }, [
    isLoadingselfworldwide,
    isLoadingselfworldwideusa,
    isLoadingselfeurope,
   

  ]);
  useEffect(() => {
    setIsLoadingCoveragePlanPremium(
      isLoadingfamilyworldwide || isLoadingfamilyworldwideusa || isLoadingfamilyeurope
    );
  }, [
    
    isLoadingfamilyworldwide,
    isLoadingfamilyworldwideusa,
    isLoadingfamilyeurope

  ]);

  useEffect(() => {
    setPlanError(
      errorselfworldwide || errorselfworldwideusa || errorselfeurope 
    );
  }, [errorselfworldwide, errorselfworldwideusa, errorselfeurope]);

  useEffect(() => {
    setPlanError(
       errorfamilyworldwide || errorfamilyworldwideusa || errorfamilyeurope
    );
  }, [errorfamilyworldwide, errorfamilyworldwideusa, errorfamilyeurope]);

  useEffect(() => {
    
    dataselfworldwide && setCoverageplanselfworldwide(dataselfworldwide);
    dataselfworldwideusa && setCoverageplanselfworldwideusa(dataselfworldwideusa);
    dataselfeurope && setCoverageplanselfworldwideeurope(dataselfeurope);
   
    if (
      dataselfworldwide && dataselfworldwideusa && dataselfeurope 
      
      ) {
      setIsCoveragePlanData(true);
      setLeftStep(2);
   }
  }, [
    dataselfworldwide,
    dataselfworldwideusa,
    dataselfeurope,
  ]);
  useEffect(() => {
    
    datafamilyworldwide && setCoverageplanfamilyworldwide(datafamilyworldwide);
    datafamilyworldwideusa && setCoverageplanfamilyworldwideusa(datafamilyworldwideusa);
    datafamilyeurope && setCoverageplanfamilyeurope(datafamilyeurope);
    
    if (datafamilyworldwide) {
      setIsCoveragePlanData(true);
      setLeftStep(2);
   }
  }, [
    
    datafamilyworldwide,
    datafamilyworldwideusa,
   datafamilyeurope,
  ]);



  return { handlecoveragePlanSelf,handlecoveragePlanFamily, PlanError, isLoadingCoveragePlan, isCovergePlaData };
}
