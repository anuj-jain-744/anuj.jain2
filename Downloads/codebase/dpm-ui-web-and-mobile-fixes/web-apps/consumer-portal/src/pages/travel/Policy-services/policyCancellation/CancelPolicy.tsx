import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./CancelPolicy.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Info from "assets/CancelPolicy/Info.svg";
import ThemeDropdown from "./sharedComponent/ThemeDropdown";
import ThemeButton from "./sharedComponent/ThemeButton";
import ThemeTextbox from "./sharedComponent/ThemeTextbox";
import { RootState } from "@dpm/shared-module";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { LoaderOverlay } from "@app-shell/components/Loader";
import { AlertBox } from "components/AlertBox";
import { Card, Modal } from "react-bootstrap";
import PolicyCard from "./sharedComponent/PolicyCard";
import { useCancelPolicy } from "./hook/useCancelPolicy";
import { useCancelRefund } from "./hook/useCancelRefund";
import { useValidateIban } from "./hook/useValidateIban";
import { callAPI, validateIBAN, validateIbanNonSA } from "@dpm/shared-module";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import TermsAndCon from "claims/register/compensation/TermsAndCon";
import { formatDate } from "utils/formatDate";
import { useReviewPolicy } from "Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import usePolicyData from "./hook/usePolicyData";
import Iban from "components/Iban/iban";
import SeniorCitizenAlert from "components/QuoteAndBuy/ValidateTravel/SeniorCitizenAlert";
import {
  SA,
  ibanLength,
  TRAVEL_POLICY_TYPE,
  TRAVEL_TYPE,
  Home_POLICY_TYPE,
  HOME,
  TRAVEL,
  cancelPolicyIndex,
} from "constant";
import { useTravelPolicyContext } from "components/hooks/useTravelPolicyContext";
import { QuoteAndBuyProvider } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { PHQuoteBuyProvider } from "../../../../context/PHQuoteBuyContext";
import TravelSucces from "components/TravelSucces";
import { TravelData, LanguageData } from "types/languageData"; // LanguageData,
import { useApiCall } from "@dpm/shared-module";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
interface FileData {
  docType: string;
  fileName: string;
  fileExtension: string;
  docFile: string;
}
interface CancelPolicyProps {
  policyDataObj: any;
  navigateTo: (path: string) => void;
}
interface TravelAPIResponse {
  config: TravelData;
}
interface CancelPolicyDataModel {
  policyNo: string;
  endoNo: string;
}

