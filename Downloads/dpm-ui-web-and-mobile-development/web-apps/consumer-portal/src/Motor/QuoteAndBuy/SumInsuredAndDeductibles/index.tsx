import "./styles.scss";
import Car_Swap from "assets/QuoteAndBuy/Car_Swap.svg";
import Info from "assets/CancelPolicy/Info.svg";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useApiCall, getAmountText } from "@dpm/shared-module";
import {
  deepCopy,
  updateSliderChangeCalculatePremiumPayload,
} from "utils/quoteAndBuy";
import useCalculatePremiumPayload from "../hooks/useCalculatePremiumPayload";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import { LoaderOverlay } from "@corporate-portal/components/Loader";
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
    setSliderValueSumInsured(vehicleDetailsResponseData?.vehicleValue);
    setInputValue(vehicleDetailsResponseData?.vehicleValue);
    setSliderValueDeductibles(minDeductibleAmount);
  }, [minDeductibleAmount]);

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
        await setStepValue(2);
        const amounts = await dataPricingOptions?.model?.pricingOptions?.map(
          (option) => option.deductibleAmount
        );
        if (amounts) {
          await setMinDeductibleAmount(Math.min(...amounts));
          await setMaxDeductibleAmount(Math.max(...amounts));
          await amounts.sort((a, b) => a - b);
          await setDeductibleAmounts(amounts);
        }
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
        {
          type: "workShop",
          apiCall: apiCompWorkShop,
          payload: payloadWorkShop,
        },
        { type: "math", apiCall: apiCompMath, payload: payloadMath },
        { type: "agency", apiCall: apiCompAgency, payload: payloadAgency },
      ];

      const apiCalls = apiPayloadMap
        .filter(({ type }) => availableRepairTypes?.includes(type))
        .map(({ apiCall, payload }) => apiCall(payload));

      if (apiCalls.length > 0) {
        await Promise.allSettled(apiCalls);
      }
      if (!isLoading) {
        setTimeout(() => {
          updatebreakvalue();
        }, 500);
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
    const deductibleWorkShop = await compWorkShop?.pricingOptions.find(
      (option) => option.deductibleAmount == Number(sliderValueDeductibles)
    );
    const deductibleCompMath = await compMath?.pricingOptions.find(
      (option) => option.deductibleAmount == Number(sliderValueDeductibles)
    );
    const deductibleCompAgency = await compAgency?.pricingOptions.find(
      (option) => option.deductibleAmount == Number(sliderValueDeductibles)
    );

    if (
      (deductibleWorkShop ?? deductibleCompMath ?? deductibleCompAgency) &&
      !isLoading
    ) {
      // Display Select Repair Type card
      // Set the initial prices for each repair type card
      await setWorkShopInitialPrice(deductibleWorkShop?.finalAmount ?? null);
      await setAgencyInitialPrice(deductibleCompAgency?.finalAmount ?? null);
      await setMathInitialPrice(deductibleCompMath?.finalAmount ?? null);

      // Set the comprehensive card price to the minimum of the three options (Starting from)
      await setComprehensiveCardPrice(
        Math.min(
          deductibleWorkShop?.finalAmount ?? Infinity,
          deductibleCompMath?.finalAmount ?? Infinity,
          deductibleCompAgency?.finalAmount ?? Infinity
        )
      );

      // Set the premium breakdowns for each repair type card right panel
      await setWsPremiumBreakdown(deductibleWorkShop?.premiumBreakdowns ?? []);
      await setMathPremiumBreakdown(
        deductibleCompMath?.premiumBreakdowns ?? []
      );
      await setAgencyPremiumBreakdown(
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
        ) >= 1000
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
              {languageData?.your_motor_current_market
                ?.replace(
                  /<<vehicleMinValue>>/g,
                  vehicleDetailsResponseData?.vehicleMinValue
                )
                ?.replace(
                  /<<vehicleMaxValue>>/g,
                  vehicleDetailsResponseData?.vehicleMaxValue
                )}
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
              step={"1000"}
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
              {languageData?.sar || "SAR"}{" "}
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
              {languageData?.sar || "SAR"}{" "}
              {getAmountText(sliderValueDeductibles?.toString())}
            </span>
            <span
              className="slider-value"
              style={{ left: `${thumbPositionDeductibles + 5}px` }}
            ></span>

            <div className="min-max">
              {Array.isArray(deductibleAmounts) &&
                deductibleAmounts.length > 0 && (
                  <>
                    <div className="slider-values">
                      {getAmountText(
                        Math.min(...deductibleAmounts)?.toString() || ""
                      )}
                    </div>
                    <div className="slider-values">
                      {getAmountText(
                        Math.max(...deductibleAmounts)?.toString() || ""
                      )}
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
