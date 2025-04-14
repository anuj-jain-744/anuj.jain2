import "./styles.scss";
import Car_Swap from "assets/QuoteAndBuy/Car_Swap.svg";
import Info from "assets/CancelPolicy/Info.svg";
import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useApiCall } from "@dpm/shared-module";
import { deepCopy, updateSliderChangeCalculatePremiumPayload } from "utils/quoteAndBuy";
import useCalculatePremiumPayload from "../hooks/useCalculatePremiumPayload";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";

function SumInsuredAndDeductibles({ languageData }: Readonly<{ languageData: LanguageData }>) {
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

  const handleSumInsuredSliderChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    // onchange of Sum Insured slider, set the value of Deductibles slider set to minimum/lesser deductible amount
    setSliderValueDeductibles(minDeductibleAmount?.toString() || sliderValueDeductibles);
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
      ((inputValue - vehicleDetailsResponseData?.vehicleMinValue) / (vehicleDetailsResponseData?.vehicleMaxValue - vehicleDetailsResponseData?.vehicleMinValue)) * 100;
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
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/Comp", "post");
  const {
    makeApiCall: apiCompMath,
    data: dataCompMath,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/Comp", "post");
  const {
    makeApiCall: apiCompAgency,
    data: dataCompAgency,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/Comp", "post");
  const {
    makeApiCall: api3rdParty,
    data: data3rdParty,
  } = useApiCall(2, "/Motor/QuoteAndBuy/V1/Calculate/Premium/TP", "post");

  const requestPayload = useCalculatePremiumPayload();

  useEffect(() => {
    setSliderValueSumInsured(vehicleDetailsResponseData?.vehicleValue);
    setInputValue(vehicleDetailsResponseData?.vehicleValue);
    setSliderValueDeductibles(minDeductibleAmount);
  }, []);

  useEffect(() => {
    dataCompWorkShop && setcompWorkShop(dataCompWorkShop?.model);
    dataCompMath && setcompMath(dataCompMath?.model);
    dataCompAgency && setcompAgency(dataCompAgency?.model);
    data3rdParty && setcomp3rdParty(data3rdParty?.model);

    if (dataCompWorkShop ?? dataCompMath ?? dataCompAgency ?? data3rdParty) {
      const dataPricingOptions = dataCompWorkShop ?? dataCompMath ?? dataCompAgency ?? data3rdParty;
      setStepValue(2);
      const amounts = dataPricingOptions?.model?.pricingOptions?.map(
        (option) => option.deductibleAmount
      );
      if (amounts) {
        setMinDeductibleAmount(Math.min(...amounts));
        setMaxDeductibleAmount(Math.max(...amounts));
        amounts.sort((a, b) => a - b);
        setDeductibleAmounts(amounts);
      }
    }
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
      // Prepare all payloads
      const payload3rdParty = updateSliderChangeCalculatePremiumPayload(
        "repairCondition",
        "vehicleValue",
        null,
        sliderValueSumInsured,
        deepCopy(requestPayload)
      );
      const payloadWorkShop = updateSliderChangeCalculatePremiumPayload(
        "repairCondition",
        "vehicleValue",
        2,
        sliderValueSumInsured,
        deepCopy(requestPayload)
      );
      const payloadMath = updateSliderChangeCalculatePremiumPayload(
        "repairCondition",
        "vehicleValue",
        1,
        sliderValueSumInsured,
        deepCopy(requestPayload)
      );
      const payloadAgency = updateSliderChangeCalculatePremiumPayload(
        "repairCondition",
        "vehicleValue",
        3,
        sliderValueSumInsured,
        deepCopy(requestPayload)
      );

      // Create an array of promises based on available repair types
      const apiPayloadMap = [
        { type: "thirdParty", apiCall: api3rdParty, payload: payload3rdParty },
        { type: "workShop", apiCall: apiCompWorkShop, payload: payloadWorkShop },
        { type: "math", apiCall: apiCompMath, payload: payloadMath },
        { type: "agency", apiCall: apiCompAgency, payload: payloadAgency },
      ];

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
    if (sliderValueSumInsured && parseInt(sliderValueSumInsured) !== 0 && previousSliderValueSumInsured.current === "") {
      previousSliderValueSumInsured.current = sliderValueSumInsured;
    }
  }, [sliderValueSumInsured]);


  useEffect(() => {
    if (sliderValueSumInsured && sliderValueSumInsured != "0" && previousSliderValueSumInsured.current != "") {

      if (
        Math.abs(parseInt(sliderValueSumInsured) - parseInt(previousSliderValueSumInsured.current)) >=
        1000
      ) {
        handleSelectCoverage();
        previousSliderValueSumInsured.current = sliderValueSumInsured;
      } else if (
        isMounted && Math.abs(
          parseInt(sliderValueDeductibles) - parseInt(previousSliderValueDeductibles.current)
        ) >= 500
      ) {
        const deductibleWorkShop = compWorkShop?.pricingOptions.find(
          (option) => option.deductibleAmount == Number(sliderValueDeductibles)
        );
        const deductibleCompMath = compMath?.pricingOptions.find(
          (option) => option.deductibleAmount == Number(sliderValueDeductibles)
        );
        const deductibleCompAgency = compAgency?.pricingOptions.find(
          (option) => option.deductibleAmount == Number(sliderValueDeductibles)
        );

        if (deductibleWorkShop ?? deductibleCompMath ?? deductibleCompAgency) {
          // Display Select Repair Type card 
          // Set the initial prices for each repair type card
          setWorkShopInitialPrice(deductibleWorkShop?.finalAmount ?? null);
          setAgencyInitialPrice(deductibleCompAgency?.finalAmount ?? null);
          setMathInitialPrice(deductibleCompMath?.finalAmount ?? null);

          // Set the comprehensive card price to the minimum of the three options (Starting from)
          setComprehensiveCardPrice(Math.min(
            deductibleWorkShop?.finalAmount ?? Infinity,
            deductibleCompMath?.finalAmount ?? Infinity,
            deductibleCompAgency?.finalAmount ?? Infinity
          ));

          // Set the premium breakdowns for each repair type card right panel
          setWsPremiumBreakdown(deductibleWorkShop?.premiumBreakdowns ?? []);
          setMathPremiumBreakdown(deductibleCompMath?.premiumBreakdowns ?? []);
          setAgencyPremiumBreakdown(deductibleCompMath?.premiumBreakdowns ?? []);
        }
        previousSliderValueDeductibles.current = sliderValueDeductibles;
      }
    }
  }, [
    sliderValueSumInsured,
    sliderValueDeductibles,
    compWorkShop,
    compMath,
    compAgency,
    workShopInitialPrice,
    setWorkShopInitialPrice,
    setAgencyInitialPrice,
    setWsPremiumBreakdown,
    setMathPremiumBreakdown,
    setAgencyPremiumBreakdown,
    setMathInitialPrice,
    setComprehensiveCardPrice
  ]);

  return (
    <div className="sum-insured-and-deductibles">
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
            <div className="content walaa-regular-400">{languageData?.your_motor_current_market?.replace(/<<vehicleMinValue>>/g, vehicleDetailsResponseData?.vehicleMinValue)?.replace(/<<vehicleMaxValue>>/g, vehicleDetailsResponseData?.vehicleMaxValue)}</div>
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
              step={"1000"}
              onChange={handleSumInsuredSliderChange}
              style={{
                background: getSumInsuredSliderBackground(),
              }}
              aria-label="sum insured"
            />
            <span
              className="current-value-sum-assured walaa-medium-500"
              style={{ left: `${thumbPositionSumAssured}px` }}
            >
              {languageData?.sar || "SAR"} {inputValue}.00
            </span>
            <span
              className="slider-value"
              style={{ left: `${thumbPositionSumAssured}px` }}
            ></span>

            <div className="min-max">
              <div className="slider-values">{vehicleDetailsResponseData?.vehicleMinValue}</div>
              <div className="slider-values">{vehicleDetailsResponseData?.vehicleMaxValue}</div>
            </div>
          </div>

          <div className="max-idv">
            <div>
              <img src={Info} className="max-dev-info-img" />
            </div>
            <div className="max-idv-text walaa-regular-400">
              {languageData?.max_sum_insured_is || "Max Sum Insured is"}{" "}
              {vehicleDetailsResponseData?.vehicleMaxValue}
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
              style={{ left: `${thumbPositionDeductibles}px` }}
            >
              {languageData?.sar || "SAR"} {sliderValueDeductibles}.00
            </span>
            <span
              className="slider-value"
              style={{ left: `${thumbPositionDeductibles}px` }}
            ></span>

            <div className="min-max">
              {Array.isArray(deductibleAmounts) &&
                deductibleAmounts.length > 0 && (
                  <>
                    <div className="slider-values">
                      {Math.min(...deductibleAmounts)}
                    </div>
                    <div className="slider-values">
                      {Math.max(...deductibleAmounts)}
                    </div>
                  </>
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