interface CancelPolicyData {
  model: CancelPolicyDataModel;
}
function CancelPolicy({
  policyDataObj,
  navigateTo,
}: Readonly<CancelPolicyProps>) {
  const [travelData, setTravelData] = useState<TravelData>();

  const { data: cmsData, makeApiCall: cmsCall } = useApiCall<
    TravelAPIResponse,
    undefined
  >(1, "travel-config", "get");
  useEffect(() => {
    cmsCall();
  }, []);

  useEffect(() => {
    if (cmsData) {
      setTravelData(cmsData?.config);
    }
  }, [cmsData]);

  const [cancelPolicyData, setCancelPolicyData] =
    useState<CancelPolicyData | null>(null);
  const [isFlagged, setIsFlagged] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [languageData, setLanguageData] = useState<LanguageData | null>();
  const [isCancelPolicySuccess, setIsCancelPolicySuccess] = useState(false);
  const [iban, setIban] = useState("");
  const [reEnterIban, setReEnterIban] = useState("");
  const [bic, setBic] = useState<string>("");
  const [bankName, setBankName] = useState("");
  const [isCancelAnyway, setIsCancelAnyway] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<
    string | undefined
  >(policyDataObj?.policyNo);
  const [fileData, setFileData] = useState<(FileData | null)[]>([
    null,
    null,
    null,
  ]);
  const [isTCAccepted, setIsTCAccepted] = useState(false);
  const [isValidIban, setIsValidIban] = useState(false);
  const [isReEnterIbanValid, setIsReEnterIbanValid] = useState(false);
  const [isBankNameValid, setIsBankNameValid] = useState(false);
  const [ibanMismatch, setIbanMismatch] = useState(false);
  // Alert Box related states
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [reason, setReason] = useState("");
  const [chequeLeafUploaded, setChequeLeafUploaded] = useState(false);
  const [otherDesc, setOtherDesc] = useState("");
  const [otherReson, setOtherReson] = useState<boolean>(false);
  const [payerName, setPayerName] = useState<string>("");
  const { reviewPolicy, setReviewPolicy, setRefundPolicy, refundPolicy } =
    useTravelPolicyContext();

  const {
    makeApiCall,
    isLoading: isLoadingReviewPolicy,
    error: errorReviewPolicy,
    data: viewPolicyData,
  } = useReviewPolicy({
    PolicyNo: selectedPolicyNumber!,
    Product: policyDataObj?.productCode,
  });
  const {
    fetchCancelRefundData,
    isLoading: fetchCancelRefundLoading,
    error: fetchCancelRefundError,
    policyData,
  } = useCancelRefund({
    PolicyNo: selectedPolicyNumber!,
    ProductCode: policyDataObj?.productCode,
  });
  const {
    fetchCancelPolicy,
    isLoading: submitLoading,
    error: submitCancelPolicyError,
    policyCancelData: policySubmit,
  } = useCancelPolicy({
    PolicyNo: selectedPolicyNumber!,
    documents: fileData
      .filter((file) => file !== null)
      .map((file) => {
        if (file.docFile) {
          file.docFile = file.docFile.replace(
            "data:application/pdf;base64,",
            ""
          );
        }
        return file;
      }),
    iban: iban,
    data: viewPolicyData,
    bic: " ",
    policy_data: policyData,
  });
  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);
  const cancel_language =
    policyDataObj?.productCode === HOME
      ? languageData?.select_dropdown_home
      : languageData?.select_dropdown_travel;
  const cmsReasons = cancel_language?.split(",");
  const dropdownItems =
    cmsReasons?.map((item: string, index: number) => {
      index =
        policyDataObj?.productCode === HOME
          ? cancelPolicyIndex?.Home + index
          : cancelPolicyIndex?.Travel + index;
      return { value: index.toString(), item: item };
    }) || [];

  const { VITE_CONTENT_BASE_URI } = import.meta.env;
  const location = useLocation();
  const propsData = location?.state?.data;

  const noValue = "Not available";
  const noRefund = "No Refund Applicable";
  const userId = useSelector(
    (state: RootState) => state.auth?.userInfo?.userId
  );

  const { fetchValidateIban } = useValidateIban({
    IbanNo: iban,
    NationalId: userId,
  });

  const handleSuccessValidation = async () => {
    setCallGenerateOtp(false);
    await fetchCancelPolicy(reason, isrefundSectionShow ? "Y" : "N");
  };

  useEffect(() => {
    if (policySubmit) {
      setCancelPolicyData(policySubmit?.data?.model);
      isTCAccepted && setIsCancelPolicySuccess(true);
    }
  }, [policySubmit]);

  useEffect(() => {
    const fetchCancelRefundAPI = async () => {
      try {
        await fetchCancelRefundData();
      } catch (error) {
        console.error(error);
      }
    };
    fetchCancelRefundAPI();
  }, [fetchCancelRefundData]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setDropdownOpen((prevState) => !prevState);
    setIsFlagged(value !== "Select");
    setIsCancelAnyway(true);
    setReason(value);
    setOtherReson(value === "9" ? true : false);
  };

  const renderTooltip = () => setSmShow(true);

  const fetchData = async () => {
    const response = await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    );
    setLanguageData(response.config[0]);
  };

  const handleBackBtn = () => {
    navigateTo("/dashboard");
  };

  const handleSubmitBtn = async () => {
    try {
      if (isTCAccepted) {
        setCallGenerateOtp(true);
      } else {
        setCallGenerateOtp(false);
      }
    } catch (error) {
      setCallGenerateOtp(false);
    }
  };
  useEffect(() => {
    if (
      submitCancelPolicyError ||
      fetchCancelRefundError ||
      errorReviewPolicy
    ) {
      setShowAlertModal(true);
      setIsCancelPolicySuccess(false);
    }
  }, [submitCancelPolicyError, fetchCancelRefundError, errorReviewPolicy]);

  const today = new Date().toISOString();
  const todayDate = formatDate(today);

  const policyDataDetail = usePolicyData(viewPolicyData);
  const policyDetails = policyDataDetail?.policyDetails ?? undefined;
  const policyStartDate = policyDetails
    ? formatDate(
        policyDataObj?.productCode === HOME
          ? policyDetails?.startDate
          : policyDetails?.travelStartDate
      )
    : "";
  const policyEndDate = policyDetails
    ? formatDate(
        policyDataObj?.productCode === HOME
          ? policyDetails?.expiryDate
          : policyDetails?.travelExpiryDate
      )
    : "";
  const sumInsuredDeductible =
    viewPolicyData?.policyLob[0]?.policyRisk &&
    viewPolicyData?.policyLob[0].policyRisk[0]?.policyCoverage?.find(
      (item: { sumInsured: any; minDeductible: any }) =>
        item.sumInsured !== null && item.minDeductible !== null
    );

  useEffect(() => {
    if (policyDetails) {
      setPayerName(policyDetails?.travelerName ?? "");
    }
  }, [policyDetails]);

  useEffect(() => {
    if (selectedPolicyNumber) {
      const fetchData = async () => {
        await makeApiCall();
      };
      fetchData();
    }
  }, [makeApiCall, selectedPolicyNumber]);

  useEffect(() => {
    sessionStorage.removeItem("selectedPolicyNumber");

    const storedPolicyNumber = sessionStorage.getItem("selectedPolicyNumber");
    if (storedPolicyNumber) {
      setSelectedPolicyNumber(storedPolicyNumber);
    }

    const handleBeforeUnload = () => {
      sessionStorage.removeItem("selectedPolicyNumber");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    sessionStorage.removeItem("selectedPolicyNumber");

    const storedPolicyNumber = sessionStorage.getItem("selectedPolicyNumber");
    if (storedPolicyNumber) {
      setSelectedPolicyNumber(storedPolicyNumber);
    }
  }, []);

  let isValid = true;

  const validateInput = (value: string, maxLength: number): boolean => {
    const regex = /^[a-zA-Z0-9]*$/; // Only alphanumeric characters
    return (
      value.length <= maxLength && // Check max length
      value.trim() === value && // No leading or trailing spaces
      regex.test(value) // No special characters
    );
  };

  const coverageType =
    policyDataObj?.productCode === HOME
      ? Home_POLICY_TYPE[Number(policyDetails?.coverageName)]
      : TRAVEL_POLICY_TYPE[Number(policyDetails?.coverageName)];
  const refundValue =
    policyDataObj?.productCode === HOME
      ? policyData?.data?.cancelRefund
      : policyData?.data?.model?.cancelRefund;

  const isrefundSectionShow =
    refundValue === 0 || refundValue === undefined || refundValue === null
      ? false
      : true;

  const formattedRefundValue =
    refundValue === 0 || refundValue === undefined || refundValue === null
      ? noRefund
      : `` + Math.abs(refundValue).toFixed(2);

  const handleIban = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (validateInput(value, ibanLength)) {
        setIban(value);
        // Reset related fields if IBAN is cleared
        if (value === "") {
          setReEnterIban("");
          setBankName("");
          setIbanMismatch(false);
          setIsReEnterIbanValid(false);
          setIsValidIban(false);
        } else {
          setIbanMismatch(value !== reEnterIban && reEnterIban !== "");
          if (value.startsWith(SA)) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            isValid = validateIBAN(value);
          } else {
            setIsValidIban(validateIbanNonSA(value));
          }
        }
      }
    },
    [setIban, validateIBAN, validateIbanNonSA, reEnterIban]
  );

  const fetchIbanData = useCallback(async () => {
    if (isValid && iban?.length === ibanLength) {
      const response = await fetchValidateIban();
      const tick = response?.data?.result === "MATCH";
      setIsValidIban(tick);
      setBic(response?.data?.bank?.swiftCode);
    } else {
      setIsValidIban(false);
    }
  }, [fetchValidateIban, iban, isValid]);

  useEffect(() => {
    if (iban && iban.startsWith(SA)) {
      fetchIbanData();
    }
  }, [iban, fetchIbanData, setIsValidIban]);

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOtherDesc(value);
  };

  const handleReEnterIban = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (validateInput(value, ibanLength)) {
      setReEnterIban(value);
      setIbanMismatch(value !== iban);
      setIsReEnterIbanValid(value === iban);
    } else {
      // Invalid re-enter IBAN input
    }
  };

  const handleBankName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replaceAll(/ {2,}/g, " ").trimStart();

    // Regex to allow only letters and a single space between words
    const regex = /^[a-zA-Z ]*$/;

    if (regex.test(value) && value.length <= 30) {
      setBankName(value);
      setIsBankNameValid(true);
    } else {
      setIsBankNameValid(false);
    }
  };

  useEffect(() => {
    const updatedPolicyData = {
      ...policyDataObj,
      cancelRefund: refundValue,
      coverageType: coverageType,
    };
    setRefundPolicy(updatedPolicyData);
  }, [refundValue, policyDetails]);

  useEffect(() => {
    setReviewPolicy(viewPolicyData);
  }, [viewPolicyData]);

  const isSubmitDisabled =
    formattedRefundValue !== noRefund
      ? !isTCAccepted ||
        !isValidIban ||
        (!iban.startsWith(SA) &&
          (!isReEnterIbanValid ||
            !isBankNameValid ||
            bankName.trim() === "")) ||
        (!iban.startsWith(SA) && !chequeLeafUploaded)
      : !isTCAccepted;

  if (submitLoading || fetchCancelRefundLoading || isLoadingReviewPolicy) {
    return <LoaderOverlay />;
  }
  const handleClose = () => {
    setShowAlertModal(false);
  };
  return (
    <>
      <AlertBox
        title={`Error`}
        description={
          submitCancelPolicyError ||
          fetchCancelRefundError ||
          errorReviewPolicy ||
          ""
        }
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
      />
      <Modal
        size="lg"
        className="refundable-amount-modal"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton className="modal-header-refundable">
          <Modal.Title id="example-modal-sizes-title-sm">
            {languageData?.refundable_approx_amount}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{languageData?.the_amount_of_refund}</Modal.Body>
      </Modal>

      {!isCancelPolicySuccess && (
        <>
          <div className="container-parent walaa-regular-400">
            <div className="left-parent">
              {selectedPolicyNumber && (
                <Card className="left-card">
                  <div className="header walaa-medium-500">
                    {languageData?.cancel_policy}
                  </div>
                  <div className="body-container-main">
                    <hr className="horizontal-line" />
                    <div className="body-container">
                      <div className="body-content-parent">
                        <div className="body-content">
                          {/* <div className="body-header walaa-medium-500">
                            {languageData?.select_reason_for_cancel}
                          </div> */}

                          <div className="cancellation-reason-container">
                            <div className="reason-select">
                              <label
                                htmlFor="cancellation-reason-dropdown"
                                className="label"
                              >
                                {languageData?.select_cancellation}
                              </label>
                              <ThemeDropdown
                                id="cancellation-reason-dropdown"
                                value={dropdownItems}
                                classes={`form-select ${
                                  isDropdownOpen ? "open" : ""
                                }`}
                                onChangehandler={handleDropdownChange}
                              />
                            </div>

                            {isFlagged && (
                              <div className="cancellation-date">
                                <label
                                  htmlFor="cancellation-from"
                                  className="label"
                                >
                                  {languageData?.cancellation_from}
                                </label>
                                <ThemeTextbox
                                  disabled={true}
                                  name={""}
                                  value={todayDate}
                                />
                              </div>
                            )}
                          </div>
                          {otherReson && (
                            <div
                              className="important-text-field"
                              style={{ width: "100%" }}
                            >
                              <div className="iban-heading">
                                {languageData?.description || "Description"}
                              </div>
                              <div>
                                <ThemeTextbox
                                  value={otherDesc}
                                  name="description"
                                  type={"text"}
                                  onChangehandler={handleDescription}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {isFlagged && isCancelAnyway && (
                          <div className="body-content">
                            <div className="body-header walaa-medium-500">
                              {languageData?.your_refund_details}
                            </div>
                            {formattedRefundValue === noRefund ? (
                              <SeniorCitizenAlert
                                message={languageData?.no_refund_applicable_msg}
                              />
                            ) : (
                              <div className="refund-tooltip">
                                <div className="refund-section">
                                  <div className="refund-approx-amt-label">
                                    {languageData?.refundable_approx_amount}
                                  </div>
                                  <div className="refund-approx-amt walaa-medium-500">
                                    {getAmountWithIcon(formattedRefundValue)}
                                  </div>
                                </div>
                                <img
                                  src={Info}
                                  alt="Tooltip_Logo"
                                  onClick={renderTooltip}
                                />
                              </div>
                            )}
                            {isrefundSectionShow && (
                              <>
                                <hr className="horizontal-line" />

                                <div className="body-header walaa-medium-500">
                                  {languageData?.bank_details}
                                </div>
                                <div className="iban-details">
                                  <div className="important-text-field">
                                    <div className="iban-heading">
                                      {languageData?.iban_no}
                                      <span className="important-field">*</span>
                                    </div>
                                    <div className="iban-container">
                                      <ThemeTextbox
                                        value={iban}
                                        name="iban"
                                        type="text"
                                        onChangehandler={handleIban}
                                      />
                                      {!isValidIban && iban.startsWith(SA) && (
                                        <CancelRoundedIcon className="invalid-iban" />
                                      )}
                                      {isValidIban && iban && (
                                        <CheckCircleRoundedIcon className="valid-iban" />
                                      )}
                                    </div>
                                    {iban.length > 2 && !isValidIban && (
                                      <div className="error-msg">
                                        {iban.startsWith("SA") &&
                                        iban.length !== 24
                                          ? languageData?.enter_valid_iban_no ||
                                            languageData?.iban_valid_error_msg
                                          : !iban.startsWith("SA")
                                          ? languageData?.iban_invalid_non_sa ||
                                            languageData?.iban_valid_error_for_non_sa_msg
                                          : null}
                                      </div>
                                    )}
                                  </div>
                                  {iban && !iban.startsWith(SA) && (
                                    <>
                                      <div className="important-text-field">
                                        <div className="iban-heading">
                                          {languageData?.re_enter_iban}
                                          <span className="important-field">
                                            *
                                          </span>
                                        </div>
                                        <div>
                                          <ThemeTextbox
                                            value={reEnterIban}
                                            name={""}
                                            onChangehandler={handleReEnterIban}
                                          />
                                        </div>
                                      </div>

                                      <div className="important-text-field">
                                        <div className="iban-heading">
                                          {languageData?.bank}
                                          <span className="important-field">
                                            *
                                          </span>
                                        </div>
                                        <div>
                                          <ThemeTextbox
                                            value={bankName}
                                            name={""}
                                            onChangehandler={handleBankName}
                                          />
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {iban && !iban.startsWith(SA) && languageData && (
                        <Iban
                          fileData={fileData}
                          setFileData={setFileData}
                          languageData={languageData}
                          onChequeLeafUpload={() => setChequeLeafUploaded(true)}
                          onChequeLeafRemove={() =>
                            setChequeLeafUploaded(false)
                          }
                        />
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {isFlagged && isCancelAnyway && selectedPolicyNumber && (
                <div className="consent">
                  <TermsAndCon
                    languageData={languageData}
                    isChecked={isTCAccepted}
                    setIsChecked={setIsTCAccepted}
                    productcode={policyDataObj?.productCode}
                  />
                </div>
              )}
            </div>
            <div className="right-card-policy">
              {selectedPolicyNumber && (
                <PolicyCard
                  policyNumber={selectedPolicyNumber}
                  startDate={policyStartDate} //MM/DD/YYYY
                  expiryDate={policyEndDate} //MM/DD/YYYY
                  languageData={languageData ?? {}}
                  coverageName={
                    policyDataObj?.productCode !== HOME
                      ? TRAVEL_POLICY_TYPE[Number(policyDetails?.coverageName)]
                      : Home_POLICY_TYPE[Number(policyDetails?.coverageName)]
                  }
                  policyPeriod={languageData?.policy_period}
                  policyNo={languageData?.policy_no}
                  travelTypeLabel={languageData?.travel_type}
                  travelType={
                    policyDetails?.travelType
                      ? TRAVEL_TYPE[Number(policyDetails?.travelType)]
                      : ""
                  }
                  prodcutCode={policyDataObj?.productCode}
                  address={policyDataDetail?.policyRisk}
                  policyHolder={
                    policyDataDetail?.policyHolderDetails?.customerNameEnglish
                  }
                  sumInsured={sumInsuredDeductible?.sumInsured}
                  deductibles={sumInsuredDeductible?.minDeductible}
                />
              )}
              <DidYouKnowCard
                did_you_know_content={travelData?.did_you_know_content}
                did_you_know_text={travelData?.did_you_know_text}
              />
            </div>
          </div>

          <div className="main-footer cancel-policy">
            <div className="footer-btns walaa-medium-500">
              <div>
                <ThemeButton
                  classes={"back-btn"}
                  isDisabled={false}
                  title={languageData?.back}
                  variant="link"
                  iconLeft={true}
                  onClickhandler={handleBackBtn}
                  iconName="ChevronLeftIcon"
                />
              </div>
              <div>
                <ThemeButton
                  classes={"submit-btn"}
                  isDisabled={isSubmitDisabled}
                  title={languageData?.submit}
                  variant="link"
                  iconLeft={false}
                  iconRight={true}
                  iconName="ChevronRightIcon"
                  onClickhandler={handleSubmitBtn}
                />
              </div>
            </div>
          </div>
        </>
      )}
      {isCancelPolicySuccess && (
        <PHQuoteBuyProvider>
          <QuoteAndBuyProvider>
            <TravelSucces
              status={false}
              data={travelData}
              flag={false}
              cancelPolicyData={cancelPolicyData}
              policyDetails={policyDetails}
              address={policyDataDetail?.policyHolderDetails?.address}
            />
          </QuoteAndBuyProvider>
        </PHQuoteBuyProvider>
      )}

      {/* // Checking this section coming or not */}
      {languageData && (
        <OTPWrapper
          generateOtpUrl={"GenerateOtp"}
          validateOtpUrl={"ValidateOtp"}
          languageData={{
            enter_otp_code: languageData?.enter_otp_code,
            your_otp_will_expire: languageData?.your_otp_will_expire,
            confirm_otp: languageData?.confirm_otp,
            resend_otp: languageData?.resend_otp,
          }}
          handleSuccessValidation={handleSuccessValidation}
          payload={{
            mobileNumber:
              policyDataObj?.productCode === HOME ||
              policyDataObj?.productCode === TRAVEL
                ? propsData?.mobileNo
                : propsData?.mobileNumber,
          }}
          callGenerateOtp={callGenerateOtp}
          setCallGenerateOtp={setCallGenerateOtp}
        />
      )}
    </>
  );
}

export default CancelPolicy;
