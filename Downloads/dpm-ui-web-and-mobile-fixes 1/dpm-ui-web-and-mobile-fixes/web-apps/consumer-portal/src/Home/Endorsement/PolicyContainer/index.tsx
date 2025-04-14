import React, { FC, useEffect, useState } from "react";
import { LanguageData } from "types/languageData";
import { BackFooter } from "components/index";
import { useApiCall } from "@dpm/shared-module";
import { deepCopy } from "utils/quoteAndBuy";
import { LoaderOverlay } from "components/OTPValidation";
import { apiRoutes, JAVA_API_ROUTES, HOME_APISOURCE } from "constant";
import PolicyInfoLeft from "./PolicyInfoLeft";
import PolicyInfoRight from "./PolicyInfoRight";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import { PolicyEndorsementDetails, PolicyInterestUpdate } from "types/endorsement";
import Success from "Motor/SuccessPage";

interface PolicyCardProps {
  languageData: LanguageData;
  navigateTo: () => void;
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
    endorsementNo: null
  });

  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);

  const { makeApiCall: redisCall } = useApiCall(6, JAVA_API_ROUTES?.redisSetValue, "post");

  const {
    makeApiCall,
    data,
  } = useApiCall(10, apiRoutes.homeViewPolicy, "post");

  const ADD = 'Add';
  const { selectedPolicyNumber, viewPolicy, benefitsClaimed, loading, isTermCondition } = policyDetails;

  const {
    makeApiCall: makeClaimAddBenefits,
    data: dataClaimAddBenefits,
  } = useApiCall(10, apiRoutes.homeClaimBenefits, "post");

  const makePaymentRequest = (data: PolicyInterestUpdate) => {
    const policyCoverage = data?.policyRisk?.slice(1);
    const benefitsList = [];
    for (const policy of policyCoverage) {
      const policyData = policy?.policyCoverage;
      const element = policyData[0];
      const label = languageData?.coverage_beneits?.filter((value: { coveragecode: string }) => (value?.coveragecode === element?.coverageCode));
      const item = {
        benefitCategory: element?.benefitCategory,
        benefitCode: element?.coverageCode,
        benefitNameAr: label[0]?.coveragename,
        benefitNameEn: label[0]?.coveragename,
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
      benefitsPremiumData: benefitsList
    }

  }

  useEffect(() => { // once getting success call of claim add benefits API this effect will trigger
    if (dataClaimAddBenefits) {
      // remove the defaultCoverageCode from the policy risks getting from add benefits endorsement API
      const data = dataClaimAddBenefits?.model;
      const risks = data?.policyRisk?.filter(item => item?.policyCoverage[0]?.coverageCode !== languageData?.defaultCoverageCode);
      const orderSummary = {
        policyBenefits: risks,
        subtotal: data?.taxableAmount?.toFixed(2),
        vatAmount: data?.vatAmount?.toFixed(2),
        netPremium: data?.totalAmount?.toFixed(2)
      };

      const requestPaymentData = makePaymentRequest(data);

      setPolicyDetails((prevValue) => ({
        ...prevValue,
        orderSummary: risks.length > 0 && orderSummary,
        requestPaymentData: requestPaymentData,
        isBenefitLoaded: null,
        endorsementNo: data?.endoRequestReferenceNo
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
        apiSource: 'Portal',
        policyNo: policyNo,
        endorsementNo: "",
        isLatestSnapshot: "N"
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
    const addedBenefitsInClaim = deepCopy(benefitsClaimed);
    const isBenefitAdded = addedBenefitsInClaim?.findIndex((item) => (item?.policyRisk[0]?.policyCoverage[0]?.coverageCode === code));
    if (isBenefitAdded !== -1) {
      addedBenefitsInClaim?.splice(isBenefitAdded, 1);
    } else {
      const newItem = {
        policyRisk: [
          {
            policyCoverage: [{
              coverageCode: code,
              action: ADD
            }],
            action: ADD,
            riskId: viewPolicy?.policyLob[0]?.policyRisk[0]?.riskId
          }
        ]
      };
      addedBenefitsInClaim?.push(newItem);
    }
    return addedBenefitsInClaim;
  }

  // add the benefits to claim for selected policy
  const handleSelectAddBenefits = (code: string) => () => {
    const addedBenefitsInClaim = checkBenefitsToAdd(code);
    const addBenefitsRequestData = {
      policyNo: selectedPolicyNumber,
      endoEffectiveDate: viewPolicy?.policyBasic?.effectiveDate,
      apiSource: "Portal",
      policyLob: addedBenefitsInClaim
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

  if (status) {
    return (<Success languageData={languageData} status="success" data={null} flag={true}/>)
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
          setStatus(true);
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
        languageData={{"step0":languageData?.proceed_for_payment}}
        handleBackClick={navigateTo}
        handleLinkClick={handleClickPayment}
      /></div>
    </div>
  );
};

export default PolicyContainer;