import { FC, useEffect, useState } from "react";
import { LanguageData } from "types/languageData";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import { LoaderOverlay } from "@app-shell/components/Loader";
import { useCommonContext, useApiCall } from "@dpm/shared-module";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import { AlertBox } from "components/AlertBox";
import { apiRoutes, PORTAL, commonKeywords } from "constant";
import RegisterClaimLeft from "./RegsiterClaimLeft";
import RegisterClaimRight from "./RegisterClaimRight";
import { Value } from "react-multi-date-picker";
import { apiFormatDate, formatDate } from "utils/formatDate";
import { displayHouseAddress } from "utils/quoteAndBuy";
import homePayload from "./Homepayload";
import Success from "Motor/SuccessPage";
import PanelRight from "components/PanelRight";

interface PolicyClaimData {
  selectedPolicyNumber: string | null;
  viewPolicy: ViewPolicy | null;
  nonMotorFNOL: {claimInfo: {policyNumber: string}} | null;
  claimFNOLError: string | null;
  loading: boolean;
  isTermCondition: boolean;
  causeOfLossOptions: { id: number | string; description: string }[];
  estimatedValues: [];
  totalEstimatedAmount: number;
}

interface PolicyCardProps {
  languageData: LanguageData;
  backBtnClickHandler: () => void;
  claimData: { policyList: [] };
  isPolicyCardSelected: boolean;
  policies: {policyNo: string};
  handleNavigate: (url: string) => void;
}

interface ApiError {
  title: string;
  description: string;
}

