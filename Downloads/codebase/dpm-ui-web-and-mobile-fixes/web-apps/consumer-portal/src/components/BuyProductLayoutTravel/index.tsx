import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertBox } from "components/AlertBox";
import ResumeJourney from "components/ResumeJourneyTravel";
import ValidateTravel from "components/QuoteAndBuy/ValidateTravel";
import TravelCoveragePlan from "components/QuoteAndBuy/CoveragePlan";
import TravelerAddDetails from "components/TravelerAddDetails";
import ReviewQuotation from "components/Travel/ReviewQuotation/ReviewQuotation";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import BuyProductFooter from "components/BuyProductFooter";
import { isValidEmail, useApiCall } from "@dpm/shared-module";
import useSaveRedisData from "hook/common/useSaveRedisData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import useUpdateCoveragePlanPayload from "hook/travel/useUpdateCoveragePlanRequestPayload";
import { useCoveragePlanApi } from "hook/travel/useCoveragePlanApi";
import useUpdateRequestPayload from "hook/travel/useUpdateRequestPayload";
import { useCalculatePremiumApi } from "hook/travel/useCalculatePremiumApi";
import useUpdateDirectDraftRequestPayload from "hook/travel/useUpdateDireactDraftPayload";
import { useDirectDraftApi } from "hook/travel/useDirectDraftApi";
import { getFullAge } from "utils/getFullAge";
import {
  cleanSpaces,
  getTravellerCountsWithoutPrimary,
  isTravellerAdult,
  isTravellerChild,
  isTravellerSenior,
  toTitleCase,
} from "utils/quoteAndBuy";
import {
  worldwidecalculatePremium,
  worldwideexceptcalculatePremium,
  europecalculatePremium,
  worldwideFamilycalculatePremium,
} from "components/QuoteAndBuy/Commonfunction";
import {
  INTERNAL_SERVER_ERROR,
  SOMETHING_WENT_WRONG,
  PRODUCTCODE_TRAVEL,
  TRAVEL_COVERAAGE_DATA,
  JAVA_API_ROUTES,
  TRAVEL_TARIFF_TYPE,
  TRAVEL,
  genderCodes,
  travelerTypeIdMap,
} from "constant";
import {
  defaultTravellerPremiumAPIProps,
  familtyFlowConstants,
} from "components/Travel/constantsTravel";
import "./index.scss";
import { CombinedData, TravelData } from "types/languageData";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { formatTravelDate } from "utils/formatDate";

interface LayoutProps {
  rightPanel: JSX.Element;
  leftStep: number;
  languageData: TravelData | null;
  setLeftStep: (step: number) => void;
}

interface DataRef {
  checkedLastJourney: boolean;
  premiumQueryString: string;
  uniqueKey: string;
}

