import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderOverlay } from "@app-shell/components/Loader";
import { AlertBox } from "components/AlertBox";
import ErrorComponent from "components/ErrorComponent/Error";
import RegisterClaimLeft from "components/Travel/Claims/Comprehensive/RegisterClaim/RegisterClaimLeft";
import RegisterClaimRight from "components/Travel/Claims/Comprehensive/RegisterClaim/RegisterClaimRight";
import ThemeButton from "components/ThemeComponents/ThemeButton";
import Success from "Motor/SuccessPage";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { toast } from "react-toastify";
import { callAPI, TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";
import { useReviewPolicy } from "Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import { formatTravelDate } from "utils/formatDate";
import { TRAVEL } from "constant";
import { LanguageData } from "types/languageData";

interface PropTypes {
  backBtnClickHandler: () => void;
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
  policies: Array<{ policyNo: string }>;
  profileData: Record<string, string>;
}

const { VITE_BACKEND_UTILITY_URL } = import.meta.env;

const RegisterClaim = ({
  langData,
  backBtnClickHandler,
  policies,
  profileData,
}: PropTypes) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [place, setPlace] = useState<string>("");
  const [dateOfLoss, setDateOfLoss] = useState<string>("");
  const [policyClaimData, setPolicyClaimData] = useState<{
    claimInfo?: object;
    subClaimInfo?: object;
  }>({});
  const [estimations, setEstimations] = useState<Array<Travel.ClaimEstimation>>(
    []
  );
  const [isIbanValid, setIsIbanValid] = useState<boolean>(false);
  const [iBANDetails, setIBANDetails] = useState<Travel.IBANDetails>({
    additionalRemark: "",
    bankName: "",
    emaiId: "",
    iBAN: "",
    iBANFiles: [],
    mobile: "",
  });
  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<string>(
    policies.length === 1 ? policies[0].policyNo : ""
  );
  const [isSuccessClaim, setIsSuccessClaim] = useState(false);
  const [successClaimData, setSuccessClaimData] = useState<
    Record<string, string>
  >({});
  const [showCards, setShowCards] = useState<boolean>(!selectedPolicyNumber);
  const navigate = useNavigate();
  // get data of the selected policy
  const {
    makeApiCall: getPolicyData,
    error: policyError,
    data: policyRes,
    isLoading: isPolicyLoading,
  } = useReviewPolicy({
    PolicyNo: selectedPolicyNumber,
    Product: TRAVEL,
  });
  // get the validation result of estimations
  const isValidEstimation: boolean = useMemo(() =>
      estimations.length > 0 &&
      estimations.every(
        (item) =>
          item.codeId &&
          parseFloat(item.amount.toString()) > 0 &&
          item.names.length > 0 &&
          item.files.length > 0 &&
          !item.isLimitExceeded &&
          item.files.every((val) => val.name && val.base64 !== "")
      ),
    [estimations]
  );
  // get formatted data
  const policyData = usePolicyData(policyRes, TRAVEL);
  const travelerNames: Array<string> = useMemo(() => {
    return (
      policyData.planDetails?.policyRisk?.map(
        (item) => item.travellerNameEnglish ?? ""
      ) ?? []
    );
  }, [policyData]);

  const validationValue = {
    email: policyRes?.policyLob?.[0]?.policyRisk?.[0]?.email,
    iban: policyRes?.policyCustomer[0].iban,
  };

  const handleContactChange = (name: string, value: boolean) => {
    if (name === "iBAN") setIsIbanValid(value);
  };

  useEffect(() => {
    setPlace("");
    setEstimations([]);
    setIsIbanValid(false);
    setIBANDetails({
      additionalRemark: "",
      bankName: "",
      emaiId: "",
      iBAN: "",
      iBANFiles: [],
      mobile: "",
    });
    setIsTermsChecked(false);
    if (selectedPolicyNumber) getPolicyData(selectedPolicyNumber);
  }, [selectedPolicyNumber]);

  const getPolicyClaimData = async () => {
    setLoader(true);
    setPolicyClaimData({});
    try {
      const payload = {
        dateOfLoss: formatTravelDate(dateOfLoss),
        policyNumber: selectedPolicyNumber,
      };

      const response = await callAPI(
        "post",
        VITE_BACKEND_UTILITY_URL + `NonMotor/FNOL/NonMotorFNOL`,
        payload
      );
      if (
        response?.message?.toUpperCase() === "SUCCESS" ||
        response?.data?.result?.toUpperCase() === "MATCH"
      ) {
        setPolicyClaimData(response.data ?? {});
      } else if (
        response?.message?.toUpperCase() === "ERROR" ||
        response?.message?.toUpperCase() === "INTERNAL_SERVER_ERROR"
      ) {
        setEstimations([]);
        toast.error(response?.errors[0]?.messages?.message_en, {
          icon: <WarningAmberOutlinedIcon />,
          autoClose:
            parseInt(langData.product.toaster_timeout) || TOAST_AUTOCLOSE_TIMER || false,
        });
      }
    } catch (error) {
      setEstimations([]);
      toast.error(error?.message ?? "", {
        icon: <WarningAmberOutlinedIcon />,
        autoClose: parseInt(langData.product.toaster_timeout) || TOAST_AUTOCLOSE_TIMER || false,
      });
    } finally {
      setLoader(false);
    }
  };

  const submitRegisterClaim = async () => {
    setLoader(true);
    const docFiles: Travel.DocFilesAPIData = [];
    const selectedCoverages: Travel.ClaimCoverageValues = [];
    const damageObjects = new Set<number>();
    let desc = "";
    let totalEstimatedAmount = 0;
    for (const item of estimations) {
      const amount = parseFloat(item.amount.toString()) || 0;
      totalEstimatedAmount += amount;
      if (item.desc)
        desc += desc === "" ? item.desc : `lossDescription:${item.desc}`;
      for (const val of item.names)
        if (val.checked === true) damageObjects.add(val.id);
      for (const val of item.files)
        docFiles.push({ docFile: val.base64, fileName: val.name });
      selectedCoverages.push({
        ...item.cause.coverageInfo,
        initialReserve: amount,
        isSelect: "1",
      });
    }

    const claimsData = {
      ...policyClaimData.claimInfo,
      accidentAddress: place,
      contactTelephone: policyData?.policyCard?.mobileNo,
      dateOfLoss: formatTravelDate(dateOfLoss),
      lossDescription: desc || " ",
    };
    const subClaimInfo = {
      ...policyClaimData.subClaimInfo,
      damageObject: travelerNames
        .filter((_item, index) => damageObjects.has(index))
        .join(","),
      coverageInfoList: selectedCoverages,
      iBAN: iBANDetails.iBAN,
      bankName: iBANDetails.bankName,
      mobile: iBANDetails.mobile,
      email: iBANDetails.emaiId,
      documents: docFiles,
    };
    if (iBANDetails.bankName) {
      for (const item of iBANDetails.iBANFiles) {
        if (item instanceof Object && item.docFile && item.fileName)
          docFiles.push({ docFile: item.docFile, fileName: item.fileName });
      }
    }

    const payload = {
      claimInfo: { ...claimsData },
      subClaimInfo: { ...subClaimInfo },
    };
    try {
      const response = await callAPI(
        "post",
        VITE_BACKEND_UTILITY_URL + `NonMotor/FNOL/nonMotorRegistration`,
        payload
      );
      if (
        response?.message?.toUpperCase() === "SUCCESS" ||
        response?.data?.result?.toUpperCase() === "MATCH"
      ) {
        setIsSuccessClaim(true);
        const claimData = {
          claimNo: claimsData.claimNo,
          estimatedClaimAmount: totalEstimatedAmount,
          dateOfLoss: dateOfLoss,
          policyHolder: claimsData.policyHolderName,
          policyNumber: claimsData.policyNumber,
          productCode: TRAVEL,
          claimsInfo: {
            ownerId: claimsData.policyHolderId,
          },
        };
        setSuccessClaimData(claimData);
      } else if (
        response?.message?.toUpperCase() === "ERROR" ||
        response?.message?.toUpperCase() === "INTERNAL_SERVER_ERROR"
      ) {
        toast.error(response?.errors[0]?.messages?.message_en, {
          icon: <WarningAmberOutlinedIcon />,
          autoClose:
            parseInt(langData.product.toaster_timeout) || TOAST_AUTOCLOSE_TIMER || false,
        });
      }
    } catch (error) {
      console.error(
        "Register New Claim Register Submit failed with error",
        error
      );
      toast.error("Register New Claim Register Submit failed with error", {
        icon: <WarningAmberOutlinedIcon />,
        autoClose: parseInt(langData.product.toaster_timeout) || TOAST_AUTOCLOSE_TIMER || false,
      });
    } finally {
      setLoader(false);
    }
  };

  if (policyError) {
    return <ErrorComponent />;
  }

  const handleContinueBtn = () => {
    const selectedPolicyDetails = policies.find((item) => item.policyNo === selectedPolicyNumber);

    //If policy is expired it should show a popup message as 'Your policy is not active, you can't raise the claim' 
    const today = new Date();
    const add28Days = 28 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date(selectedPolicyDetails?.expiryDate);
    const expiryPlus28 = new Date(
      expiryDate.getTime() + add28Days
    );

    if(today >= expiryPlus28){
      setShowAlert(true)
    } else {
      setShowCards(false)
    } 
  }

  const handleBackButton = () => {
    (selectedPolicyNumber && policies.length !== 1) ? (setShowCards(true), setSelectedPolicyNumber("")) : 
    backBtnClickHandler();
  }

  return (
    <>
      {(isPolicyLoading || loader) && <LoaderOverlay />}
      <AlertBox
        title={''}
        description={langData?.product?.can_not_raise_claim}
        showAlertModal={showAlert}
        setShowAlertModal={() => setShowAlert(false)}
      />
      {isSuccessClaim ? (
        <Success
          status
          flag
          claimData={successClaimData}
          data={{
            policyNumber : selectedPolicyNumber,
            refundValue : ''
          }}
          handleNavigate={navigate}
        />
      ) : (
        <div className="register-new-claim-comprehensive">
          <div
            className="register-new-claim-container-main p-0 select-policy"
            data-testid="registerclaim-test"
          >
            <div className="register-new-claim-left-card-main d-flex flex-column max-height">
              <RegisterClaimLeft
                handlePolicySelect={setSelectedPolicyNumber}
                policyNumber={selectedPolicyNumber}
                langData={langData}
                profileData={profileData}
                policies={policies}
                travelerNames={travelerNames}
                policyData={policyData}
                // Adding this for calling API call FNOL/NonMotorFNOL
                handleLossApi={getPolicyClaimData}
                place={place}
                handlePlace={setPlace}
                dateOfLoss={dateOfLoss}
                handleDateOfLoss={setDateOfLoss}
                contactDetchangeHandler={handleContactChange}
                estimations={estimations}
                handleEstimations={setEstimations}
                isValidEstimation={isValidEstimation}
                handleIbanDetails={setIBANDetails}
                isTermsChecked={isTermsChecked}
                handleTerms={setIsTermsChecked}
                mobilenumData={
                  policyRes?.policyLob?.[0]?.policyRisk?.[0]?.mobileNumber
                }
                validationData={validationValue}
                coverageInfoList={
                  policyClaimData.subClaimInfo?.coverageInfoList ?? []
                }
                showCards={showCards}
              />
            </div>
            {/* right content */}
            <RegisterClaimRight
              policyNumber={selectedPolicyNumber}
              langData={langData.consumer}
              policyData={policyData}
            />
          </div>
          <div className="register-new-claim-container-footer-main">
            <div className="footer">
              <div className="footer-btns walaa-medium-500">
                <div>
                  <ThemeButton
                    classes={"back-btn"}
                    isDisabled={false}
                    title={langData.consumer.back}
                    variant="link"
                    icon={true}
                    iconName="ChevronLeftIcon"
                    onClickhandler={handleBackButton}
                  />
                </div>
                <div>
                {showCards ?  <ThemeButton
                    classes={selectedPolicyNumber                     
                        ? "payment-btn register-enabled"
                        : "payment-btn register-disabled"
                    }
                    isDisabled = {!selectedPolicyNumber}
                    title={langData?.product?.continue}
                    variant="link"
                    icon={false}
                    iconRight={true}
                    iconName="ChevronRightIcon"
                    onClickhandler={handleContinueBtn}
                  /> : <ThemeButton
                  classes={
                    isIbanValid && isTermsChecked && isValidEstimation
                      ? "payment-btn register-enabled"
                      : "payment-btn register-disabled"
                  }
                  isDisabled={
                    !(isIbanValid && isTermsChecked && isValidEstimation)
                  }
                  title={langData.consumer.submit}
                  variant="link"
                  icon={false}
                  iconRight={true}
                  iconName="ChevronRightIcon"
                  onClickhandler={submitRegisterClaim}
                />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterClaim;
