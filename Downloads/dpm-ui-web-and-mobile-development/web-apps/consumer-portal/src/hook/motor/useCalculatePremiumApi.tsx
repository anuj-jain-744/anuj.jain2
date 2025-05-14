import { useApiCall } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { ERROR, INTERNAL_SERVER_ERROR, PREMIUM_DATA } from "../../constant";
import { useEffect, useState, useRef } from "react";
import { CalculatePremiumPayload } from "types/CalculatePremiumApiPayload";
import { ErrorResponse } from "types/ErrorResponse";
import { deepCopy, updateCalculatePremiumPayload } from "utils/quoteAndBuy";
import { calculatePremium } from "Motor/QuoteAndBuy/utils/calculatePremium";

export function useCalculatePremiumApi() {
  const [isError, setIsError] = useState<any>();
  const [isAllError, setIsAllError] = useState<boolean>(false);
  const [isLoadingCalculatePremium, setIsLoadingCalculatePremium] = useState(false);
  const [isCalculateData, setIsCalculateData] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<{name:string,message:string}>({name:"",message:""});
  // Use ref to track previous repair types
  const previousTypesRef = useRef<Set<string>>(new Set());

  const {
    setcompMath,
    setcompAgency,
    setcompWorkShop,
    setcomp3rdParty,
    setStepValue,
    setMinDeductibleAmount,
    setMaxDeductibleAmount,
    setDeductibleAmounts,
    setWorkShopInitialPrice,
    setAgencyInitialPrice,
    setMathInitialPrice,
    setComprehensiveCardPrice,
    setWsPremiumBreakdown,
    setTpPremiumBreakdown,
    setMathPremiumBreakdown,
    setAgencyPremiumBreakdown,
    setAvailableRepairTypes
  } = useQuoteAndBuyContext();

  const {
    makeApiCall: apiCompWorkShop,
    errors: errorCompWorkShop,
    isLoading: isLoadingCompWorkShop,
    data: dataCompWorkShop,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/Comp", "post");

  const {
    makeApiCall: apiCompMath,
    errors: errorCompMath,
    isLoading: isLoadingCompMath,
    data: dataCompMath,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/Comp", "post");

  const {
    makeApiCall: apiCompAgency,
    errors: errorCompAgency,
    isLoading: isLoadingCompAgency,
    data: dataCompAgency,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/Comp", "post");

  const {
    makeApiCall: api3rdParty,
    errors: error3rdParty,
    isLoading: isLoading3rdParty,
    data: data3rdParty,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/TP", "post");

  const handleCalculatePremium = async (
    requestPayloadScheme: CalculatePremiumPayload,
  ) => {
    const payload3rdParty = updateCalculatePremiumPayload(
      "repairCondition",
      null,
      deepCopy(requestPayloadScheme)
    );
    const payloadWorkShop = updateCalculatePremiumPayload(
      "repairCondition",
      PREMIUM_DATA?.workShop,
      deepCopy(requestPayloadScheme)
    );
    const payloadMath = updateCalculatePremiumPayload(
      "repairCondition",
      PREMIUM_DATA?.math,
      deepCopy(requestPayloadScheme)
    );
    const payloadAgency = updateCalculatePremiumPayload(
      "repairCondition",
      PREMIUM_DATA?.agency,
      deepCopy(requestPayloadScheme)
    );

    setIsCalculateData(false);
    await apiCompWorkShop(payloadWorkShop);
    await apiCompMath(payloadMath);
    await apiCompAgency(payloadAgency);
    await api3rdParty(payload3rdParty);
  };

  // Handle loading state
  useEffect(() => {
    setIsLoadingCalculatePremium(
      isLoadingCompWorkShop ||
      isLoadingCompMath ||
      isLoadingCompAgency ||
      isLoading3rdParty
    );
  }, [isLoadingCompWorkShop, isLoadingCompMath, isLoadingCompAgency, isLoading3rdParty]);

  // Handle errors
  useEffect(() => {
    const errors = { errorCompWorkShop, errorCompMath, errorCompAgency, error3rdParty };
    const errorMessages = Object.entries(errors)
      .filter(([_, error]) => error)
      .map(([api, error]) => {
        const errorMessage = (error as ErrorResponse)?.messages?.message_en || INTERNAL_SERVER_ERROR;
        return `Error in ${api.replace('error', '')} API: ${errorMessage}`;
      });

    const allDataNull = !dataCompWorkShop && !dataCompMath && !dataCompAgency && !data3rdParty;
    const allHaveErrors = errorCompWorkShop && errorCompMath && errorCompAgency && error3rdParty;


    if (allDataNull && allHaveErrors) {
      setIsAllError(true);
      setErrorResponse({
        name: errors?.errorCompWorkShop?.name ?? ERROR,
        message: errors?.errorCompWorkShop?.messages?.message_en ?? INTERNAL_SERVER_ERROR,
      });
    }

    if (allDataNull && allHaveErrors) {
      setIsError(true);
    } else if (errorMessages.length > 0) {
      setIsError(errorMessages);
    } else {
      setIsError(null);
    }
  }, [dataCompWorkShop, dataCompMath, dataCompAgency, data3rdParty,
    errorCompWorkShop, errorCompMath, errorCompAgency, error3rdParty]);

  // Handle data updates
  useEffect(() => {
    const currentTypes = new Set<string>();

    // Collect available repair types
    const repairTypes = [
      { data: dataCompWorkShop, type: 'workShop' },
      { data: dataCompMath, type: 'math' },
      { data: dataCompAgency, type: 'agency' },
      { data: data3rdParty, type: 'thirdParty' },
    ];

    repairTypes.forEach(({ data, type }) => {
      if (data?.model) currentTypes.add(type);
    });

    // Compare with previous types
    const previousTypes = previousTypesRef.current;
    const hasChanged =
      currentTypes.size !== previousTypes.size ||
      ![...currentTypes].every(type => previousTypes.has(type));

    if (hasChanged) {
      previousTypesRef.current = currentTypes;
      setAvailableRepairTypes([...currentTypes]);
    }

    // Update model data
    repairTypes.forEach(({ data, type }) => {
      if (data?.model) {
        switch (type) {
          case 'workShop':
            setcompWorkShop(data.model);
            break;
          case 'math':
            setcompMath(data.model);
            break;
          case 'agency':
            setcompAgency(data.model);
            break;
          case 'thirdParty':
            setcomp3rdParty(data.model);
            break;
        }
      }
    });

    const dataPricingOptions = dataCompWorkShop ?? dataCompMath ?? dataCompAgency ?? data3rdParty;
    if (dataPricingOptions) {
      setIsCalculateData(true);
      setStepValue(2);

      // Set deductible amounts
      const pricingOptions = dataPricingOptions?.model?.pricingOptions;
      if (pricingOptions) {
        const amounts = pricingOptions.map((option: { deductibleAmount: number; }) => option.deductibleAmount).sort((a, b) => a - b);
        setMinDeductibleAmount(Math.min(...amounts));
        setMaxDeductibleAmount(Math.max(...amounts));
        setDeductibleAmounts(amounts);
      }

      // Calculate prices
      const priceData = calculatePremium(
        dataCompWorkShop?.model,
        dataCompAgency?.model,
        dataCompMath?.model
      );

      if (priceData) {
        setWorkShopInitialPrice(priceData.compWorkShopFinalPrice ?? null);
        setAgencyInitialPrice(priceData.compAgencyFinalPrice ?? null);
        setMathInitialPrice(priceData.compMathFinalPrice ?? null);
        setComprehensiveCardPrice(priceData.minFinalPrice);

        // Update breakdowns
        setWsPremiumBreakdown(priceData.compWorkShopData?.premiumBreakdowns || []);
        setMathPremiumBreakdown(priceData.compMataData?.premiumBreakdowns || []);
        setAgencyPremiumBreakdown(priceData.compAgencyData?.premiumBreakdowns || []);
        setTpPremiumBreakdown(
          Array.isArray(data3rdParty?.model?.pricingOptions) &&
            data3rdParty?.model?.pricingOptions.length > 0
            ? data3rdParty?.model?.pricingOptions[0]?.premiumBreakdowns
            : []
        );
      }
    }
  }, [dataCompWorkShop, dataCompMath, dataCompAgency, data3rdParty]);

  return {
    handleCalculatePremium,
    isError,
    isAllError,
    isLoadingCalculatePremium,
    isCalculateData,
    errorResponse,
  };
}

export function mockReturnValue(mockUseCalculatePremiumApi: { handleCalculatePremium: jest.Mock<any, any, any>; isAllError: boolean; isLoadingCalculatePremium: boolean; isCalculateData: boolean; isError: undefined; errorResponse: { name: string; message: string; }; }) {
  throw new Error('Function not implemented.');
}
