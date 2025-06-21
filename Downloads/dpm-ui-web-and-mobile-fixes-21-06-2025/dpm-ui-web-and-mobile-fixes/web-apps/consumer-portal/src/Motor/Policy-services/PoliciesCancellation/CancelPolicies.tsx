import React, { useCallback, useEffect, useState } from "react";
import "./CancelPolicy.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Info from "assets/CancelPolicy/Info.svg";
import ThemeDropdown from "./sharedComponent/ThemeDropdown";
import ThemeButton from "./sharedComponent/ThemeButton";
import { Accordion, Card, Modal } from "react-bootstrap";
import PolicyCard from "./sharedComponent/PolicyCard";
import { useCancelPolicy } from "./hook/useCancelPolicy";
import { useCancelRefund } from "./hook/useCancelRefund";
import { useValidateIban } from "./hook/useValidateIban";
import { callAPI, validateIBAN, validateIbanNonSA, RootState, capitalizeNameFirstLetter, useApiCall, constant } from "@dpm/shared-module";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import Driver from "assets/CancelPolicy/Driver.svg";
import Success from "Motor/SuccessPage";
import TermsAndConditionsModal from "Motor/Endorsement/TermsAndConditionModel";
import { formatDate } from "utils/formatDate";
import { useReviewPolicy } from "../PolicyDashboard/hooks/useReviewPolicy";
import { getPriceFormat } from "utils/getPriceFormat";
import usePolicyData from "../PolicyDashboard/hooks/usePolicyData";
import Iban from "components/Iban/iban";
import { SA, productIDs } from "../../../constant";
import { LanguageData } from "types/languageData";
import mockData from "./hook/mockData.json";
import { AlertBox } from "components/AlertBox";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import { useSelector } from 'react-redux';
import { PolicyDetails } from "types/Dashboard";
import { getPlateNumber } from "utils/getPlateNumber";
import { MakeModelImageResponse } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { getModelIcon } from "utils/getModelIcon";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { truncateName } from "utils/quoteAndBuy";
import { getGenderProfileIcon } from "utils/quoteAndBuy";

interface FileData {
  docType: string;
  fileName: string;
  fileExtension: string;
  docFile: string;
}

interface Driver {
  driverName: string;
  driverNameArabic: string;
  gender: string;
}

interface CancelPolicyProps {
  policyDataObj: PolicyDetails;
  navigateTo: (path: string) => void;
}