const RegisterClaim: FC<PolicyCardProps> = ({ claimData, languageData, backBtnClickHandler, isPolicyCardSelected, policies, handleNavigate }) => {
  const [policyClaim, setPolicyClaim] = useState<PolicyClaimData>({
    selectedPolicyNumber: null,
    viewPolicy: null,
    nonMotorFNOL: null,
    claimFNOLError: null,
    loading: false,
    isTermCondition: false,
    causeOfLossOptions: [],
    estimatedValues: []
  });
  const [apiErrorMessage, setApiErrorMessage] = useState<ApiError>({
    title: "",
    description: "",
  });
  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  //Contact details state start from here
  const [isIbanNumValue, setIbannumValue] = useState<string | undefined>("");
  const [isIbanValid, setIbanValid] = useState<boolean>(false);
  const [isbankValid, setbankValid] = useState<boolean>(false)
  const [isIbanBankName, setIbanBankName] = useState<string | undefined>("");
  //uploaded files data
  const [fileData, setFileData] = useState<
    { name: string; fileName: string; fileExtension: string; size: number; base64: string; docFile: string }[]
  >([]);
  //ibandocuments files data
  const [iBanFileData, setIBanFileData] = useState<
    { name: string; fileName: string; fileExtension: string; size: number; base64: string; docFile: string }[]
  >([]);
  const [isMobNumValid, setMobNumValid] = useState<boolean>(false);
  const [mobilenumData, setMobilenumData] = useState<string | undefined>("");
  const [isEmailValid, setEmailValid] = useState<boolean>(false);
  const [emailData, setEmailData] = useState<string | undefined>("");
  //Contact details state ends  here
  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);
  // Validate fields on the contact details page
  const [isValid, setIsValid] = useState<boolean>(false);
  const [successClaimData, setSuccessClaimData] = useState(null);

  useEffect(() => {
    if (isIbanValid && isbankValid && isMobNumValid) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [isIbanValid, isbankValid, isMobNumValid])
  const {
    makeApiCall,
    data,
  } = useApiCall(10, apiRoutes.homeViewPolicy, "post");

  // initialise the NonMotorFNOL API call
  const {
    makeApiCall: makeNonMotorFNOL,
    data: nonMotorFNOLData,
    errors: nonMotorFNOLError,
  } = useApiCall(5, apiRoutes.homeNonMotorFNOL, "post");

  const {
    makeApiCall: nonMotorRegistration,
    data: nonMotorRegistrationData,
    errors: nonMotorRegistrationError,
  } = useApiCall(5, apiRoutes.nonMotorRegistration, "post");


  const { selectedPolicyNumber, viewPolicy, loading, isTermCondition, nonMotorFNOL, estimatedValues, totalEstimatedAmount, claimFNOLError } = policyClaim;

  // store the data for view policy API call success
  useEffect(() => {
    if (data) {
      setPolicyClaim((prevValue) => ({
        ...prevValue,
        viewPolicy: data,
        claimFNOLError: null,
      }));
    }
  }, [data]);

  // store the data for NonMotorFNOL API call success
  useEffect(() => {
    if (nonMotorFNOLData) {
      const coverageList = nonMotorFNOLData?.subClaimInfo?.coverageInfoList || [];
      const mappedCauseOfLossOptions = coverageList.map((item: any) => ({
        id: item.coverageCode,
        description: item.coverageName,
        siLimit: item.siLimit,
      }));
      setPolicyClaim((prev) => ({
        ...prev,
        nonMotorFNOL: nonMotorFNOLData,
        claimFNOLError: null,
        loading: false,
        causeOfLossOptions: mappedCauseOfLossOptions, // Store here
      }));
    }
  }, [nonMotorFNOLData]);

  // store the data for NonMotorFNOL API call failed
  useEffect(() => {
    if (nonMotorFNOLError) {
      setPolicyClaim((prevValue) => ({
        ...prevValue,
        nonMotorFNOL: null,
        loading: false,
        claimFNOLError: nonMotorFNOLError?.messages?.message_en
      }));
    }
  }, [nonMotorFNOLError]);

  // store the data for NonMotorFNOLRegistartion API call failed
  useEffect(() => {
    if (nonMotorRegistrationError) {
      setApiErrorMessage({
        title: nonMotorRegistrationError?.name ?? languageData?.internal_server_error,
        description: nonMotorRegistrationError?.messages?.message_en ?? languageData?.something_went_wrong,
      });
    }
  }, [nonMotorRegistrationError]);

  // store the data for NonMotorFNOLRegistartion API call success
  useEffect(() => {
    if (nonMotorRegistrationData) {
      const name = currentLanguage === ar ? viewPolicy?.policyCustomer[0]?.customerNameArabic : viewPolicy?.policyCustomer[0]?.customerNameEnglish;
      const address = displayHouseAddress(viewPolicy?.policyLob[0]?.policyRisk[0], currentLanguage, ar);
      const claimData = {
        policyNumber:nonMotorFNOL?.claimInfo?.policyNumber,
        claimNo: nonMotorRegistrationData?.claimInfo?.claimNo,
        productCode: "02",
        policyHolder: name?.trim() ? name?.trim() : nonMotorFNOL?.claimInfo?.policyHolderName,
        dateOfLoss: formatDate(nonMotorFNOL?.claimInfo?.dateOfLoss),
        estimatedClaimAmount: `${languageData?.sar} ${totalEstimatedAmount}`,
        address: address,
        languageData: {
          estimatedClaimAmount: languageData?.estimated_Claim_Amount,
        }
      }
      setSuccessClaimData(claimData);
    }
  }, [nonMotorRegistrationData])

  // select the policynumber to claim the process 
  const handleSelectPolicyNumber = (selectedPolicyNumber: string) => {
    const viewPolicyData = {
      apiSource: PORTAL,
      policyNo: selectedPolicyNumber,
      endorsementNo: "",
      isLatestSnapshot: "Y"
    }
    setPolicyClaim((prevValue) => ({
      ...prevValue,
      selectedPolicyNumber: selectedPolicyNumber,
      loading: true
    }));
    makeApiCall(viewPolicyData)
  }

  // set the terms and condition is true to enable the payment button 
  const setIsTermCondition = (data: boolean) => {
    setPolicyClaim((prevValue) => ({
      ...prevValue,
      isTermCondition: data
    }));
  }
  const contactDetialschangeHandler = (
    name: string,
    isIBAN: boolean,
    value?: string,
    bankName?: string,
    fileData?: {
      docType: string;
      fileName: string;
      fileExtension: string;
      docFile: string;
    }[]
  ) => {
    switch (name) {
      case "iBAN":
        setIbanValid(isIBAN);
        isIBAN && setIbannumValue(value);
        bankName && setIbanBankName(bankName);
        bankName && setbankValid(true)
        fileData &&
          setFileData(
            fileData as unknown as {
              name: string;
              fileName: string;
              fileExtension: string;
              size: number;
              base64: string;
              docFile: string;
            }[]
          );
        // updating to iBanFileData
        fileData && setIBanFileData(fileData as unknown as {
          name: string;
          fileName: string;
          fileExtension: string;
          size: number;
          base64: string;
          docFile: string;
        }[]
        )
        break;
      case "mobilenum":
        setMobNumValid(isIBAN);
        setMobilenumData(value);
        break;
      case "emailId":
        setEmailValid(isIBAN);
        setEmailData(value);
        break;
    }
  };
  const isPaymentDisabled = () => {
    return isValid && nonMotorFNOL && isTermCondition && estimatedValues.length  
  }
  const handleSuccessValidation = () => {
    const coverageList = nonMotorFNOL?.subClaimInfo?.coverageInfoList || [];
    let totalEstimatedAmount: number = 0;
    const claimDocuments = [];
    for (const item in coverageList) {
      const data = coverageList[item];
      const isEstimated = estimatedValues.findIndex((value => Number(data.coverageCode) === Number(value.causeOfLossId)));
      if (isEstimated !== -1) {
        const estimatedData = estimatedValues[isEstimated];
        const amount = Number(estimatedData.estimateAmount);
        coverageList[item] = {
          ...coverageList[item],
          initialReserve: amount,
          isSelect: 1
        }
        claimDocuments.push(estimatedData?.documents);
        totalEstimatedAmount = totalEstimatedAmount + amount;
      }
    }

    setPolicyClaim((prevValue) => ({
      ...prevValue,
      totalEstimatedAmount,
      loading: true
    }));
    const contactInfo = {
      mobilenumData, emailData
    };

    const payload = homePayload(nonMotorFNOL, contactInfo, iBanFileData, isIbanNumValue, isIbanBankName, coverageList, claimDocuments);
    nonMotorRegistration(payload);
  }
  // handled the submit action to process the OTP generation process
  const handleClickPayment = () => {
    /*payload creation for register claim*/
    setCallGenerateOtp(true);
  }


  // call the NonMotorFNOL API call by data request of (dataloss and policy number)
  const handleRequestClaims = (dateOfLoss: Value) => {
    setPolicyClaim((prevValue) => ({
      ...prevValue,
      loading: true
    }));
    makeNonMotorFNOL({
      dateOfLoss: apiFormatDate(formatDate(dateOfLoss), '/'), //"2025-04-21"
      policyNumber: selectedPolicyNumber
    })
  }

  const handleClose = () => {
    setApiErrorMessage({
      title: "",
      description: "",
    });
  };

  // check the estimated values added or not
  const handleAddEstimateValues = (data: []) => {
    const isDataEstimated = data.length === 0 || data.every((estimate: {estimateAmount: number}) => Number(estimate.estimateAmount) > 0);
    setPolicyClaim((prevValue) => ({
      ...prevValue,
      estimatedValues: isDataEstimated && data || [],
    }));
  }

  return (
    <>{
      successClaimData ?
        <Success
          status
          data={null}
          claimData={successClaimData}
          handleNavigate={handleNavigate}
        />
        :
        <div className="home-claim-register-details">
          {loading && <LoaderOverlay />}
          <AlertBox
            title={apiErrorMessage.title}
            description={apiErrorMessage.description}
            showAlertModal={Boolean(apiErrorMessage.title && apiErrorMessage.description)}
            setShowAlertModal={handleClose}
          />
          {mobilenumData && (<OTPWrapper
            generateOtpUrl={"GenerateOtp"}
            validateOtpUrl={"ValidateOtp"}
            languageData={{
              enter_otp_code: languageData?.enter_otp_code,
              your_otp_will_expire: languageData?.your_otp_will_expire,
              confirm_otp: languageData?.confirm_otp,
              resend_otp: languageData?.resend_otp,
            }}
            handleSuccessValidation={async () => {
              setCallGenerateOtp(false)
              //prepare payload make an api call to register claim
              handleSuccessValidation()
            }}
            payload={{
              mobileNumber: mobilenumData ??  viewPolicy?.policyCustomer[0]?.mobile,
            }}
            callGenerateOtp={callGenerateOtp}
            setCallGenerateOtp={setCallGenerateOtp}
          />)}
          <RegisterClaimLeft
            languageData={languageData}
            claimData={claimData}
            policyClaim={policyClaim}
            handleSelectPolicyNumber={handleSelectPolicyNumber}
            setIsTermCondition={setIsTermCondition}
            contactDetialschangeHandler={contactDetialschangeHandler}
            handleRequestClaims={handleRequestClaims}
            addEstimateValues={handleAddEstimateValues}
            isPolicyCardSelected={isPolicyCardSelected}
            policies={policies}
            claimFNOLError={claimFNOLError}
            nonMotorFNOL={nonMotorFNOL}
/>
           {viewPolicy ? (
              <PanelRight>
              <RegisterClaimRight
                languageData={languageData}
                viewPolicy={viewPolicy}
              />
              </PanelRight>
            ) : null} {/* Render nothing when viewPolicy is false */}
          <div className="register-new-claim-container-footer-main">
            <div className="footer">
              <div className="footer-btns walaa-medium-500">
                <ThemeButton
                  classes={"back-btn"}
                  isDisabled={false}
                  title="Back"
                  variant="link"
                  icon={true}
                  iconName="ChevronLeftIcon"
                  onClickhandler={backBtnClickHandler}
                />
                <ThemeButton
                  isDisabled={!isPaymentDisabled()}
                  classes={"submit-btn button-link"}
                  title={languageData?.submit}
                  variant="link"
                  icon={false}
                  iconRight={true}
                  iconName="ChevronRightIcon"
                  onClickhandler={handleClickPayment}
                />
              </div>
            </div>
          </div>
        </div>
    }</>
  );
};

export default RegisterClaim;