// React and Hooks
import { useCallback, useEffect, useRef, useState, SetStateAction } from "react";

// Shared Modules and Components
import { useApiCall, getAmountText } from "@dpm/shared-module";
import { LoaderOverlay } from "@corporate-portal/components/Loader";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

// Utilities
import { getCurrencySymbol } from "@app-shell/utils/common";
import { deepCopy, updateSliderChangeCalculatePremiumPayload } from "utils/quoteAndBuy";
import useCalculatePremiumPayload from "../hooks/useCalculatePremiumPayload";

// Types
import { LanguageData } from "types/languageData";

import Car_Swap from "assets/QuoteAndBuy/Car_Swap.svg";
import Info from "assets/CancelPolicy/Info.svg";

import "./styles.scss";
import { PREMIUM_DATA } from "constant";


function SumInsuredAndDeductibles({
  languageData,
}: Readonly<{ languageData: LanguageData }>) {
  const sumInsuredSliderRef = useRef(undefined);
  const deductiblesSliderRef = useRef(undefined);

  const {
    setStepValue,
    compWorkShop,
    setcompWorkShop,
    compAgency,
    setcompAgency,
    compMath,
    setcompMath,
    setcomp3rdParty,
    deductibleAmounts,
    setDeductibleAmounts,
    minDeductibleAmount,
    setMinDeductibleAmount,
    maxDeductibleAmount,
    setMaxDeductibleAmount,
    workShopInitialPrice,
    setWorkShopInitialPrice,
    setAgencyInitialPrice,
    setMathInitialPrice,
    sliderValueDeductibles,
    setSliderValueDeductibles,
    sliderValueSumInsured,
    setSliderValueSumInsured,
    setWsPremiumBreakdown,
    setMathPremiumBreakdown,
    setAgencyPremiumBreakdown,
    vehicleDetailsResponseData,
    setComprehensiveCardPrice,
    availableRepairTypes,
  } = useQuoteAndBuyContext();

  const [inputValue, setInputValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const previousSliderValueDeductibles = useRef(sliderValueDeductibles);
  const previousSliderValueSumInsured = useRef(inputValue);

  const handleSumInsuredSliderChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    // onchange of Sum Insured slider, set the value of Deductibles slider set to minimum/lesser deductible amount
    setSliderValueDeductibles(
      minDeductibleAmount?.toString() || sliderValueDeductibles
    );
    setInputValue(event.target.value);
  };

  const handleDeductibleSliderChange = (e) => {
    setIsMounted(true);
    const value = e.target.value;
    setSliderValueDeductibles(value);
  };

  const handleSliderChangeSumInsured = useCallback((e: number) => {
    setSliderValueSumInsured(e);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSliderChangeSumInsured(Number(inputValue));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, handleSliderChangeSumInsured]);

  const getSumInsuredSliderBackground = () => {
    const percentage =
      ((inputValue - vehicleDetailsResponseData?.vehicleMinValue) /
        (vehicleDetailsResponseData?.vehicleMaxValue -
          vehicleDetailsResponseData?.vehicleMinValue)) *
      100;
    return `linear-gradient(to right, #185A7D ${percentage}%, #E8EFF2 ${percentage}%)`;
  };

  const getDeductiblesSliderBackground = () => {
    const percentage =
      ((sliderValueDeductibles - minDeductibleAmount) /
        (maxDeductibleAmount - minDeductibleAmount)) *
      100;
    return `linear-gradient(to right, #185A7D ${percentage}%, #E8EFF2 ${percentage}%)`;
  };

  const calculateThumbPosition = (sliderRef, value, min, max) => {
    if (!sliderRef.current) return 0;
    const sliderWidth = sliderRef.current.offsetWidth;
    const percentage = (value - min) / (max - min);
    return percentage * sliderWidth;
  };

  const thumbPositionSumAssured = calculateThumbPosition(
    sumInsuredSliderRef,
    inputValue,
    vehicleDetailsResponseData?.vehicleMinValue,
    vehicleDetailsResponseData?.vehicleMaxValue
  );

  const thumbPositionDeductibles = calculateThumbPosition(
    deductiblesSliderRef,
    sliderValueDeductibles,
    minDeductibleAmount,
    maxDeductibleAmount
  );

  const {
    makeApiCall: apiCompWorkShop,
    data: dataCompWorkShop,
    isLoading: compWorkShopLoading,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/Comp", "post");
  const {
    makeApiCall: apiCompMath,
    data: dataCompMath,
    isLoading: compMathLoading,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/Comp", "post");
  const {
    makeApiCall: apiCompAgency,
    data: dataCompAgency,
    isLoading: compAgencyLoading,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/Comp", "post");
  const {
    makeApiCall: api3rdParty,
    data: data3rdParty,
    isLoading: rdPartyLoading,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/TP", "post");

  const requestPayload = useCalculatePremiumPayload();
  const isLoading =
    (compWorkShopLoading ||
      compMathLoading ||
      compAgencyLoading ||
      rdPartyLoading) ??
    false;

  useEffect(() => {
    setSliderValueDeductibles(minDeductibleAmount);
  }, [minDeductibleAmount]);

  useEffect(() => {
    setInputValue(vehicleDetailsResponseData?.vehicleValue);
    setSliderValueSumInsured(vehicleDetailsResponseData?.vehicleValue);
  }, [vehicleDetailsResponseData]);

  useEffect(() => {
    if (!isLoading) {
      dataCompWorkShop && setcompWorkShop(dataCompWorkShop?.model);
      dataCompMath && setcompMath(dataCompMath?.model);
      dataCompAgency && setcompAgency(dataCompAgency?.model);
      data3rdParty && setcomp3rdParty(data3rdParty?.model);
    }

    const setData = async () => {
      if (
        (dataCompWorkShop ?? dataCompMath ?? dataCompAgency ?? data3rdParty) &&
        !isLoading
      ) {
        const dataPricingOptions =
          dataCompWorkShop ?? dataCompMath ?? dataCompAgency ?? data3rdParty;
        setStepValue(2);
        const amounts = await dataPricingOptions?.model?.pricingOptions?.map(
          (option) => option.deductibleAmount
        );
        if (amounts) {
          setMinDeductibleAmount(Math.min(...amounts));
          setMaxDeductibleAmount(Math.max(...amounts));
          await amounts.sort((a, b) => a - b);
          setDeductibleAmounts(amounts);
        }
        updatebreakvalue();
      }
    };
    setData();
  }, [
    vehicleDetailsResponseData,
    dataCompWorkShop,
    setcompWorkShop,
    dataCompMath,
    setcompMath,
    dataCompAgency,
    setcompAgency,
    data3rdParty,
    setcomp3rdParty,
    setStepValue,
    setDeductibleAmounts,
    setMinDeductibleAmount,
    setMaxDeductibleAmount,
  ]);

  const handleSelectCoverage = async () => {
    try {
      const repairTypes = [
        { type: "thirdParty", apiCall: api3rdParty, condition: null },
        { type: "workShop", apiCall: apiCompWorkShop, condition: PREMIUM_DATA['workShop'] },
        { type: "math", apiCall: apiCompMath, condition: PREMIUM_DATA['math'] },
        { type: "agency", apiCall: apiCompAgency, condition: PREMIUM_DATA['agency'] },
      ];

      const apiPayloadMap = repairTypes.map(({ type, apiCall, condition }) => ({
        type,
        apiCall,
        payload: updateSliderChangeCalculatePremiumPayload(
          "repairCondition",
          "vehicleValue",
          condition,
          sliderValueSumInsured,
          deepCopy(requestPayload)
        ),
      }));

      const apiCalls = apiPayloadMap
        .filter(({ type }) => availableRepairTypes?.includes(type))
        .map(({ apiCall, payload }) => apiCall(payload));

      if (apiCalls.length > 0) {
        await Promise.allSettled(apiCalls);
      }
    } catch (error) {
      console.error("Error in handleSelectCoverage:", error);
    }
  };

  useEffect(() => {
    if (
      sliderValueSumInsured &&
      parseInt(sliderValueSumInsured) !== 0 &&
      previousSliderValueSumInsured.current === ""
    ) {
      previousSliderValueSumInsured.current = sliderValueSumInsured;
    }
  }, [sliderValueSumInsured]);

  const updatebreakvalue = async () => {
    const  dataCompWorkShopCoverageData = dataCompWorkShop ? dataCompWorkShop?.model : compWorkShop;
    const  dataCompMathCoverageData = dataCompMath ? dataCompMath?.model : compMath;
    const  dataCompAgencyCoverageData = dataCompAgency ? dataCompAgency?.model : compAgency;

    const deductibleWorkShop = await dataCompWorkShopCoverageData?.pricingOptions.find(
      (option) => option.deductibleAmount == Number(sliderValueDeductibles)
    );

    const deductibleCompMath = await dataCompMathCoverageData?.pricingOptions.find(
      (option) => option.deductibleAmount == Number(sliderValueDeductibles)
    );
    const deductibleCompAgency = await dataCompAgencyCoverageData?.pricingOptions.find(
      (option) => option.deductibleAmount == Number(sliderValueDeductibles)
    ); 

    if (
      (deductibleWorkShop ?? deductibleCompMath ?? deductibleCompAgency) &&
      !isLoading
    ) {
      // Display Select Repair Type card
      // Set the initial prices for each repair type card
      setWorkShopInitialPrice(deductibleWorkShop?.finalAmount ?? null);
      setAgencyInitialPrice(deductibleCompAgency?.finalAmount ?? null);
      setMathInitialPrice(deductibleCompMath?.finalAmount ?? null);

      // Set the comprehensive card price to the minimum of the three options (Starting from)
      setComprehensiveCardPrice(
        Math.min(
          deductibleWorkShop?.finalAmount ?? Infinity,
          deductibleCompMath?.finalAmount ?? Infinity,
          deductibleCompAgency?.finalAmount ?? Infinity
        )
      );

      // Set the premium breakdowns for each repair type card right panel
      setWsPremiumBreakdown(deductibleWorkShop?.premiumBreakdowns ?? []);
      setMathPremiumBreakdown(
        deductibleCompMath?.premiumBreakdowns ?? []
      );
      setAgencyPremiumBreakdown(
        deductibleCompAgency?.premiumBreakdowns ?? []
      );
    }
  };

  useEffect(() => {
    if (
      sliderValueSumInsured &&
      sliderValueSumInsured != "0" &&
      previousSliderValueSumInsured.current != ""
    ) {
      if (
        Math.abs(
          parseInt(sliderValueSumInsured) -
            parseInt(previousSliderValueSumInsured.current)
        ) >= 100
      ) {
        handleSelectCoverage();
        previousSliderValueSumInsured.current = sliderValueSumInsured;
      } else if (
        isMounted &&
        Math.abs(
          parseInt(sliderValueDeductibles) -
            parseInt(previousSliderValueDeductibles.current)
        ) >= 500
      ) {
        updatebreakvalue();
        previousSliderValueDeductibles.current = sliderValueDeductibles;
      }
    }
  }, [
    sliderValueSumInsured,
    sliderValueDeductibles,
    compWorkShop,
    compMath,
    compAgency,
    dataCompWorkShop,
    dataCompMath,
    dataCompAgency,
    workShopInitialPrice,
    setWorkShopInitialPrice,
    setAgencyInitialPrice,
    setWsPremiumBreakdown,
    setMathPremiumBreakdown,
    setAgencyPremiumBreakdown,
    setMathInitialPrice,
    setComprehensiveCardPrice,
  ]);

  return (
    <div className="sum-insured-and-deductibles">
      {isLoading && <LoaderOverlay />}
      <div className="sum-insured-header walaa-medium-500">
        {languageData?.sum_insured_and_deductible ||
          "Sum Insured And Deductibles"}
      </div>
      <div className="nudge-container">
        <div className="informative-container">
          <div className="logo">
            <img src={Car_Swap} />
          </div>
          <div className="informative-content">
            <div className="informative-content-header walaa-medium-500">
              {languageData?.what_should_be_your_motor ||
                "What should be your motor’s Sum Insured and Deductibles"}
            </div>
            <div className="content walaa-regular-400">
              {getCurrencySymbol(languageData?.your_motor_current_market
                ?.replace(
                  /<<vehicleMinValue>>/g,
                  getAmountText(vehicleDetailsResponseData?.vehicleMinValue)
                )
                ?.replace(
                  /<<vehicleMaxValue>>/g,
                  getAmountText(vehicleDetailsResponseData?.vehicleMaxValue)
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sum-insured-deductible-tiles">
        <div className="left">
          <div className="sum-insured-heading walaa-medium-500">
            {languageData?.sum_insured || "Sum Insured"}
          </div>
          <div className="sum-insured-slider" ref={sumInsuredSliderRef}>
            <input
              id="myinput"
              type="range"
              value={inputValue}
              min={vehicleDetailsResponseData?.vehicleMinValue}
              max={vehicleDetailsResponseData?.vehicleMaxValue}
              step={"100"}
              onChange={handleSumInsuredSliderChange}
              style={{
                background: getSumInsuredSliderBackground(),
              }}
              aria-label="sum insured"
            />
            <span
              className="current-value-sum-assured walaa-medium-500"
              style={{
                left:
                  inputValue >
                  vehicleDetailsResponseData?.vehicleMinValue +
                    (vehicleDetailsResponseData?.vehicleMaxValue -
                      vehicleDetailsResponseData?.vehicleMinValue) *
                      0.9
                    ? "310px"
                    : `${thumbPositionSumAssured}px`,
              }}
            >
              {getCurrencySymbol(languageData?.sar)}
              {getAmountText(inputValue.toString())}
            </span>
            <span
              className="slider-value"
              style={{ left: `${thumbPositionSumAssured}px` }}
            ></span>

            <div className="min-max">
              <div className="slider-values">
                {getAmountText(
                  vehicleDetailsResponseData?.vehicleMinValue?.toString() || ""
                )}
              </div>
              <div className="slider-values">
                {getAmountText(
                  vehicleDetailsResponseData?.vehicleMaxValue?.toString() || ""
                )}
              </div>
            </div>
          </div>

          <div className="max-idv">
            <div>
              <img src={Info} className="max-dev-info-img" />
            </div>
            <div className="max-idv-text walaa-regular-400">
              {languageData?.max_sum_insured_is || "Max Sum Insured is"}{" "}
              {getAmountText(
                vehicleDetailsResponseData?.vehicleMaxValue?.toString() || ""
              )}
            </div>
          </div>
        </div>
        <div className="right">
          <div className="sum-insured-heading walaa-medium-500">
            {languageData?.deductibles || "Deductibles"}
          </div>
          <div className="sum-insured-slider" ref={deductiblesSliderRef}>
            <input
              id="myinput"
              type="range"
              value={sliderValueDeductibles}
              min={minDeductibleAmount?.toString()}
              max={maxDeductibleAmount?.toString()}
              step="500"
              onChange={handleDeductibleSliderChange}
              style={{
                background: getDeductiblesSliderBackground(),
              }}
              aria-label="deductibles"
            />
            <span
              className="current-value-deductibles walaa-medium-500"
              style={{
                left:
                  sliderValueDeductibles <
                  minDeductibleAmount +
                    (maxDeductibleAmount - minDeductibleAmount) * 0.1
                    ? `${thumbPositionDeductibles + 40}px`
                    : `${thumbPositionDeductibles}px`,
              }}
            >
              {getCurrencySymbol(languageData?.sar)}
              {getAmountText(sliderValueDeductibles?.toString())}
            </span>
            <span
              className="slider-value"
              style={{ left: `${thumbPositionDeductibles + 5}px` }}
            ></span>

            <div className="min-max">
              {Array.isArray(deductibleAmounts) &&
                deductibleAmounts.length > 0 && (
                  [Math.min(...deductibleAmounts), Math.max(...deductibleAmounts)].map((val, idx) => (
                    <div className="slider-values" key={`deductible-${idx}`}>
                      {getAmountText(val?.toString() || "")}
                    </div>
                  ))
                )}
            </div>
          </div>
          <div className="max-idv">
            <div>
              <img src={Info} className="max-dev-info-img" />
            </div>
            <div className="max-idv-text walaa-regular-400">
              {languageData?.lesser_the_deductible_bett ||
                "Lesser the deductible, better coverage"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SumInsuredAndDeductibles;