function CancelPolicy({ policyDataObj, navigateTo }: Readonly<CancelPolicyProps>) {
  const [isFlagged, setIsFlagged] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [isCancelPolicySuccess, setIsCancelPolicySuccess] = useState(false);
  const [iban, setIban] = useState("");
  const [reEnterIban, setReEnterIban] = useState("");
  const [ibanMismatch, setIbanMismatch] = useState(false);
  const [bankName, setBankName] = useState("");
  const [isCancelAnyway, setIsCancelAnyway] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<
    string | undefined
  >(policyDataObj?.policyNo);
  const [fileData, setFileData] = useState<(FileData | null)[]>([
    null,
    null
  ]);
  const [isTCAccepted, setIsTCAccepted] = useState(false);
  const [isValidIban, setIsValidIban] = useState(false);
  const [isValidNonSAIban, setIsValidNonSAIban] = useState<boolean>(false);
  const [isReEnterIbanValid, setIsReEnterIbanValid] = useState(false);
  const [isBankNameValid, setIsBankNameValid] = useState(false);
  const [chequeLeafUploaded, setChequeLeafUploaded] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);

  const { fetchCancelRefundData, policyData } = useCancelRefund({
    PolicyNo: selectedPolicyNumber!,
  });

  const { makeApiCall, data } = useReviewPolicy({
    PolicyNo: selectedPolicyNumber!,
    Product: policyDataObj?.productCode,
  });

  const { NON_SA_IBAN_UPPER_LIMIT, NON_SA_IBAN_LOWER_LIMIT, SA_IBAN_LENGTH } = constant;

  const userId = useSelector((state: RootState) => state.auth?.userInfo?.userId);

  const { fetchCancelPolicy, policyCancelData, error, isLoading } = useCancelPolicy({
    PolicyNo: selectedPolicyNumber!,
    documents: fileData
    .filter((file) => file !== null)
    .map((file) => {
      if (file.docFile) {
        file.docFile = file.docFile.replace('data:application/pdf;base64,', '');
      }
      return file;
    }),
    iban: iban,
    data: data,
    policy_data: policyData
  });

  const { fetchValidateIban, validationData } = useValidateIban({
    IbanNo: iban,
    NationalId: userId
  });

  const handleClose = () => {
    setShowAlertModal(false);
  };

  const dropdownItems = languageData?.select_dropdown.split(",");

  const { VITE_CONTENT_BASE_URI } = import.meta.env;

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

  const handleSuccessValidation = () => {
     fetchCancelPolicy(fileData);
    }

  const handleSubmitBtn = () => {
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

  const today = new Date().toISOString();
  const todayDate = formatDate(today);

  const vehicle = {
    make: data?.policyLob[0]?.policyRisk[0]?.vehicleMakeTextEn,
    model: data?.policyLob[0]?.policyRisk[0]?.vehicleModelTextEn,
    plateNumber: data?.policyLob[0]?.policyRisk[0]?.plateNo,
    plateNoText1: data?.policyLob[0]?.policyRisk[0]?.plateNoText1,
    plateNoText2: data?.policyLob[0]?.policyRisk[0]?.plateNoText2,
    plateNoText3: data?.policyLob[0]?.policyRisk[0]?.plateNoText3,
    vehicleSequenceNo: data?.policyLob[0]?.policyRisk[0]?.vehicleSequenceNo,
    chassisNo: data?.policyLob[0]?.policyRisk[0]?.chassisNo,
    manufactureYear: data?.policyLob[0]?.policyRisk[0]?.manufactureYear,
  };

  const displayPolicyNumber = getPlateNumber({
    plateNo: vehicle.plateNumber,
    plateNoText1: vehicle?.plateNoText1,
    plateNoText2: vehicle?.plateNoText2,
    plateNoText3: vehicle?.plateNoText3,
  });

  const [makeModelResponse, setMakeModelResponse] = useState();

  const { makeApiCall: makeModelImageApiCall, data: modelImageResponse } =
  useApiCall<{ motor_makes: MakeModelImageResponse[] }, undefined>(
    1,
    "consumerportal-config",
    "post",
    "en"
  );

  useEffect(() => {
    makeModelImageApiCall();
  }, []);

  useEffect(() => {
    if (modelImageResponse) {
      setMakeModelResponse(modelImageResponse?.motor_makes);
    }
  }, [modelImageResponse]);

  const drivers = data?.policyLob[0]?.policyRisk[0]?.drivers;

  const policyDataDetail = usePolicyData(data);

  const policyDetails = policyDataDetail?.policyDetails ?? undefined;

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

  const handleIban = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (validateInput(value, NON_SA_IBAN_UPPER_LIMIT)) {
        setIban(value);
        const isMismatch = value !== reEnterIban;
        setIbanMismatch(isMismatch);
        setIsReEnterIbanValid(value === reEnterIban);
        if (value === "") {
          setReEnterIban("");
          setBankName("");
          setIbanMismatch(false);
          setIsReEnterIbanValid(false);
          setIsValidIban(false);
        } else {
          setIbanMismatch(value !== reEnterIban && reEnterIban !== "");
          if (value.startsWith(SA)) {
            const isValidSA = validateIBAN(value) && value.length === SA_IBAN_LENGTH;
            setIsValidIban(isValidSA);
          } else {
            const isValidNonSA = validateIbanNonSA(value, NON_SA_IBAN_UPPER_LIMIT, NON_SA_IBAN_LOWER_LIMIT);
            setIsValidNonSAIban(isValidNonSA);
          }
        }
      }
    },
    [setIban, validateIBAN, validateIbanNonSA, reEnterIban]
  )

  useEffect(() => {
    const fetchData = async () => {
      if(isValid && iban?.length === SA_IBAN_LENGTH){
        await fetchValidateIban();
        const tick = validationData?.data?.result === "MATCH";
        setIsValidIban(tick);
      } else {
        setIsValidIban(false);
      }
    };
    if (iban.startsWith(SA)) fetchData();
  }, [isValid, iban]);
  

  const handleReEnterIban = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (validateInput(value, NON_SA_IBAN_UPPER_LIMIT)) {
      setReEnterIban(value);
      const isMismatch = value !== iban;
      setIbanMismatch(isMismatch);
      setIsReEnterIbanValid(value === iban);
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

  const refundValue = policyData?.data?.cancelRefund;

  const formattedRefundValue =
    refundValue === 0 || refundValue === undefined || refundValue === null
      ? languageData?.no_refund_applicable
      : languageData?.sar + " " + Math.abs(refundValue).toFixed(2);

  const isSubmitDisabled =
    !isTCAccepted ||
    !isValidIban ||
    (iban.startsWith(SA) && (iban.length !== SA_IBAN_LENGTH || validationData?.data?.result !== "MATCH")) ||
    (!iban.startsWith(SA) && (!isReEnterIbanValid || !isBankNameValid || bankName.trim() === "" || !chequeLeafUploaded)) ||
    (!iban.startsWith(SA) && !isValidNonSAIban)

    const policyDetail = {
      policyNumber: selectedPolicyNumber,
      vehicleDetails: vehicle,
      refundValue: formattedRefundValue,
    };

    useEffect(() => {
      if(error){
        setShowAlertModal(true);
      }
    }, [error]);

    useEffect(() => {
      if(policyCancelData){
        setIsCancelPolicySuccess(true);
      }
    }, [policyCancelData]);

    useEffect(() => {
      if(validationData && validationData?.data?.result === "MATCH"){
        setIsValidIban(true);
      }else if(iban === reEnterIban && iban.length >= NON_SA_IBAN_LOWER_LIMIT && iban.length <= NON_SA_IBAN_UPPER_LIMIT && reEnterIban.length >= NON_SA_IBAN_LOWER_LIMIT && reEnterIban.length <= NON_SA_IBAN_UPPER_LIMIT){
        setIsValidIban(true);
      }else {
        setIsValidIban(false); // Explicitly set to false when validation fails
      }
    }, [validationData, iban, reEnterIban]);

  return (
    <>
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

      <AlertBox
        title={error || ""}
        description={error || ""}
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
          }}
          handleSuccessValidation={handleSuccessValidation}
          payload={{
            mobileNumber: mockData?.mobileNumber,
          }}
          callGenerateOtp={callGenerateOtp}
          setCallGenerateOtp={setCallGenerateOtp}
        />
      )}

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
                          <div className="body-header walaa-medium-500">
                            {languageData?.select_reason_for_cancel}
                          </div>

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
                        </div>

                        {isFlagged && isCancelAnyway && (
                          <div className="body-content">
                            <div className="body-header walaa-medium-500">
                              {languageData?.your_refund_details}
                            </div>

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
                                <div>
                                  <ThemeTextbox
                                    value={iban}
                                    name="iban"
                                    type="text"
                                    classes="textbox-padding"
                                    onChangehandler={handleIban}
                                  >
                                    {iban?.startsWith(SA) &&
                                      ((isValidIban && iban.length === SA_IBAN_LENGTH && validationData?.data?.result === "MATCH") ? (
                                        <FaCheckCircle
                                          style={{ color: "green" }}
                                        />
                                      ) : (
                                        <FaTimesCircle
                                          style={{ color: "red" }}
                                        />
                                      ))}
                                  </ThemeTextbox>
                                  {iban.length > 2 &&
                                    iban?.startsWith(SA) &&
                                    (!isValidIban ||
                                    iban.length !== SA_IBAN_LENGTH) && (
                                      <div className="error-msg">
                                        {languageData?.invalid_Iban_msg || "Invalid IBAN. Please check and re-enter."}
                                      </div>
                                    )}
                                  {iban.length > 2 &&
                                    !iban?.startsWith(SA) &&
                                    (!isValidNonSAIban || (iban.length < NON_SA_IBAN_LOWER_LIMIT || iban.length > NON_SA_IBAN_UPPER_LIMIT)) && (
                                      <div className="error-msg">
                                        {languageData?.invalid_Iban_msg || "Invalid IBAN. Please check and re-enter."}
                                      </div>
                                    )}
                                </div>
                              </div>

                              {iban && !iban.startsWith(SA) && (
                                <>
                                  <div className="important-text-field">
                                    <div className="iban-heading">
                                      {languageData?.re_enter_iban}
                                      <span className="important-field">*</span>
                                    </div>
                                    <div>
                                      <ThemeTextbox
                                        value={reEnterIban}
                                        name={""}
                                        classes="textbox-padding"
                                        onChangehandler={handleReEnterIban}
                                      />
                                      {ibanMismatch && (
                                        <div
                                          className="error-msg"
                                        >
                                          {languageData?.iban_numbers_do_not_match ||
                                            "IBAN numbers do not match."}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="important-text-field">
                                    <div className="iban-heading">
                                      {languageData?.bank}
                                      <span className="important-field">*</span>
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

                            {/* For future referance if we get IBAN automatically from fetched records then we need to show the below content */}
                            {/* <div className="iban-detail walaa-regular-400">
                              {" "}
                              {languageData?.iban_no_fetched_from_your}
                            </div> */}
                          </div>
                        )}
                      </div>
                      {iban && !iban.startsWith(SA) && languageData && (
                        <Iban
                          fileData={fileData}
                          setFileData={setFileData}
                          languageData={languageData}
                          onChequeLeafUpload={() => setChequeLeafUploaded(true)}
                          onChequeLeafRemove={() => setChequeLeafUploaded(false)}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {isFlagged && isCancelAnyway && selectedPolicyNumber && (
                <div className="consent">
                  <TermsAndConditionsModal
                    handleState={setIsTCAccepted}
                    isTCAccepted={isTCAccepted}
                    languageData={languageData}
                    productName={productIDs.motor}
                    coverageType={policyDetails?.prodCode}
                    cancelPolicy={true}
                  />
                </div>
              )}
            </div>
            <div className="right-card-policy">
              {selectedPolicyNumber && (
                <PolicyCard
                  policyNumber={selectedPolicyNumber}
                  startDate={policyDetails?.startDate}
                  expiryDate={policyDetails?.expiryDate}
                  idvValue={
                    policyDetails?.idv
                      ? `${languageData?.sar} ${getPriceFormat(
                          parseInt(policyDetails?.idv)
                        )}`
                      : `${languageData?.not_available}`
                  }
                  coverageName={policyDetails?.coverageName}
                  startDateTitle={languageData?.start_date}
                  expiryDateTitle={languageData?.expiry_date}
                  policyNo={languageData?.policy_no}
                  idvTitle={languageData?.sum_insured}
                  prodCode={policyDataObj?.productCode}
                />
              )}

              {selectedPolicyNumber && (
                <div className="vehicle-card">
                  <Accordion
                    defaultActiveKey="0"
                    className="vehicle-card-accordion"
                  >
                    <Accordion.Item eventKey="0" className="item-card">
                      <Accordion.Header>
                        <div className="car-parent">
                          <div>
                          <img
                              className="vehicle-icon"
                              src={getModelIcon(policyData?.vehicleMakeTextEn, policyData?.vehicleMakeId , makeModelResponse || [])}
                              alt="logo"
                            />
                          </div>
                          <div className="car">
                            <div className="car-number walaa-medium-500">
                              {capitalizeNameFirstLetter(`${vehicle?.make} ${vehicle?.model}`)}
                            </div>
                            {/*keeping this for future reference*/}
                            {/* <div className="car-number walaa-medium-500">
                              {vehicle.plateNumber}
                            </div> */}
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="main-content">
                        <div className="card-details">
                          <div className="card-details-left">
                            <div>
                              <div className="title walaa-regular-400">
                                {languageData?.no_plate}
                              </div>
                              <div className="value walaa-medium-500">
                                {displayPolicyNumber}
                              </div>
                            </div>
                            <div>
                              <div className="title walaa-regular-400">
                                {languageData?.vehicle_sequence}
                              </div>
                              <div className="value walaa-medium-500">
                                {vehicle.vehicleSequenceNo}
                              </div>
                            </div>
                          </div>
                          <div className="card-details-right">
                            <div>
                              <div className="title walaa-regular-400">
                                {languageData?.registration_year_label}
                              </div>
                              <div className="value walaa-medium-500">
                                {vehicle.manufactureYear}
                              </div>
                            </div>
                            <div>
                              <div className="title walaa-regular-400">
                                {languageData?.chassis_no}
                              </div>
                              <div className="value walaa-medium-500">
                                {vehicle.chassisNo}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                      <Accordion.Body className="bottom-body">
                        <div className="bottom-card">
                          <div className="title walaa-medium-500">
                            {languageData?.additional_drivers}
                          </div>
                          <div className="drivers-cards">
                          {drivers
                              ?.filter(
                                (driver: Driver) => driver?.driverID !== userId
                              )
                              .map((driver: Driver, index: number) => (
                                <div className="driver" key={index}>
                                  <div className="driver-list">
                                    <div className="logo">
                                      <img src={getGenderProfileIcon(driver?.gender)} width={"40px"} height={"40px"} alt="Driver Image" />
                                    </div>
                                    <div className="name walaa-medium-500">
                                      <div>{truncateName(driver.driverName, 12)}</div>
                                      <div>{driver.driverNameArabic}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              )}

              <DidYouKnowCard
                did_you_know_content={languageData?.did_you_know_content ?? ""}
                did_you_know_text={languageData?.did_you_know_text ?? ""}
              />
            </div>
          </div>

          <div className="main-footer">
            <div className="footer-btns walaa-medium-500">
              <div>
                <ThemeButton
                  classes={"back-btn"}
                  isDisabled={false}
                  title={languageData?.back ?? ""}
                  variant="link"
                  iconLeft={true}
                  onClickhandler={handleBackBtn}
                  iconName="ChevronLeftIcon"
                />
              </div>
              <div>
                <ThemeButton
                  classes={isLoading ? "disabled" : "submit-btn"}
                  isDisabled={isSubmitDisabled}
                  title={languageData?.submit ?? ""}
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
        <Success
          status={false}
          data={policyDetail}
          isCancelSuccess={true}
          languageData={languageData}
        />
      )}
    </>
  );
}

export default CancelPolicy;