import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import BuyProductFooter from "components/BuyProductFooter";
import ValidateTravel from "components/QuoteAndBuy/ValidateTravel";
import TravelCoveragePlan from "components/QuoteAndBuy/CoveragePlan";
import TravelerAddDetails from "components/TravelerAddDetails";
import ReviewQuotation from "components/Travel/ReviewQuotation/ReviewQuotation";
import { CombinedData, TravelData } from "types/languageData";
import useUpdateRequestPayload from "hook/travel/useUpdateRequestPayload";
import useUpdateDirectDraftRequestPayload from "hook/travel/useUpdateDireactDraftPayload";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { isValidEmail, useApiCall } from "@dpm/shared-module";
import { AlertBox } from "components/AlertBox";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import { useLocation } from "react-router-dom";
import { useCalculatePremiumApi } from "hook/travel/useCalculatePremiumApi";
import { useDirectDraftApi } from "hook/travel/useDirectDraftApi";
import {
  INTERNAL_SERVER_ERROR,
  SOMETHING_WENT_WRONG,
  PRODUCTCODE_TRAVEL,
  TRAVEL_COVERAAGE_DATA,
  JAVA_API_ROUTES,
  TRAVEL_TARIFF_TYPE,
} from "constant";
import useUpdateCoveragePlanPayload from "hook/travel/useUpdateCoveragePlanRequestPayload";
import { useCoveragePlanApi } from "hook/travel/useCoveragePlanApi";
import ResumeJourney from "components/ResumeJourneyTravel";
import useSaveRedisData from "hook/common/useSaveRedisData";
import { useNavigate } from "react-router-dom";
import { formatTravelDate } from "utils/formatDate";
import { getFullAge } from "utils/getFullAge";
import { getTravellerCountsWithoutPrimary } from "utils/quoteAndBuy";
import {
  defaultTravellerPremiumAPIProps,
  familtyFlowConstants,
} from "components/Travel/constantsTravel";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";

interface LayoutProps {
  rightPanel: JSX.Element;
  leftStep: number;
  languageData: TravelData | null;
  setLeftStep: (step: number) => void;
}