const Layout = ({
  rightPanel,
  leftStep,
  languageData,
  setLeftStep,
}: LayoutProps) => {
  const [isPaymentButtonDisabled, setIsPaymentButtonDisabled] =
    useState<boolean>(false);
  const requestPayload = useUpdateRequestPayload();
  const directDraftPayload = useUpdateDirectDraftRequestPayload();
  const coveragePlanPayload = useUpdateCoveragePlanPayload();
  const location = useLocation();
  const propsData = location?.state?.data;
  const [resumeJourney, setResumeJourney] = useState<boolean>(false);
  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);

  const navigate = useNavigate();

  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [isTravelDetailValid, setIsTravelDetailValid] =
    useState<boolean>(false);
  const [isEnableAddTravellerDetails, setIsEnableAddTravellerDetails] =
    useState<boolean>(false);
  const [newQuotationStatus, setNewQuotationStatus] = useState<boolean>(false);
  const {
    isTermCondition,
    email,
    coverageType = "comprehensive",
    setCoverageType,
    setRepairTypeSelected,
    setStepValue,
    isToggleOn,
    travelcoverageType,
    travelcoveragePlan,
    isAddTravelerValidation,
    quoteDataResponse,
    setRedisKey,
    setJourneyData,
    adultCount,
    childCount,
    srCitizenCount,
    ownerDetailsResponseData,
    setOwnerDetailsResponseData,
    dataCoverageplanselfworldwide,
    travellerType,
    primaryTravelers,
    setPrimaryTravelers,
    travelers,
    setTravelers,
    travelersChild,
    setTravelersChild,
    travelersSrcitizen,
    setTravelersSrcitizen,
    travelcoverage,
    setTravelCoverage,
    setTravelCoveragePlan,
    setTravelCoverageType,
    travelcoverageTypeCode,
    setTravelCoverageTypeCode,
    worldwideFamilyCPPrice,
    worldwideSelfCPPrice,
    worldwideexceptSelfCPPrice,
    europeSelfCPPrice,
    setworldwideFamilyCPPrice,
    setworldwideSelfCPPrice,
    setworldwideexceptSelfCPPrice,
    seteuropeSelfCPPrice,
    setIsToggleOn,
    setAdultCount,
    setChildCount,
    setSrCitizenCount,
    setTravellerType,
    schemeCode,
    dataWorldwidepearl,
    dataWorldwidetraveller,
    setworldwidepearlInitialPrice,
    setworldwidetravellerInitialPrice,
    setworldwideCardPrice,
    setdataworldwidepearlVAT,
    setdataworldwidepearladminfee,
    setdataworldwidepearlnetpremium,
    setdataworldwidetravellerVAT,
    setdataworldwidetravelleradminfee,
    setdataworldwidetravellernetpremium,
    travelCovidcoverage,
    travelWintersportscoverage,
    dataWorldwideexceptpearl,
    dataWorldwideexcepttraveller,
    setworldwideexceptpearlInitialPrice,
    setworldwideexcepttravellerInitialPrice,
    setworldwideexceptCardPrice,
    setdataworldwideexceptpearlVAT,
    setdataworldwideexceptpearladminfee,
    setdataworldwideexceptpearlnetpremium,
    setdataworldwideexcepttravellerVAT,
    setdataworldwideexcepttravelleradminfee,
    setdataworldwideexcepttravellernetpremium,
    dataEuropeeurope,
    dataEuropeschengen,
    setEuropeeuropeInitialPrice,
    setEuropeschengenInitialPrice,
    setEuropeCardPrice,
    setEuropeeuropeVAT,
    setdataEuropeeuropeadminfee,
    setdataEuropeeuropenetpremium,
    setdataEuropeschengenVAT,
    setdataEuropeschengenadminfee,
    setdataEuropeschengennetpremium,
    dataworldwideCoverageFamily,
    travelDateRange,
  } = useQuoteAndBuyContext();

  const [travelStartDate] = travelDateRange;

  const {
    handleCalculatePremium,
    handleCalculatePremiumFamily,
    isError: premiumError,
  } = useCalculatePremiumApi();
  const {
    handlecoveragePlanSelf,
    handlecoveragePlanFamily,
    PlanError,
    isLoadingCoveragePlan,
    isCovergePlaData,
  } = useCoveragePlanApi(setLeftStep);
  const [travelCoverageTypeJourney, setTravelCoverageTypeJourney] = useState<
    string | null
  >(null);
  const [triggerCoveragePlpan, setTriggerCoveragePlan] =
    useState<boolean>(false);

  const dataRef = useRef<DataRef>({
    checkedLastJourney: false,
    premiumQueryString: "",
    uniqueKey: `${propsData?.ownerId}_${propsData?.mobileNumber}_${TRAVEL}`,
  });
  const { saveRedisData } = useSaveRedisData();

  const handleMakePayment = async () => {
    if (isTermCondition && isValidEmail(email ?? "")) {
      setCallGenerateOtp(true);
    }
  };
  const handleSelectCoverage = async () => {
    try {
      if (coveragePlanPayload !== null) {
        if (travellerType === travelerTypeIdMap.family) {
          await handlecoveragePlanFamily(coveragePlanPayload);
        } else {
          await handlecoveragePlanSelf(coveragePlanPayload);
        }
      }
      saveRedisData(
        "multiValue",
        {
          coverageType,
          travelDateRange,
          isToggleOn,
          adultCount,
          childCount,
          srCitizenCount,
          travelcoverageType,
          travelcoveragePlan,
          travellerType,
          travelcoverage,
          ownerDetailsResponseData,
          travelcoverageTypeCode: travelCoverageTypeJourney,
          email,
        },
        2
      );
    } catch (error) {
      console.error("One or more Calculate premium API calls failed:", error);
    }
  };

  const {
    handleReviewQuotePremium,
    isError: isErrorDirect,
    isloadingdirectdraft: isloadingdirectdraft,
    isDirectData: isDirectData,
  } = useDirectDraftApi();

  const handleReviewQuote = async () => {
    try {
      if (directDraftPayload !== null) {
        await handleReviewQuotePremium(directDraftPayload);
      }
    } catch (error) {
      console.error("One or more Calculate premium API calls failed:", error);
    }
  };
  const { makeApiCall: redisKey, data: redisData } = useApiCall<
    { key: string },
    undefined
  >(6, `${JAVA_API_ROUTES?.redisGetValue}/${dataRef.current.uniqueKey}`, "get");
  const handleOnContinueJourney = () => {
    setResumeJourney(false);
    setTriggerCoveragePlan(true);
  };
  const handleNewQuotation = () => {
    saveRedisData("empty", null, 1);
    setJourneyData("");
    setCoverageType(null);
    setRepairTypeSelected(null);
    setIsToggleOn(true);
    setTravellerType(travelerTypeIdMap.self);
    setLeftStep(0);
    setTravelCoverage(null);
    setTravelCoverageTypeJourney(null);
    setTravelCoverageTypeCode(null);
    setTravelCoverageType(null);
    setTravelCoveragePlan(null);
    setResumeJourney(false);
  };

  useEffect(() => {
    if (triggerCoveragePlpan === true && leftStep === 2) {
      handleSelectCoverage();
    }
  }, [triggerCoveragePlpan, coveragePlanPayload]);

  useEffect(() => {
    if (leftStep === 2) {
      handleSelectCoverage();
    }
  }, [travellerType]);

  useEffect(() => {
    const ownerData = {
      ...propsData?.ownerDetail,
      ownerId: propsData?.ownerId,
      mobileNumber: propsData?.mobileNumber,
    };
    ownerData.age =
      ownerData.ownerDobG && ownerData.ownerDobG !== familtyFlowConstants.dobG
        ? getFullAge(ownerData.ownerDobG, "-")
        : familtyFlowConstants.adultAge;
    const timestamp = `${ownerData.ownerId || Date.now()}`;
    const primary = {
      uiId: timestamp,
      travellerNameEnglish: toTitleCase(
        cleanSpaces(ownerData.ownerFullNameEnglish)
      ),
      travellerNameArabic: ownerData.ownerFullNameArabic ?? "",
      passportNumber: "",
      passportExpiryDate: "",
      nationalIqamaId: timestamp,
      dateOfBirth: ownerData.ownerDobG || familtyFlowConstants.dateOfBirth,
      nationality: ownerData.nationality || familtyFlowConstants.nationality,
      relation: "1",
      personAge: ownerData.age,
      gender: ownerData.gender ?? "",
      policyCoverage: [],
      type: familtyFlowConstants.TITLES.SELF,
    };
    setRedisKey(dataRef.current.uniqueKey);
    redisKey();
    if (isTravellerChild(primary.personAge)) setChildCount(1);
    else if (isTravellerAdult(primary.personAge)) setAdultCount(1);
    else if (isTravellerSenior(primary.personAge)) setSrCitizenCount(1);
    setOwnerDetailsResponseData(ownerData);
    setPrimaryTravelers([primary]);
  }, []);

  useEffect(() => {
    if (primaryTravelers.length > 0) {
      const counts = getTravellerCountsWithoutPrimary(primaryTravelers[0], {
        child: childCount as number,
        adult: adultCount as number,
        senior: srCitizenCount as number,
      });
      const timestamp = Date.now();
      let idCount = 1;
      const updateTravellers = (
        persons: Array<travelersInfo>,
        update: (data: Array<travelersInfo>) => void,
        count: number,
        type: string
      ) => {
        const items = [];
        let isValidData = persons.length === count;
        for (let index = 0; index < count; index++) {
          if (persons[index]?.uiId) items.push(persons[index]);
          else {
            isValidData = false;
            items.push({
              gender: "",
              dateOfBirth: "",
              ...persons[index],
              travellerNameEnglish: "",
              passportNumber: "",
              passportExpiryDate: "",
              uiId: `${timestamp}${idCount++}`,
              policyCoverage: persons[index]?.policyCoverage ?? [],
              type,
            });
          }
          items[index].nationalIqamaId = items[index].uiId;
          items[index].nationality = primaryTravelers[0]?.nationality ?? "";
        }
        if (isValidData === false) update(items);
      };
      updateTravellers(
        travelersChild,
        setTravelersChild,
        counts.child,
        familtyFlowConstants.TITLES.CHILD
      );
      updateTravellers(
        travelers,
        setTravelers,
        counts.adult,
        familtyFlowConstants.TITLES.ADULT
      );
      updateTravellers(
        travelersSrcitizen,
        setTravelersSrcitizen,
        counts.senior,
        familtyFlowConstants.TITLES.SR_CITIZEN
      );
    }
  }, [
    primaryTravelers.length && primaryTravelers[0].personAge,
    childCount,
    adultCount,
    srCitizenCount,
  ]);

  useEffect(() => {
    setTravelCoverageTypeJourney(travelcoverageTypeCode);
  }, [travelcoverageTypeCode]);

  useEffect(() => {
    if (redisData) {
      if (dataRef.current.checkedLastJourney === false) {
        dataRef.current.checkedLastJourney = true;
        setResumeJourney(true);
      }
    }
  }, [redisData]);

  useEffect(() => {
    if (isDirectData) {
      navigate &&
        navigate("/product/insurance-payment", {
          state: {
            quoteData: quoteDataResponse ?? null,
            userInfo: propsData,
            productCode: PRODUCTCODE_TRAVEL,
          },
        });
      //  setLeftStep(5);
    }
  }, [isDirectData, setLeftStep]);

  const handleClose = () => {
    setShowAlertModal(false);
  };

  const handleBackBtn = () => {
    setLeftStep(leftStep - 1);
  };

  useEffect(() => {
    if (PlanError) {
      setApiErrorMessage({
        title: PlanError?.name || INTERNAL_SERVER_ERROR,
        description: PlanError.messages?.message_en ?? SOMETHING_WENT_WRONG,
      });
      setShowAlertModal(true);
    }
  }, [PlanError]);
  // direct draft API

  useEffect(() => {
    if (isErrorDirect) {
      setApiErrorMessage({
        title: isErrorDirect?.name || INTERNAL_SERVER_ERROR,
        description: isErrorDirect.messages?.message_en ?? SOMETHING_WENT_WRONG,
      });
      setShowAlertModal(true);
    }
  }, [isErrorDirect]);
  const productFooter = () => {
    switch (leftStep) {
      case 0:
      case 1: {
        const isBtnDisabled =
          isTravelDetailValid ||
          (ownerDetailsResponseData?.age > 80 &&
            travellerType === travelerTypeIdMap.family) ||
          isAddTravelerValidation;
        return (
          <BuyProductFooter
            classNames={
              isBtnDisabled ? "make-btn-payment" : "make-btn-payment-active"
            }
            languageData={languageData}
            isBackButtonHide={true}
            handleOnClickHandler={handleSelectCoverage}
            isDisabledButton={isBtnDisabled}
            buttonTitle={
              languageData?.select_coverage
                ? languageData?.select_coverage.toString()
                : ""
            }
          />
        );
      }
      case 2:
        return (
          <BuyProductFooter
            classNames={
              !isEnableAddTravellerDetails
                ? "make-btn-payment"
                : "make-btn-payment-active"
            }
            languageData={languageData}
            isBackButtonHide={false}
            handleOnClickHandler={() => {
              saveRedisData(
                "multiValue",
                {
                  coverageType,
                  travelDateRange,
                  isToggleOn,
                  adultCount,
                  childCount,
                  srCitizenCount,
                  travelcoverageType,
                  travelcoveragePlan,
                  travelcoverage,
                  ownerDetailsResponseData,
                  travelcoverageTypeCode: travelCoverageTypeJourney,
                  email,
                },
                3
              );
              setLeftStep(3);
            }}
            isDisabledButton={!isEnableAddTravellerDetails}
            buttonTitle={
              languageData?.review_quotation
                ? languageData?.addTravellerDetails.toString()
                : ""
            }
            handleBackBtn={handleBackBtn}
          />
        );
      case 3:
        return (
          <BuyProductFooter
            classNames={
              isAddTravelerValidation
                ? "make-btn-payment"
                : "make-btn-payment-active"
            }
            languageData={languageData}
            isBackButtonHide={false}
            handleOnClickHandler={() => {
              saveRedisData(
                "multiValue",
                {
                  coverageType,
                  travelDateRange,
                  isToggleOn,
                  adultCount,
                  childCount,
                  srCitizenCount,
                  travelcoverageType,
                  travelcoveragePlan,
                  primaryTravelers,
                  travelers,
                  travelersChild,
                  travelersSrcitizen,
                  travelcoverage,
                  ownerDetailsResponseData,
                  travelcoverageTypeCode: travelCoverageTypeJourney,
                  worldwideFamilyCPPrice,
                  worldwideSelfCPPrice,
                  worldwideexceptSelfCPPrice,
                  europeSelfCPPrice,
                  email,
                },
                4
              );
              setLeftStep(4);
            }}
            isDisabledButton={isAddTravelerValidation}
            buttonTitle={
              languageData?.review_quotation
                ? languageData?.review_quotation.toString()
                : ""
            }
            handleBackBtn={handleBackBtn}
          />
        );
      case 4:
        return (
          <BuyProductFooter
            classNames={
              isPaymentButtonDisabled
                ? "make-btn-payment"
                : "make-btn-payment-active"
            }
            languageData={languageData}
            isBackButtonHide={false}
            handleOnClickHandler={() => {
              handleMakePayment();
            }}
            isDisabledButton={isPaymentButtonDisabled}
            buttonTitle={
              languageData?.make_payment
                ? languageData?.make_payment.toString()
                : ""
            }
            handleBackBtn={handleBackBtn}
          />
        );
      default:
        break;
    }
  };

  useEffect(() => {
    setIsPaymentButtonDisabled(!(isTermCondition && isValidEmail(email ?? "")));
  }, [isTermCondition, email]);

  useEffect(() => {
    const totalCount = childCount + adultCount + srCitizenCount;
    const isTravelDurationSelected = travelDateRange.length > 0;
    let disable = true;
    if (isTravelDurationSelected) {
      if (isToggleOn || totalCount > 1) {
        disable = false;
      }
    }
    setIsTravelDetailValid(disable);
  }, [travelDateRange, isToggleOn, adultCount, childCount, srCitizenCount]);

  useEffect(() => {
    if (travelcoverageType && travelcoveragePlan) {
      setIsEnableAddTravellerDetails(true);
    } else {
      setIsEnableAddTravellerDetails(false);
    }
  }, [travelcoverageType, travelcoveragePlan]);

  const getCoverage = (arr: travelersInfo[]) => {
    return arr.map((item) =>
      (item?.policyCoverage ?? [])
        .map((val) => val.coverageCode)
        .sort((a, b) => a.localeCompare(b))
    );
  };

  useEffect(() => {
    if (leftStep === 3 || leftStep === 4 || leftStep === 2) {
      const queryString = dataRef.current.premiumQueryString;
      const newQuery = {
        primary: {
          count: primaryTravelers.length,
          coverage: getCoverage(primaryTravelers),
        },
        adult: {
          count: travelers.length,
          coverage: getCoverage(travelers),
          personAge: travelers.map(
            (item) =>
              item?.personAge ?? defaultTravellerPremiumAPIProps.adult.personAge
          ),
        },
        child: {
          count: travelersChild.length,
          coverage: getCoverage(travelersChild),
          personAge: travelersChild.map(
            (item) =>
              item?.personAge ?? defaultTravellerPremiumAPIProps.child.personAge
          ),
        },
        senior: {
          count: travelersSrcitizen.length,
          coverage: getCoverage(travelersSrcitizen),
          personAge: travelersSrcitizen.map(
            (item) =>
              item?.personAge ??
              defaultTravellerPremiumAPIProps.senior.personAge
          ),
        },
        validPayload: requestPayload?.policyCustomer ? true : false,
        adultCount,
        childCount,
        srCitizenCount,
        schemeCode,
        policyEffectiveDate: travelStartDate,
      };
      const newQueryString = JSON.stringify(newQuery);
      if (
        newQueryString !== queryString &&
        newQuery.validPayload === true &&
        travelcoverageTypeCode &&
        travelcoverage
      ) {
        dataRef.current.premiumQueryString = newQueryString;
        const riskObj = {
          travellerNameEnglish: " ",
          travellerNameArabic: " ",
          passportNumber: " ",
          nationalIqamaId: " ",
          nationality: "",
          gender: "",
          policyCoverage: [],
          dateOfBirth: "",
          passportExpiryDate: "",
          personAge: 0,
          relation: "1",
        };
        const primary = primaryTravelers.map((item) => ({
          ...item,
          travellerNameEnglish:
            cleanSpaces(item.travellerNameEnglish) ||
            familtyFlowConstants.TITLES.SELF,
          dateOfBirth: formatTravelDate(
            item.dateOfBirth || familtyFlowConstants.dateOfBirth
          ),
          passportExpiryDate: formatTravelDate(
            item.passportExpiryDate || familtyFlowConstants.passportExpiryDate
          ),
          passportNumber:
            item.passportNumber || familtyFlowConstants.passportNumber,
        }));
        Object.assign(riskObj, primary[0]);
        const policyRisk: Array<typeof riskObj> = [
          ...(primary as Array<typeof riskObj>),
        ];

        const addItems = (
          items: Array<typeof riskObj>,
          itemProps: Partial<typeof riskObj>,
          typeoftraveler: string
        ) => {
          const persons = items.map((item) => item || {});
          persons.forEach((item, index) => {
            const additionalProps = {
              nationalIqamaId:
                item.nationalIqamaId ?? `${typeoftraveler} ${index + 1}`,
              travellerNameEnglish:
                item.travellerNameEnglish || `${typeoftraveler} ${index + 1}`,
              travellerNameArabic: " ",
              passportNumber:
                item.passportNumber || familtyFlowConstants.passportNumber,
              passportExpiryDate: item.passportExpiryDate
                ? formatTravelDate(item.passportExpiryDate)
                : riskObj.passportExpiryDate,
              dateOfBirth: item.dateOfBirth
                ? formatTravelDate(item.dateOfBirth)
                : itemProps.dateOfBirth,
              policyCoverage: item.policyCoverage ?? [],
              personAge: item.personAge ?? itemProps.personAge,
              relation: item.relation ?? itemProps.relation,
              gender: item.gender || genderCodes.male,
            };
            additionalProps.travellerNameEnglish = cleanSpaces(
              additionalProps.travellerNameEnglish
            );
            policyRisk.push({ ...riskObj, ...item, ...additionalProps });
          });
        };
        if ((adultCount as number) > 0) {
          const primaryCount =
            primary[0]?.personAge > familtyFlowConstants.adultAge &&
            primary[0]?.personAge <
              familtyFlowConstants.SENIOR_CITIZEN_AGE_CHECK
              ? 1
              : 0;
          const items =
            travelers.length === adultCount
              ? travelers
              : Array(adultCount - primaryCount)
                  .fill(null)
                  .map((item, index) => travelers[index] || {});
          addItems(
            items,
            defaultTravellerPremiumAPIProps.adult,
            familtyFlowConstants.TITLES.ADULT
          );
        }
        if ((childCount as number) > 0) {
          const primaryCount =
            primary[0]?.personAge < familtyFlowConstants.adultAge ? 1 : 0;
          const items =
            travelersChild.length === childCount
              ? travelersChild
              : Array(childCount - primaryCount)
                  .fill(null)
                  .map((item, index) => travelersChild[index] || {});
          addItems(
            items,
            defaultTravellerPremiumAPIProps.child,
            familtyFlowConstants.TITLES.CHILD
          );
        }
        if ((srCitizenCount as number) > 0) {
          const primaryCount =
            primary[0]?.personAge >
            familtyFlowConstants.SENIOR_CITIZEN_AGE_CHECK
              ? 1
              : 0;
          const items =
            travelersSrcitizen.length === srCitizenCount
              ? travelersSrcitizen
              : Array(srCitizenCount - primaryCount)
                  .fill(null)
                  .map((item, index) => travelersSrcitizen[index] || {});
          addItems(
            items,
            defaultTravellerPremiumAPIProps.senior,
            familtyFlowConstants.TITLES.SR_CITIZEN
          );
        }
        const payload = {
          ...requestPayload,
          policyRisk: policyRisk,
        };
        if (schemeCode?.schemeCode) {
          payload.schemeCode = schemeCode.schemeCode;
          payload.ratingType = TRAVEL_TARIFF_TYPE.broker;
        }
        if (travellerType === travelerTypeIdMap.family) {
          const familyPayload = {
            ...payload,
            plan: TRAVEL_COVERAAGE_DATA.family,
          };
          handleCalculatePremiumFamily(familyPayload);
        } else handleCalculatePremium(payload);
      }
    }
  }, [
    leftStep,
    requestPayload,
    primaryTravelers,
    travelers,
    travelersChild,
    travelersSrcitizen,
    adultCount,
    childCount,
    srCitizenCount,
    schemeCode,
    travelcoverageTypeCode,
    travelcoverage,
    travellerType,
  ]);

  useEffect(() => {
    if (premiumError) {
      setApiErrorMessage({
        title: premiumError?.name || INTERNAL_SERVER_ERROR,
        description: premiumError.messages?.message_en ?? SOMETHING_WENT_WRONG,
      });
      setShowAlertModal(true);
    }
  }, [premiumError]);

  useEffect(() => {
    if (dataWorldwidepearl && dataWorldwidetraveller) {
      const priceData = worldwidecalculatePremium(
        dataWorldwidepearl,
        dataWorldwidetraveller
      );
      setworldwidepearlInitialPrice(
        priceData?.dataworldwidepearlFinalPrice ?? null
      );
      setworldwidetravellerInitialPrice(
        priceData?.dataworldwidetravellerFinalPrice ?? null
      );
      setworldwideCardPrice(priceData?.minFinalPrice);
      setdataworldwidepearlVAT(priceData?.dataworldwidepearlVAT);
      setdataworldwidepearladminfee(priceData?.dataworldwidepearladminfee);
      setdataworldwidepearlnetpremium(priceData?.dataworldwidepearlnetpremium);
      setdataworldwidetravellerVAT(priceData?.dataworldwidetravellerVAT);
      setdataworldwidetravelleradminfee(
        priceData?.dataworldwidetravelleradminfee
      );
      setdataworldwidetravellernetpremium(
        priceData?.dataworldwidetravellernetpremium
      );
      setworldwideSelfCPPrice(priceData);
    }
  }, [
    dataWorldwidepearl,
    dataWorldwidetraveller,
    travelCovidcoverage,
    travelWintersportscoverage,
  ]);

  useEffect(() => {
    if (dataWorldwideexceptpearl && dataWorldwideexcepttraveller) {
      const priceData = worldwideexceptcalculatePremium(
        dataWorldwideexceptpearl,
        dataWorldwideexcepttraveller
      );
      setworldwideexceptpearlInitialPrice(
        priceData?.dataworldwideexceptpearlFinalPrice ?? null
      );
      setworldwideexcepttravellerInitialPrice(
        priceData?.dataworldwideexcepttravellerFinalPrice ?? null
      );
      setworldwideexceptCardPrice(priceData?.minFinalPrice);
      setdataworldwideexceptpearlVAT(priceData?.dataworldwideexceptpearlVAT);
      setdataworldwideexceptpearladminfee(
        priceData?.dataworldwideexceptpearladminfee
      );
      setdataworldwideexceptpearlnetpremium(
        priceData?.dataworldwideexceptpearlnetpremium
      );
      setdataworldwideexcepttravellerVAT(
        priceData?.dataworldwideexcepttravellerVAT
      );
      setdataworldwideexcepttravelleradminfee(
        priceData?.dataworldwideexcepttravelleradminfee
      );
      setdataworldwideexcepttravellernetpremium(
        priceData?.dataworldwideexcepttravellernetpremium
      );
      setworldwideexceptSelfCPPrice(priceData);
    }
  }, [
    dataWorldwideexceptpearl,
    dataWorldwideexcepttraveller,
    travelCovidcoverage,
    travelWintersportscoverage,
  ]);

  useEffect(() => {
    if (dataEuropeeurope && dataEuropeschengen) {
      const priceData = europecalculatePremium(
        dataEuropeeurope,
        dataEuropeschengen
      );
      setEuropeeuropeInitialPrice(
        priceData?.dataEuropeeuropeFinalPrice ?? null
      );
      setEuropeschengenInitialPrice(
        priceData?.dataEuropeschengenFinalPrice ?? null
      );
      setEuropeCardPrice(priceData?.minFinalPrice);
      setEuropeeuropeVAT(priceData?.dataEuropeeuropeVAT);
      setdataEuropeeuropeadminfee(priceData?.dataEuropeeuropeadminfee);
      setdataEuropeeuropenetpremium(priceData?.dataEuropeeuropenetpremium);
      setdataEuropeschengenVAT(priceData?.dataEuropeschengenVAT);
      setdataEuropeschengenadminfee(priceData?.dataEuropeschengenadminfee);
      setdataEuropeschengennetpremium(priceData?.dataEuropeschengennetpremium);
      seteuropeSelfCPPrice(priceData);
    }
  }, [
    dataEuropeeurope,
    dataEuropeschengen,
    travelCovidcoverage,
    travelWintersportscoverage,
  ]);

  useEffect(() => {
    if (dataworldwideCoverageFamily) {
      const priceDataWorldwidFamily = worldwideFamilycalculatePremium(
        dataworldwideCoverageFamily
      );
      setworldwideFamilyCPPrice(priceDataWorldwidFamily);
    }
  }, [
    dataworldwideCoverageFamily,
    travelCovidcoverage,
    travelWintersportscoverage,
  ]);

  return (
    <div className="quote-container">
      {languageData && (
        <ResumeJourney
          show={resumeJourney}
          onContinue={handleOnContinueJourney}
          onNew={handleNewQuotation}
          languageData={languageData}
          setLeftStep={setLeftStep}
          redisData={redisData}
        />
      )}
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
      />
      {languageData && (
        <OTPWrapper
          generateOtpUrl={"GenerateOtp"}
          validateOtpUrl={"ValidateOtp"}
          languageData={{
            enter_otp_code: languageData?.enter_otp_code,
            your_otp_will_expire: languageData?.your_otp_will_expire,
            confirm_otp: languageData?.confirm_otp,
            resend_otp: languageData?.resend_otp,
            otp_validity_expired_msg: languageData?.otp_validity_expired_msg,
          }}
          handleSuccessValidation={() => {
            handleReviewQuote();
          }}
          payload={{
            mobileNumber: propsData?.mobileNumber,
          }}
          callGenerateOtp={callGenerateOtp}
          setCallGenerateOtp={setCallGenerateOtp}
        />
      )}
      <div className="leftPanel">
        {languageData &&
          (leftStep === 0 || leftStep === 1 ? (
            <ValidateTravel langData={languageData} />
          ) : leftStep === 2 ? (
            <TravelCoveragePlan
              TravelData={languageData}
              setStepValue={setStepValue}
              proposerAge={ownerDetailsResponseData?.age}
            />
          ) : leftStep === 3 ? (
            <TravelerAddDetails
              data={languageData as CombinedData}
              setLeftStep={setLeftStep}
            />
          ) : leftStep === 4 ? (
            <ReviewQuotation
              languageData={languageData as CombinedData}
              leftStep={leftStep}
              setLeftStep={setLeftStep}
            />
          ) : null)}
      </div>
      <div className="rightPanel">{rightPanel}</div>
      {productFooter()}
    </div>
  );
};

export default Layout;
