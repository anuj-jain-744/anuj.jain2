import React, { FC, useEffect, useState } from "react";
import { LanguageData } from "types/languageData";
import { BackFooter } from "components/index";
import { useApiCall, getAmountText, capitalizeNameFirstLetter } from "@dpm/shared-module";
import { deepCopy, ucFirstAllWords } from "utils/quoteAndBuy";
import { LoaderOverlay } from "components/OTPValidation";
import { apiRoutes, JAVA_API_ROUTES, PORTAL , PaymentUrl, PRODUCTCODE_HOME} from "constant";
import PolicyInfoLeft from "./PolicyInfoLeft";
import PolicyInfoRight from "./PolicyInfoRight";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import { PolicyEndorsementDetails, PolicyInterestUpdate, EndorsmentPolicyRisk } from "types/endorsement";

interface PolicyCardProps {
  languageData: LanguageData;
  navigateTo: (url: string) => void;
  policyData: { policyNo: string, mobileNo: string };
}

const PolicyContainer: FC<PolicyCardProps> = ({ policyData, languageData, navigateTo }) => {
  const { policyNo, mobileNo } = policyData
  const [policyDetails, setPolicyDetails] = useState<PolicyEndorsementDetails>({
    selectedPolicyNumber: null,
    viewPolicy: null,
    orderSummary: null,
    benefitsClaimed: [],
    loading: false,
    isBenefitLoaded: null,
    requestPaymentData: null,
    isTermCondition: false,
    endorsementNo: null,
    purchasedBenefits: null
  });

  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);

  // initialise the redis call to save all endorsement data once getting in payment success page
  const { makeApiCall: redisCall, data: getRedisData  } = useApiCall(6, JAVA_API_ROUTES?.redisSetValue, "post");

  // initialise the view policy API call
  const {
    makeApiCall,
    data,
  } = useApiCall(10, apiRoutes.homeViewPolicy, "post");

  const ADD = 'Add';
  const UPDATE = 'Update';
  const { selectedPolicyNumber, viewPolicy, benefitsClaimed, loading, isTermCondition } = policyDetails;

  // initialise the endorsement API call
  const {
    makeApiCall: makeClaimAddBenefits,
    data: dataClaimAddBenefits,
  } = useApiCall(10, apiRoutes.homeClaimBenefits, "post");

  // make the request to save in redis cache
  const makePaymentRequest = (data: PolicyInterestUpdate) => {
    const { benefits } = benefitsToEndorsement(data);
    const benefitsList = [];
    for (const element of benefits) {
      const label = languageData?.coverage_beneits?.filter((value: { coverageCode: string }) => (value?.coverageCode === element?.coverageCode));
      const item = {
        benefitCategory: element?.benefitCategory,
        benefitCode: element?.coverageCode,
        benefitNameAr: label[0]?.coverageName,
        benefitNameEn: label[0]?.coverageName,
        benefitPrice: element?.premiumInfo?.finalPremium,
        effectiveDate: data?.policyEffectiveDate,
        expiryDate: data?.policyExpiryDate,
        vatAmount: data?.vatAmount,
        isSelected: true
      }
      benefitsList.push(item)
    }
    return {
      policyNo: policyNo,
      nationalId: viewPolicy?.policyCustomer[0]?.nationalId,
      coverageName: ucFirstAllWords(viewPolicy?.policyLob[0]?.planCode),
      mobileNumber: viewPolicy?.policyCustomer[0]?.mobile,
      email: viewPolicy?.policyCustomer[0]?.email,
      customerNameAr: (viewPolicy?.policyCustomer[0]?.insurerNameArabic ?? ""),
      customerNameEn: capitalizeNameFirstLetter(viewPolicy?.policyCustomer[0]?.insurerName ?? ""),
      endoEffectiveDate: data?.endoEffectiveDate,
      benefitsPremiumData: benefitsList,
      subtotal: getAmountText(Number(data?.taxableAmount) + Number(data?.feeAmount)),
      vatAmount: getAmountText(data?.vatAmount),
      totalAmount: getAmountText(data?.totalAmount),
      adminFees: getAmountText(data?.feeAmount)
    }
  }

  /** 
    Check the benefits which is purchased or not, 
    if purchased, then stored in the local state when called the API at intially 
  **/

  const benefitsToEndorsement = (data: EndorsmentPolicyRisk[]) => {
    let purchasedBenefits = policyDetails?.purchasedBenefits;
    const policyCoverage = data?.policyRisk[0]?.policyCoverage;
    if (!purchasedBenefits) {
      // stored the puchased benefits data in local state when API call at first time
      purchasedBenefits = policyCoverage.slice(0, policyCoverage.length - 1);
    }
    const newlyAddedbenefits = [];
    for (const element in policyCoverage) {
      const endorsementData = policyCoverage[element];
      const isPurchased = purchasedBenefits.findIndex((value) => endorsementData?.coverageCode === value?.coverageCode);
      // check the benefits has purchased or not in endorsement API
      if (isPurchased === -1) {
        newlyAddedbenefits.push(endorsementData);
      }
    }
    return {
      benefits: newlyAddedbenefits,
      purchasedBenefits: purchasedBenefits
    };
  }

  useEffect(() => { // once getting success call of redis API this effect will trigger
    if (getRedisData) {
      const encryptedQuoteNumber = btoa(`${policyDetails?.endorsementNo}_${PRODUCTCODE_HOME}`);
      navigateTo && navigateTo(PaymentUrl + encryptedQuoteNumber);
    }
  }, [getRedisData, navigateTo]);

  useEffect(() => { // once getting success call of claim add benefits API this effect will trigger
    if (dataClaimAddBenefits) {
      const data = dataClaimAddBenefits?.model;
      const { benefits, purchasedBenefits } = benefitsToEndorsement(data);
      const orderSummary = {
        policyBenefits: benefits,
        adminFeeAmount: data?.feeAmount,
        subtotal: getAmountText(data?.taxableAmount),
        vatAmount: getAmountText(data?.vatAmount),
        netPremium: getAmountText(data?.totalAmount)
      };

      const requestPaymentData = makePaymentRequest(data);

      setPolicyDetails((prevValue) => ({
        ...prevValue,
        orderSummary: benefits.length > 0 && orderSummary,
        requestPaymentData: requestPaymentData,
        isBenefitLoaded: null,
        endorsementNo: data?.endoRequestReferenceNo,
        purchasedBenefits
      }));
    }
  }, [dataClaimAddBenefits]);

  useEffect(() => { // once getting success call of view policy API this effect will trigger
    if (data) {
      setPolicyDetails((prevValue) => ({
        ...prevValue,
        viewPolicy: data,
        loading: false
      }));
    }
  }, [data]);

  // select the policy number for endorsement 
  useEffect(() => {
    if (policyNo) {
      const viewPolicyData = {
        apiSource: PORTAL,
        policyNo: policyNo,
        endorsementNo: "",
        isLatestSnapshot: "Y" //if set "Y" menans latest detail of the policy including any changes made in the policy 
      }
      setPolicyDetails((prevValue) => ({
        ...prevValue,
        selectedPolicyNumber: policyNo,
        loading: true
      }));
      makeApiCall(viewPolicyData)
    }
  }, [policyNo]);

  // check the benefits to add or not for endorsement under the policy
  const checkBenefitsToAdd = (code: string) => {
    const action = ADD;
    const addedBenefitsInClaim = deepCopy(benefitsClaimed);
    const isBenefitAdded = addedBenefitsInClaim?.findIndex((item: {coverageCode: string}) => (item?.coverageCode === code));
    if (isBenefitAdded !== -1) {
      addedBenefitsInClaim?.splice(isBenefitAdded, 1);
    } else {
      const newItem = {
          coverageCode: code,
          action: action
     };
      addedBenefitsInClaim?.push(newItem);
    }
    return addedBenefitsInClaim;
  }

  // add the benefits to claim for selected policy
  const handleSelectAddBenefits = (code: string, isPurchasedBenefit: number) => () => {
    const addedBenefitsInClaim = checkBenefitsToAdd(code, isPurchasedBenefit);
    const addBenefitsRequestData = {
      policyNo: selectedPolicyNumber,
      endoEffectiveDate: viewPolicy?.policyBasic?.effectiveDate,
      apiSource: "Portal",
      policyLob: [
        {
          policyRisk: [
            {
              policyCoverage: addedBenefitsInClaim,
              action: UPDATE,
              riskId: viewPolicy?.policyLob[0]?.policyRisk[0]?.riskId
            }
          ]
        }
      ]
    }
    setPolicyDetails((prevValue) => ({
      ...prevValue,
      benefitsClaimed: addedBenefitsInClaim,
      isBenefitLoaded: code
    }));
    makeClaimAddBenefits(addBenefitsRequestData);
  }

  const setIsTermCondition = (data: boolean) => {
    setPolicyDetails((prevValue) => ({
      ...prevValue,
      isTermCondition: data
    }));
  }

  const isPaymentDisabled = () => {
    return isTermCondition && benefitsClaimed.length;
  }

  const handleClickPayment = () => {
    setCallGenerateOtp(true);
  }

  return (
    <div className="home-claim-details">
      {loading && <LoaderOverlay />}
      <OTPWrapper
        generateOtpUrl={"GenerateOtp"}
        validateOtpUrl={"ValidateOtp"}
        languageData={{
          enter_otp_code: languageData?.enter_otp_code,
          your_otp_will_expire: languageData?.your_otp_will_expire,
          confirm_otp: languageData?.confirm_otp,
          resend_otp: languageData?.resend_otp,
        }}
        handleSuccessValidation={async () => {
          setCallGenerateOtp(false);
          redisCall({ key: policyDetails?.endorsementNo, value: JSON.stringify(policyDetails?.requestPaymentData) });
        }}
        payload={{
          mobileNumber: mobileNo,
        }}
        callGenerateOtp={callGenerateOtp}
        setCallGenerateOtp={setCallGenerateOtp}
      />
      <PolicyInfoLeft
        languageData={languageData}
        policyDetails={policyDetails}
        handleSelectAddBenefits={handleSelectAddBenefits}
        setIsTermCondition={setIsTermCondition}
      />
      {viewPolicy ? <PolicyInfoRight
        languageData={languageData}
        policyDetails={policyDetails}
      /> : ""}
      <div className="payment-footer">
        <BackFooter
          disableLinkButton={!isPaymentDisabled()}
          stepValue={0}
          isQuoteAndBuy={true}
          languageData={{ "step0": languageData?.proceed_for_payment }}
          handleBackClick={navigateTo}
          handleLinkClick={handleClickPayment}
        /></div>
    </div>
  );
};

export default PolicyContainer;