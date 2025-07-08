import { DataContext } from "../../../../../../DataContext";
import React, { useContext, useEffect, useState } from "react";
import { Card, Form, InputGroup, Spinner } from "react-bootstrap";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Bounce, toast } from "react-toastify";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { callAPI, TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";
import ThemeTextbox from "components/ThemeComponents/ThemeTextbox";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import ThemeTextarea from "components/ThemeComponents/ThemeTextarea";
import Iban from "components/Iban/iban";
import {
  SA,
  IBAN,
  comprehensiveTP,
  comprehensiveOD,
  OTHERS_CASE_SOURCE_TYPE,
  NOT_VALID_MOBILE,
  TRAVEL,
  NATIONAL_ID,
} from "../../../../../../constant";
import { useSelector } from "react-redux";
import {
  RootState,
  validateIbanNonSA,
  validateInput,
} from "@dpm/shared-module";
import { OthersClaimInfo } from "@corporate-portal/components/GetQuoteWidget/getQuoteInterface";

const { VITE_BACKEND_BASE_URL } = import.meta.env;

interface FileData {
  docType: string;
  fileName: string;
  fileExtension: string;
  docFile: string;
}

interface ICompensationObjFactory {
  isIBan: string;
  isMobilenum: string;
  isEmailId: string;
  isAdditionalRemarks: string;
}

interface IContactDetails {
  validationData: any;
  claimsInfo: any;
  changeHandler: (
    name: string,
    isIBAN: boolean,
    value?: string,
    bankName?: string,
    iBANFiles?: (FileData | null)[]
  ) => void;
  mobilenumData: any;
  type: string;
  isOthersCase?: number;
  handleIbanDetails?: (value: Travel.IBANDetails) => void;
  othersClaimInfo?: OthersClaimInfo;
}
const ContactDetails = ({
  validationData,
  claimsInfo,
  changeHandler,
  mobilenumData,
  type,
  isOthersCase,
  handleIbanDetails,
  othersClaimInfo,
}: IContactDetails) => {
  //error state handler
  const [compensateError, setCompensateError] = useState({
    iBan: "",
    mobilenum: "",
    emailId: "",
  });

  // CompensateData
  const [compensateData, setCompensateData] = useState<ICompensationObjFactory>(
    {
      isIBan: validationData?.iban ?? "",
      isMobilenum: mobilenumData ? mobilenumData?.toString() : "",
      isEmailId: validationData?.email ? validationData?.email?.toString() : "",
      isAdditionalRemarks: "",
    }
  );

  const userId = useSelector(
    (state: RootState) => state.auth?.userInfo?.userId
  );

  // IBAN verification icon state
  const [showSuccessIcon, setSuccessIconhandler] = useState<boolean>(false);
  const [showErrorIcon, setErrorIconhandler] = useState<boolean>(false);
  const [showLoaderIcon, setLoaderIconhandler] = useState<boolean>(false);
  const [isValidIban, setIsValidIban] = useState(false);

  const [fileData, setFileData] = useState<(FileData | null)[]>([
    null,
    null,
    null,
  ]);
  const [reEnteredIban, setReEnteredIban] = useState("");
  const [bankName, setBankName] = useState<string>("");
  const [chequeLeafUploaded, setChequeLeafUploaded] = useState(false);
  const [ibanError, setIbanError] = useState<string>("");

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );
  const clearFileDataState = ()=>{
    const hasAnyItem = fileData?.some(item => item !== null);
    const updatedFileData = hasAnyItem ? fileData?.map(() => null) : fileData;
    setFileData(updatedFileData);
  }
  const updatedValue = (event: React.FormEvent<HTMLDivElement>) => {
    const { name, value } = event.target as HTMLInputElement;

    // Prevent space key from being processed
    if (
      (value.includes(" ") ||
      (event.nativeEvent instanceof KeyboardEvent &&
        event.nativeEvent.code === "Space")) &&
        (name !== languageData?.additional_remarks)
    ) {
      event.preventDefault();
      return;
    }
    const sanitizedValue = validateInput(value);

    if (name === IBAN && sanitizedValue.length >= 2) {
      if (sanitizedValue.startsWith(SA)) {
        setIsValidIban(false);
        setChequeLeafUploaded(false);
      } else setIsValidIban(true);
    } else if (name === IBAN && sanitizedValue.length === 0) {
      setIsValidIban(false);
    }

    if (
      name === "IBan" ||
      name === "mobilenum" ||
      name === "emailId" ||
      name === languageData?.additional_remarks
    ) {
      if (name === "IBan") {
        setCompensateData({ ...compensateData, isIBan: sanitizedValue });
        setSuccessIconhandler(false);
        setLoaderIconhandler(false);
        setErrorIconhandler(false);
        changeHandler("iBAN", false);
        // Reset reEnteredIban and bankName if IBan is cleared
        if (sanitizedValue === "") {
          setReEnteredIban("");
          setBankName("");
          setIbanError("");
        }

        // Check if IBAN does not start with "SA"
        if (sanitizedValue.length > 2 && !sanitizedValue.startsWith(SA)) {
          if (sanitizedValue.length !== 24) {
            setCompensateError({
              ...compensateError,
              iBan:
                languageData?.iban_invalid_non_sa ||
                "IBAN not valid for Saudi Accounts",
            });
            changeHandler("iBAN", false);
          } else if (!validateIbanNonSA(sanitizedValue)) {
            changeHandler("iBAN", false);
          } else {
            setCompensateError({ ...compensateError, iBan: "" });
            changeHandler("iBAN", true);
          }
        }

        // Check if IBAN starts with "SA" and does not have 24 characters
        else if (
          sanitizedValue.length > 2 &&
          sanitizedValue.startsWith(SA) &&
          sanitizedValue.length !== 24
        ) {
          setCompensateError({
            ...compensateError,
            iBan:
              languageData?.iban_invalid_non_sa ||
              "IBAN not valid for Saudi Accounts",
          });
          changeHandler("iBAN", false);
        } else if (
          /^[SA0-9]{0,2}\d{0,22}$/.test(sanitizedValue) ||
          sanitizedValue === ""
        ) {
          setCompensateError({ ...compensateError, iBan: "" });
          if (sanitizedValue.length === 24 && sanitizedValue.startsWith(SA)) {
            validateIBAN(sanitizedValue);
            clearFileDataState();
            changeHandler("iBAN", true);
          }
        } else {
          if (sanitizedValue.startsWith(SA) && sanitizedValue.length > 24) {
            setCompensateError({
              ...compensateError,
              iBan: languageData?.invalid_iban,
            });
          }
          changeHandler("iBAN", false);
        }
      } else if (name === "mobilenum") {
        setCompensateData({
          ...compensateData,
          isMobilenum: sanitizedValue.replace(/\D/g, ""),
        });
        const saudiMobileRegex = /^05\d{8}$/;
        if (
          sanitizedValue === "" ||
          (saudiMobileRegex.test(sanitizedValue) &&
            sanitizedValue.length === 10)
        ) {
          setCompensateError({ ...compensateError, mobilenum: "" });
          changeHandler("mobilenum", true, sanitizedValue);
        } else {
          setCompensateError({
            ...compensateError,
            mobilenum: languageData?.phone_no_must_be_starts_wi,
          });
          changeHandler("mobilenum", false);
        }
      } else if (name === languageData?.additional_remarks) {
        setCompensateData({ ...compensateData, isAdditionalRemarks: value });
        changeHandler(languageData?.additional_remarks, true, value);
      } else {
        const emailRegex = /^\S+@[a-zA-Z]+\.(com|co.in)$/;
        setCompensateData({ ...compensateData, isEmailId: value });
        changeHandler("emailId", false, value);
        if (emailRegex.test(value) || value === "") {
          setCompensateError({ ...compensateError, emailId: "" });
          changeHandler("emailId", true, value);
        } else {
          setCompensateError({
            ...compensateError,
            emailId: languageData?.invalid_email_id ?? "",
          });
          changeHandler("emailId", false, value);
        }
      }
    }
  };

  // validateiban Api call function
  const validateIBAN = async (iBAN: string) => {
    setLoaderIconhandler(true);
    try {
      const response = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateIban`,
        {
          iban: iBAN,
          idValue: isAuthenticated ? userId : claimsInfo?.ownerId,
          idType: NATIONAL_ID,
        }
      );
      if (
        response?.message.toUpperCase() === "SUCCESS" &&
        response?.data.result === "MATCH"
      ) {
        setLoaderIconhandler(false);
        setErrorIconhandler(false);
        setSuccessIconhandler(true);
        changeHandler("iBAN", true, iBAN, response?.data?.bank?.englishName);
      } else if (
        response?.message.toUpperCase() === "ERROR" ||
        response?.message === "INTERNAL_SERVER_ERROR"
      ) {
        changeHandler("iBAN", false);
        setLoaderIconhandler(false);
        setErrorIconhandler(true);
        setSuccessIconhandler(false);
        toast.error(response?.data?.result, {
          icon: <WarningAmberOutlinedIcon />,
          className: "error-cust",
          position: "top-right",
          autoClose: TOAST_AUTOCLOSE_TIMER || false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        changeHandler("iBAN", false);
        setLoaderIconhandler(false);
        setErrorIconhandler(true);
        setSuccessIconhandler(false);
        toast.error(response?.message, {
          icon: <WarningAmberOutlinedIcon />,
          className: "error-cust",
          position: "top-right",
          autoClose: TOAST_AUTOCLOSE_TIMER || false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      changeHandler("iBAN", false);
      setLoaderIconhandler(false);
      setErrorIconhandler(true);
      setSuccessIconhandler(false);
    } finally {
      /* empty */
    }
  };

  //cms content

  const languageData = useContext(DataContext);

  // Handlers for reEnteredIban and bankName
  const handleReEnteredIbanChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const sanitizedValue = validateInput(e.target.value);
    setReEnteredIban(sanitizedValue);
  };

  const handleBankNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(/ {2,}/g, " ").trimStart();

    const regex = /^[a-zA-Z ]*$/;

    if (regex.test(value) && value.length <= 30) {
      setBankName(value);
    }
  };

  useEffect(() => {
    handleIbanDetails?.({
      mobile: compensateData?.isMobilenum ?? "",
      emaiId: compensateData?.isEmailId ?? "",
      iBAN: compensateData?.isIBan ?? "",
      bankName: bankName ?? "",
      iBANFiles: fileData ?? [],
    });
  }, [bankName, compensateData, fileData]);

  // if reEnteredIban and bankName and chequeLeafUploaded is true then set iBAN to true
  useEffect(() => {
    if (compensateData.isIBan === reEnteredIban) {
      // Clear error if IBANs match
      setIbanError("");
        compensateError.iBan.length > 0
          ? changeHandler("iBAN", false)
          : changeHandler(
              "iBAN",
              true,
              reEnteredIban,
              fileData.filter((file) => file !== null)
            );
    } else if (
      reEnteredIban !== "" &&
      compensateData.isIBan !== reEnteredIban
    ) {
      // Set error if IBANs don't match
      setIbanError(
        languageData?.iban_numbers_do_not_match || "IBAN numbers do not match."
      );
      changeHandler("iBAN", false);
    } else {
      // Clear error for other cases
      setIbanError("");
    }

    if (
      bankName.length > 0 &&
      chequeLeafUploaded &&
      compensateData.isIBan === reEnteredIban
    ) {
      changeHandler(
        "iBAN",
        true,
        reEnteredIban,
        bankName,
        fileData.filter((file) => file !== null)
      );
    } else {
      changeHandler("iBAN", false);
    }
  }, [compensateData.isIBan, reEnteredIban, bankName, fileData]);

  // if mobilenumData response from api not matching criteria then set error and mobile number to false
  useEffect(() => {
    if (mobilenumData?.toString()?.length > 0) {
      const saudiMobileRegex = /^05\d{8}$/;
      if (!saudiMobileRegex.test(mobilenumData?.toString())) {
        setCompensateError({
          ...compensateError,
          mobilenum:
            NOT_VALID_MOBILE || languageData?.phone_no_must_be_starts_wi,
        });
        changeHandler("mobilenum", false);
      } else if (
        saudiMobileRegex.test(mobilenumData?.toString()) &&
        mobilenumData?.toString()?.length === 10
      ) {
        setCompensateError({ ...compensateError, mobilenum: "" });
        setCompensateData({
          ...compensateData,
          isMobilenum: mobilenumData?.toString(),
        });
        changeHandler("mobilenum", true, mobilenumData);
      }
    }
  }, [languageData]);
  useEffect(()=>{
    (fileData[0] !== null && (compensateData.isIBan === reEnteredIban) && bankName.length > 0 &&
      compensateError.iBan.length === 0) 
    ? changeHandler("iBAN", true,reEnteredIban) : changeHandler("iBAN", false);
  },[fileData,reEnteredIban,bankName,compensateError.iBan]);

  return (
    <div className="px-4 mx-2" data-testid="registerclaimcontact-test">
      <Card className="right-card-register">
        <div className="header">
          <div className="header-content">
            <div className="content">
              <div className="walaa-medium-500 policy-number">
                {languageData?.contact_details}
              </div>
            </div>
          </div>
        </div>

        <div className="row align-self-stretch">
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="row d-flex flex-column">
              <div className="col walaa-regular-400">
                <TypographyAndIcon
                  text={languageData?.mobile_number}
                  required={true}
                  // {/* need to enable this code when mobile num tooltip suggestions received from BA */}
                  // isIcon={true}
                  // iconclasses="register-icn"
                  // tooltip={true}
                  // tooltipdataheader="Type of Cases"
                  // tooltipclasses="popover-cust"
                />
              </div>
              <div className="col">
                <ThemeTextbox
                  name="mobilenum"
                  placeholder={languageData?.placeholder_enter_mobile}
                  type="tel"
                  maxLengthIs={10}
                  value={compensateData?.isMobilenum}
                  onChangehandler={updatedValue}
                  errorValue={compensateError.mobilenum}
                  dataTestId="mobilenum-testid"
                />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="row d-flex flex-column">
              <div className="col walaa-regular-400">
                <TypographyAndIcon text={languageData?.email} />
              </div>
              <div className="col">
                <ThemeTextbox
                  name="emailId"
                  placeholder={languageData?.placeholder_enter_email_id}
                  type="text"
                  value={compensateData?.isEmailId}
                  onChangehandler={updatedValue}
                  errorValue={compensateError.emailId}
                  dataTestId="email-testid"
                />
              </div>
            </div>
          </div>
        </div>
        {(type !== comprehensiveOD ||
          (isOthersCase === OTHERS_CASE_SOURCE_TYPE &&
            type === comprehensiveTP) ||
          (isOthersCase === OTHERS_CASE_SOURCE_TYPE &&
            type === comprehensiveOD &&
            !othersClaimInfo?.isSequenceNo)) && (
          <React.Fragment>
            <hr className="vehicleseq-splitter align-self-stretch my-0" />

            <div className="header">
              <div className="header-content">
                <div className="content">
                  <div className="walaa-medium-500 policy-number">
                    {languageData?.bank_details}
                  </div>
                </div>
              </div>
            </div>

            <div className="row align-self-stretch">
              <div>
                <div className="d-flex flex-row flex-wrap justify-content-between">
                  <div className="iban-textbox">
                    <div className="col walaa-regular-400">
                      <TypographyAndIcon
                        text={languageData?.iban_no}
                        required={true}
                      />
                    </div>
                    <div className="col pt-2">
                      <InputGroup
                        onChange={(e) =>
                          updatedValue(e as React.FormEvent<HTMLDivElement>)
                        }
                      >
                        <Form.Control
                          disabled={showLoaderIcon}
                          placeholder={languageData?.placeholder_enter_iban_num}
                          aria-label="iban"
                          aria-describedby="basic-addon1"
                          className="register-input register-input-hover-border-0 border-end-0 z-0"
                          name="IBan"
                          data-testid="iban-testid"
                          value={compensateData.isIBan}
                          maxLength={24}
                        />
                        <InputGroup.Text
                          id="basic-addon1"
                          className="register-input border-start-0"
                        >
                          {compensateData.isIBan.startsWith("SA") && (
                            <>
                              {showSuccessIcon && (
                                <span className="m-2">
                                  <CheckCircleIcon sx={{ color: "green" }} />
                                </span>
                              )}
                              {showErrorIcon && (
                                <span className="m-2">
                                  <CancelIcon sx={{ color: "red" }} />
                                </span>
                              )}
                              {showLoaderIcon && (
                                <span className="m-2">
                                  <Spinner animation="border" role="status">
                                    <span className="visually-hidden">
                                      {languageData?.loading}
                                    </span>
                                  </Spinner>
                                </span>
                              )}
                            </>
                          )}
                        </InputGroup.Text>
                      </InputGroup>
                      <Form.Text className="validationErrorText">
                        {compensateError.iBan}
                      </Form.Text>
                    </div>
                  </div>

                  {((isValidIban && type !== comprehensiveOD) ||
                    (isValidIban &&
                      isOthersCase === OTHERS_CASE_SOURCE_TYPE)) && (
                    <>
                      <div className="iban-textbox">
                        <div className="col walaa-regular-400">
                          <TypographyAndIcon
                            text={languageData?.re_enter_iban}
                            required={true}
                          />
                        </div>
                        <div>
                          <ThemeTextbox
                            type={"text"}
                            name="reEnteredIban"
                            placeholder={
                              languageData?.placeholder_enter_iban_num as unknown as string
                            }
                            value={reEnteredIban}
                            onChangehandler={handleReEnteredIbanChange}
                            dataTestId="reEnteredIban-testid"
                            maxLengthIs={24}
                          />
                          {/* Display the error message */}
                          {ibanError && (
                            <Form.Text className="validationErrorText position-absolute">
                              {ibanError}
                            </Form.Text>
                          )}
                        </div>
                      </div>
                      <div className="iban-textbox pt-3">
                        <div className="col walaa-regular-400">
                          <TypographyAndIcon
                            text={languageData?.bank as unknown as string}
                            required={true}
                          />
                        </div>
                        <div>
                          <ThemeTextbox
                            type={"text"}
                            name="bankName"
                            placeholder={
                              languageData?.enter_bank_name as unknown as string
                            }
                            value={bankName}
                            onChangehandler={handleBankNameChange}
                            dataTestId="bank-testid"
                            maxLengthIs={30}
                          />
                        </div>
                      </div>{" "}
                    </>
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </Card>

      {((isValidIban && type !== comprehensiveOD) ||
        (isValidIban && isOthersCase === OTHERS_CASE_SOURCE_TYPE)) && (
        <Iban
          fileData={fileData}
          setFileData={setFileData}
          languageData={languageData || {}}
          onChequeLeafUpload={() => setChequeLeafUploaded(true)}
          onChequeLeafRemove={() => setChequeLeafUploaded(false)}
        />
      )}

      {((type !== comprehensiveTP && type !== TRAVEL) ||
        (type === comprehensiveTP &&
          isOthersCase === OTHERS_CASE_SOURCE_TYPE)) && (
        <div className="row">
          <div className="col pt-4">
            <div className="d-flex flex-column">
              <div>{languageData?.additional_remarks}</div>
              <div className="register-contact-estimate-value walaa-medium-500">
                <ThemeTextarea
                  placeholder={languageData?.additional_remarks + "..."}
                  classes="themetextarea-cust"
                  name={languageData?.additional_remarks}
                  onChangehandler={updatedValue}
                  value={compensateData?.isAdditionalRemarks}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDetails;
