import { useApiCall } from "@dpm/shared-module";
import { useEffect, useState } from "react";
import { CalculatePremiumApiPayload } from "types/HomeCalculatePremiumApiPayload";
import { ErrorResponse } from "types/ErrorResponse";
import { PolicyDetails } from "types/quoteAndBuy";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { deepCopy, updateCalculatePremiumPayload, updateRedisDataCalculatePremiumPayload, updateRenewalCalculatePremiumPayload } from "utils/quoteAndBuy";
import { PREMIUM_DATA, HOME_COVERAGE_PLANS, commonKeywords, apiRoutes } from "constant";


interface PolicyDetailsResponse {
  model: PolicyDetails;
}

interface PlansMap {
  [key: string]: PolicyDetailsResponse | null
}

interface CoveragePlansMap {
  [key: string]: { makeApiCall: (payload: CalculatePremiumApiPayload) => void, errors: ErrorResponse | null, isLoading: boolean, data: PolicyDetailsResponse | null };
}


export function useCalculatePremiumApi<TData>() {
  const [isError, setIsError] = useState<ErrorResponse | null>(null);
  const [isLoadingCalculatePremium, setIsLoadingCalculatePremium] = useState(false);
  const [data, setData] = useState<TData | null>(null);

  const {
    homePremiumResponse,
    repairTypeSelected,
  } = useQuoteAndBuyContext();

  const loadAPI = () => {
    return useApiCall<PolicyDetailsResponse, CalculatePremiumApiPayload>(
      10,
      apiRoutes.homeCalculatePremium,
      commonKeywords.post
    )
  }

  const selectedCoverageType: string = repairTypeSelected?.replace(/\s+/g, '').toLowerCase();

  const coveragePlansAPI: CoveragePlansMap = {};
  HOME_COVERAGE_PLANS.forEach((item) => {
    coveragePlansAPI[item] = loadAPI();
  });

  const coverageTypes = Object.keys(coveragePlansAPI) || [];

  const handleCalculatePremium = async (
    requestPayloadScheme: CalculatePremiumApiPayload,
    benefitsData: {coverageType: string, selectedBenefits: [], contentBenefits: [], type: string, payload: { policyRisk: [] }} | null = null
  ) => {

    const callPremiumAPI: (item: string, requestPayloadScheme: CalculatePremiumApiPayload) => void = (item, requestPayloadScheme) => {
      let payload = updateCalculatePremiumPayload(
        "planCode",
        PREMIUM_DATA[item],
        deepCopy(requestPayloadScheme)
      );
      // on renewal the policy, will update additional and content benefits related to coverage type selection 
      if (benefitsData && benefitsData?.type === 'renewalData' && benefitsData?.coverageType === item) {
        payload = updateRenewalCalculatePremiumPayload(
          benefitsData,
          deepCopy(payload)
        );
      }
      // on redis data, will update additional and content benefits related to coverage type selection
      if (benefitsData && benefitsData?.type === 'redisData' && benefitsData?.coverageType === item) {
        payload = updateRedisDataCalculatePremiumPayload(
          benefitsData.payload,
          deepCopy(payload)
        );
      }
      coveragePlansAPI[item].makeApiCall(payload);
    }

    const promises: [] = [];
    coverageTypes.forEach((item) => {
      if ((selectedCoverageType && item === selectedCoverageType) || !selectedCoverageType) {
        promises.push(callPremiumAPI(item, requestPayloadScheme));
      }
    })
    await Promise.all(promises);
  };

  const isLoading = coverageTypes?.some((key) => (coveragePlansAPI[key]['isLoading']));

  useEffect(() => {
    setIsLoadingCalculatePremium(isLoading);
  }, [isLoading]);

  const isCheckingErrors = coverageTypes?.some((key) => (coveragePlansAPI[key]['errors'])) as never;

  useEffect(() => {
    const errorsData = [];
    if (isCheckingErrors) {
      for (const item of coverageTypes) {
        if ((selectedCoverageType && item === selectedCoverageType) || !selectedCoverageType) {
          if (coveragePlansAPI[item]['errors']) {
            errorsData.push(coveragePlansAPI[item]['errors']);
          }
        }
      }
    }
    setIsError(errorsData.length && errorsData[0] || null);
  }, [isCheckingErrors]);

  const isCheckingData = coverageTypes.filter((item) => {
    if ((selectedCoverageType && item === selectedCoverageType) || !selectedCoverageType) {
      return coveragePlansAPI[item];
    }
  }).every((key) => (coveragePlansAPI[key]['data']));

  useEffect(() => {
    if (isCheckingData) {
      const plans: PlansMap = homePremiumResponse;
      coverageTypes?.forEach((item) => {
        if ((selectedCoverageType && item === selectedCoverageType) || !selectedCoverageType) {
          plans[item] = coveragePlansAPI[item]['data'];
        }
      })
      setData(plans);
    }
  }, [isCheckingData]);

  return { handleCalculatePremium, isError, isLoadingCalculatePremium, data };
}
