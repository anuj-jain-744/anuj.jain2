import { useApiCall } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useEffect, useState } from "react";
import { CalculatePremiumApiPayload } from "./CalculatePremiumApiPayload";
import { ErrorResponse } from "types/ErrorResponse";
import { TravelApiResponse } from "types/quoteAndBuy";

interface PolicyDetailsResponse {
  model: TravelApiResponse;
}

export function useDirectDraftApi() {

  const [isError, setIsError] = useState<ErrorResponse | null>(null);
  const [isLoadingDirectDraft, setIsLoadingDirectDraft] = useState(false);
  const [isDirectData, setIsDirectData] = useState<boolean>(false);
  const {
    setQuoteDataResponse,
    setStepValue,
  } = useQuoteAndBuyContext();


  const {
    makeApiCall: apiWorldwidepearl,
    errors: errordirectdraft,
    isLoading: isloadingdirectdraft,
    data: datadirectdraft,
  } = useApiCall<TravelApiResponse, CalculatePremiumApiPayload>(22, "/Travel/QuoteAndBuy/V1/DirectDraft", "post");

  const handleReviewQuotePremium = async (
    requestPayloadScheme: CalculatePremiumApiPayload,
  ) => {


    await Promise.all([
      apiWorldwidepearl(requestPayloadScheme),
    ]);
  };

  useEffect(() => {
    setIsLoadingDirectDraft(
      isLoadingDirectDraft
    );
  }, [
    isLoadingDirectDraft,

  ]);

  useEffect(() => {
    setIsError(
      errordirectdraft
    );
  }, [errordirectdraft]);

  useEffect(() => {
    setIsLoadingDirectDraft(
      isLoadingDirectDraft
    );
  }, [
    isLoadingDirectDraft
  ]);

  useEffect(() => {
    datadirectdraft && setQuoteDataResponse(datadirectdraft?.data?.model);

    if (datadirectdraft) {
      setIsDirectData(true);

    }
  }, [datadirectdraft]);

  return { handleReviewQuotePremium, isError, isloadingdirectdraft, isDirectData };
}