const Layout: React.FC<LayoutProps> = ({
  rightPanel,
  leftStep,
  languageData,
  setLeftStep,
}) => {
  const [isPaymentButtonDisabled, setIsPaymentButtonDisabled] = useState<boolean>(false)
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
    description: ""
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [isEnableTravellReviewQuotation, setIsEnableTravellReviewQuotation] = useState<boolean>(true);
  const [isTravelDetailValid, setIsTravelDetailValid] = useState<boolean>(false);
  const[isEnableAddTravellerDetails, setIsEnableAddTravellerDetails] = useState<boolean>(false);
  const productTravel = "Travel";
  const {
    isTermCondition,
    email,
    coverageType = "comprehensive",
    setCoverageType,
    setRepairTypeSelected,
    setStepValue,
    selectedPeriod,
    travelStartDate,
    isToggleOn,
    totalCount,
    travelcoverageType,
    travelcoveragePlan,
    isAddTravelerValidation,
    setQuoteDataResponse,
    quoteDataResponse,
    setRedisKey,
    travelJourneyData,
    setTravelJourneyData,
    journeyData,
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
    setTravelStartDate,
    setSelectedPeriod,
    setIsToggleOn,
    setTotalCount,
    setAdultCount,
    setChildCount,
    setSrCitizenCount,
    setTravellerType,
    schemeCode,
  } = useQuoteAndBuyContext();
  const travellerTypeCode = travellerType === "1" ? "1" : "2";
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
    isCovergePlaData
  } = useCoveragePlanApi(setLeftStep);
  const [travelCoverageTypeJourney, setTravelCoverageTypeJourney] = useState<string | null>(null);
  const dataRef = useRef<{
    checkedLastJourney: boolean;
    premiumQueryString: string;
  }>({
    checkedLastJourney: false,
    premiumQueryString: "",
  });
  const { saveRedisData } = useSaveRedisData();
  const uniqueKey =
    propsData?.ownerId.toString() +
    propsData?.mobileNumber?.toString() +
    productTravel;

    const handleMakePayment = async () => {
      if (isTermCondition && isValidEmail(email ??"") ) {
        setCallGenerateOtp(true);
      }
    };
  const handleSelectCoverage = async () => {
    try { 
      if (coveragePlanPayload !== null ) {
             
        if(travellerTypeCode === "1") { 
          await handlecoveragePlanFamily(coveragePlanPayload);
        } else {
          await handlecoveragePlanSelf(coveragePlanPayload);
        }
       
      }
      saveRedisData("multiValue", {
        coverageType,
        travelStartDate: travelStartDate?.toLocaleString(),
        selectedPeriod,
        isToggleOn,
        totalCount,
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
      }, 2);
      
    } catch (error) {
      console.error("One or more Calculate premium API calls failed:", error);
    }
  };

    const { handleReviewQuotePremium, 
    isError : isErrorDirect , 
    isloadingdirectdraft :isloadingdirectdraft, 
    isDirectData : isDirectData } 
  = useDirectDraftApi();
 
  const handleReviewQuote = async () => {
    try {
      if (directDraftPayload !== null) {
      await handleReviewQuotePremium(directDraftPayload);
        
      }
    } catch (error) {
      console.error("One or more Calculate premium API calls failed:", error);
    }  
  };
  const { makeApiCall: redisKey, data: redisData } = useApiCall<{key: string}, undefined>(
    6,
    `${JAVA_API_ROUTES?.redisGetValue}/${uniqueKey}`,
    "get",
  );
  const handleOnContinueJourney = () => {
    setResumeJourney(false);
  };
  const handleNewQuotation = () => {
    saveRedisData("empty", null, 1);
    setCoverageType(null);
    setTravelStartDate(null);
    setSelectedPeriod(null);
    setIsToggleOn(true);
    setTravellerType("2");
    setTotalCount(0);
    setAdultCount(0);
    setChildCount(0);
    setSrCitizenCount(0);
    setLeftStep(0);
    setTravelCoverage(null);
    setTravelCoverageTypeJourney(null);
    setTravelCoverageTypeCode(null);
    setTravelCoverageType(null);
    setTravelCoveragePlan(null);
    setResumeJourney(false);
  };

  useEffect(() => {
    const ownerData = {
      ...propsData?.ownerDetail,
      ownerId: propsData?.ownerId,
      mobileNumber: propsData?.mobileNumber,
    };
    const timestamp = `${Date.now()}`;
    const primary = {
      uiId: timestamp,
      travellerNameEnglish: ownerData.ownerFullNameEnglish ?? "",
      travellerNameArabic: ownerData.ownerFullNameArabic ?? "",
      passportNumber: familtyFlowConstants.passportNumber,
      passportExpiryDate: familtyFlowConstants.passportExpiryDate,
      nationalIqamaId: timestamp,
      dateOfBirth: ownerData.ownerDobG || familtyFlowConstants.dateOfBirth,
      nationality: ownerData.nationality || familtyFlowConstants.nationality,
      relation: "1",
      personAge: ownerData.ownerDobG
        ? getFullAge(ownerData.ownerDobG, "-")
        : familtyFlowConstants.adultAge,
      gender: ownerData.gender ?? "",
      policyCoverage: [],
      type: familtyFlowConstants.TITLES.SELF,
    };
    setOwnerDetailsResponseData(ownerData);
    setPrimaryTravelers([primary]);
  }, []);

  useEffect(() => {
    if (leftStep > 1 && primaryTravelers.length > 0) {
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
              ...persons[index],
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
    leftStep,
    primaryTravelers.length && primaryTravelers[0].personAge,
    childCount,
    adultCount,
    srCitizenCount,
  ]);

  useEffect(() => {
    if(!resumeJourney && !journeyData && propsData?.ownerId)
      redisKey();
  }, [resumeJourney, journeyData, redisKey, propsData?.ownerId]);

useEffect(() => {
  setTravelCoverageTypeJourney(travelcoverageTypeCode);  
},[travelcoverageTypeCode]);
  useEffect(() => {
    if (journeyData) {
      const data = JSON.parse(journeyData);
      setTravelCoverageTypeCode(data?.travelcoverageTypeCode);
      setTravelCoverage(data?.travelcoverage);
      setTravelCoverageType(data?.travelcoverageType);
      setTravelCoveragePlan(data?.travelcoveragePlan);
      setworldwideFamilyCPPrice(data?.worldwideFamilyCPPrice ? data?.worldwideFamilyCPPrice : {});
      setworldwideSelfCPPrice(data?.worldwideSelfCPPrice ? data?.worldwideSelfCPPrice : {});
      setworldwideexceptSelfCPPrice(data?.worldwideexceptSelfCPPrice ? data?.worldwideexceptSelfCPPrice : {});
      seteuropeSelfCPPrice(data?.europeSelfCPPrice ? data?.europeSelfCPPrice : {});
    }
  }, [journeyData]);

  useEffect(() => {
    if (redisData) {
      setJourneyData(typeof (redisData) === "string" ? redisData : JSON.stringify(redisData));
      if (dataRef.current.checkedLastJourney === false) {
        dataRef.current.checkedLastJourney = true;
        setResumeJourney(true);
      }
    } else {
      setResumeJourney(false);
    }
  }, [redisData, setJourneyData]);

  useEffect(() => {
    setRedisKey(uniqueKey);
  },[uniqueKey]);





useEffect(() => {
  if (isDirectData) {
    navigate &&
       navigate("/product/insurance-payment", {
        state: {
          quoteData: quoteDataResponse ?? null,
          userInfo: propsData,
          productCode: PRODUCTCODE_TRAVEL
        },
      });
    //  setLeftStep(5);
  }
}, [isDirectData, setLeftStep]);
 
const handleClose = () => {
  setShowAlertModal(false);
};
 
const handleBackBtn = () => {
  if(leftStep === 2) {
    setCoverageType(null);
    setRepairTypeSelected(null);
    setTravelStartDate(null);
    setSelectedPeriod(null);
    setIsToggleOn(true);
  }
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
  if (isErrorDirect ) {
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
      case 1:
        return (
          <BuyProductFooter
            classNames={isTravelDetailValid ? "make-btn-payment": "make-btn-payment-active"} 
            languageData={languageData}
            isBackButtonHide={true}
            handleOnClickHandler={handleSelectCoverage}
            isDisabledButton={isTravelDetailValid}
            buttonTitle={ languageData?.select_coverage
                ? languageData?.select_coverage.toString()
                : ""
            }
          />
        );
      case 2: 
        return (
          <BuyProductFooter
            classNames={!isEnableAddTravellerDetails ? "make-btn-payment": "make-btn-payment-active" } 
            languageData={languageData}
            isBackButtonHide={false}
            handleOnClickHandler={() => {
              saveRedisData("multiValue", {
                coverageType,
                travelStartDate: travelStartDate?.toLocaleString(),
                selectedPeriod,
                isToggleOn,
                totalCount,
                adultCount,
                childCount,
                srCitizenCount,
                travelcoverageType,
                travelcoveragePlan,
                travelcoverage,
                ownerDetailsResponseData,
                travelcoverageTypeCode: travelCoverageTypeJourney,
                email,
              }, 3);
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
        )
      case 3: 
        return (
          <BuyProductFooter
            classNames={isAddTravelerValidation ? "make-btn-payment": "make-btn-payment-active" }
            languageData={languageData}
            isBackButtonHide={false}
            handleOnClickHandler={() => {
              saveRedisData("multiValue", {
                coverageType,
                travelStartDate: travelStartDate?.toLocaleString(),
                selectedPeriod,
                isToggleOn,
                totalCount,
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
              }, 4);
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
              classNames={isPaymentButtonDisabled  ? "make-btn-payment": "make-btn-payment-active" }
              languageData={languageData}
              isBackButtonHide={false}
              
              handleOnClickHandler={() => { 
                handleMakePayment();
               
              }}
              isDisabledButton={isPaymentButtonDisabled }
              buttonTitle={
                languageData?.make_payment
                  ? languageData?.make_payment.toString()
                  : ""
              }
              handleBackBtn={handleBackBtn}
            />
           
          );
      default:
        return <></>;
    }
  };
 
  
  useEffect(()=> {
    setIsPaymentButtonDisabled(!(isTermCondition && isValidEmail(email ?? "")));
  },[isTermCondition, email]);
 
  
  useEffect(() => { 
   
    if(selectedPeriod  && travelStartDate  && totalCount===1 &&  isToggleOn === true)
    {
      setIsTravelDetailValid(false);
      
    }
    else 
    if(childCount!==0 && (adultCount===0 && srCitizenCount===0))
      {
       
        setIsTravelDetailValid(true);
      } 
        else if (selectedPeriod && travelStartDate &&  isToggleOn === true && totalCount === 0 )  
        {  
          
          setIsTravelDetailValid(false);
        }
        else if(selectedPeriod  && travelStartDate  && isToggleOn === false && totalCount as number > 1)
        {  
          
          setIsTravelDetailValid(false);
        }
        
        else
        {  
          
          setIsTravelDetailValid(true);
        }  
  }, [selectedPeriod, travelStartDate,isToggleOn,totalCount]);
 
  useEffect(() => {
    if (travelcoverageType && travelcoveragePlan) {
      setIsEnableAddTravellerDetails(true); 
    }
    else
    {
      
      setIsEnableAddTravellerDetails(false);
    }
  },[travelcoverageType,travelcoveragePlan]);

  useEffect(() => {
    if(isAddTravelerValidation && travelcoverageType && travelcoveragePlan)
    {
      setIsEnableTravellReviewQuotation(true);
    }else
    {
      setIsEnableTravellReviewQuotation(true);
    }
   
  },[isAddTravelerValidation,travelcoverageType,travelcoveragePlan]);

  useEffect(() => {
    if (leftStep === 3 || leftStep === 4 || leftStep === 2 ) {
      const queryString = dataRef.current.premiumQueryString;
      const newQuery = {
        primary: {
          count: primaryTravelers.length,
          coverage: primaryTravelers.map((item) =>
            (item?.policyCoverage ?? []).map((val) => val.coverageCode).sort()
          ),
        },
        adult: {
          count: travelers.length,
          coverage: travelers.map((item) =>
            (item?.policyCoverage ?? []).map((val) => val.coverageCode).sort()
          ),
          personAge: travelers.map(
            (item) =>
              item?.personAge ?? defaultTravellerPremiumAPIProps.adult.personAge
          ),
        },
        child: {
          count: travelersChild.length,
          coverage: travelersChild.map((item) =>
            (item?.policyCoverage ?? []).map((val) => val.coverageCode).sort()
          ),
          personAge: travelersChild.map(
            (item) =>
              item?.personAge ?? defaultTravellerPremiumAPIProps.child.personAge
          ),
        },
        senior: {
          count: travelersSrcitizen.length,
          coverage: travelersSrcitizen.map((item) =>
            (item?.policyCoverage ?? []).map((val) => val.coverageCode).sort()
          ),
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
      };
      const newQueryString = JSON.stringify(newQuery);
      if (newQueryString !== queryString && newQuery.validPayload === true) {
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
              passportExpiryDate: item.passportExpiryDate
                ? formatTravelDate(item.passportExpiryDate)
                : riskObj.passportExpiryDate,
              dateOfBirth: item.dateOfBirth
                ? formatTravelDate(item.dateOfBirth)
                : itemProps.dateOfBirth,
              policyCoverage: item.policyCoverage ?? [],
              personAge: item.personAge ?? itemProps.personAge,
              relation: item.relation ?? itemProps.relation,
            };
            policyRisk.push({ ...riskObj, ...item, ...additionalProps });
          });
        };
        if (adultCount as number > 0) {
          const primaryCount =
            primary[0]?.personAge > familtyFlowConstants.adultAge &&
            primary[0]?.personAge <
              familtyFlowConstants.SENIOR_CITIZEN_AGE_CHECK
              ? 1
              : 0;
          let items =
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
        if (childCount as number > 0) {
          const primaryCount =
            primary[0]?.personAge < familtyFlowConstants.adultAge ? 1 : 0;
          let items =
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
        if (srCitizenCount as number > 0) {
          const primaryCount =
            primary[0]?.personAge >
            familtyFlowConstants.SENIOR_CITIZEN_AGE_CHECK
              ? 1
              : 0;
          let items =
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
        if (travellerTypeCode === "1") {
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

  return (
    <div className="quote-container">
      {languageData && (
        <ResumeJourney
          show={resumeJourney}
          onContinue={handleOnContinueJourney}
          onNew={handleNewQuotation}
          languageData={languageData}
          setLeftStep={setLeftStep}
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
                  otp_validity_expired_msg: languageData?.otp_validity_expired_msg
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
            <ValidateTravel
              travelData={languageData}
              setLeftStep={setLeftStep}
            />
          ) : leftStep === 2 ? (
            <TravelCoveragePlan
              TravelData={languageData}
              setStepValue={setStepValue}
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
