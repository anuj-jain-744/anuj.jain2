import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./index.scss";
import { Col, Container, Row, Form } from "react-bootstrap";
import { getInputField } from "../../pages/ContactWalaa/inputForm";
import { formFieldData } from "../../pages/ContactWalaa/index";
import EastIcon from "@mui/icons-material/East";
import { callAPI, getRandomString, RootState } from "@dpm/shared-module";
import OTPValidation from "../OTPValidation";
import { AlertBox } from "components/AlertBox";
import { useApiCall } from "@dpm/shared-module";
import { encryptAES, decryptAES, VITE_CONTENT_BASE_URI } from "@dpm/shared-module";
import { claimIdCaseNoValidation } from "@dpm/shared-module";
import { INVALID_OTP_ERROR_CODE } from "constant";
interface IconProps {
  url: string;
  alt: string;
  title: string;
}

interface GenerateOTPPayload {
  sessionSecretID: string;
  ownerID: any;
  claimNoOrCaseRefNo: any;
  lineOfBusiness?: string;
  isLoggedIn?: boolean;
}

interface ValidateOTPPayload {
  otp: string,
  referenceNo: string,
  sessionSecretId: string,
}


export interface CardHeaderProps {
  registerclaim: string;
  registerclaimlink: string;
  trackyourclaim: string;
  trackyourclaimlink: string;
  trackyourclaimdesc: string;
  iconimages: IconProps;
  formInputData: formFieldData[];
}

interface ClaimWidgetProps {
  formHeaderData: CardHeaderProps;
  navigateTo?: (url: string, data: object) => void;
}

interface FormInput {
  [key: string]: string | undefined;
}


export const ClaimWidget: React.FC<ClaimWidgetProps> = ({ formHeaderData, navigateTo }) => {
  const [isAuthenticated, userId] = useSelector((state: RootState) => [
    state.auth.isAuthenticated,
    state.auth.userInfo?.userId,
  ]);
  const [formInput, setFormInput] = useState<FormInput>({
    national_id_iqama_id_corp_id: userId,
  });
  const [formFields, setFormFields] = useState<formFieldData[]>([]);
  const [inputError, setInputErrors] = useState<{ [key: string]: string }>({});
  const [validated, setValidated] = useState<boolean>(false);

  // OTP Modal related states
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string>("")
  const [messageOTP, setMessageOTP] = useState("");
  const [timerResend, setTimerResend] = useState(600);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);

  const [languageData, setLanguageData] = useState();
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });
  const [referenceData, setReferenceData] = useState({ referenceNo: "", sessionSecretId: "" });

  // SMS/E-Mail Link redirection related states
  const [urlState, setUrlState] = useState<{ extractParams: { [key: string]: string }, isValidClaim: boolean }>({
    extractParams: {},
    isValidClaim: false,
  });

  const upLoadLabels = {}

  // const currentUrl = window.location.href; // get actual url & used for encryption


  useEffect(() => {
    // encrypt - decrypt
    const secretkey = "123";
    const urlis = encryptAES(
      "https://wallaqq.com/Motor/QuoteAndBuy/renew/?ownerId=7000736186&claimRefNo=C-WR1-24-310-001166",
      // ownerId=2526837972 ,claimRefNo=C-E00-23-310-000032
      secretkey
    );

    const decryptUrl = decryptAES(urlis, secretkey);

    // get URL parameters
    const queryParams = new URLSearchParams(new URL(decryptUrl).search);
    const extractParams: { [key: string]: string } = {};
    queryParams.forEach((value, key) => { extractParams[key] = value; });

    // setting URL parameters & validations
    const { claimRefNo, ownerId } = extractParams;
    const isValidClaimRefNo = claimRefNo && ownerId ? claimIdCaseNoValidation(claimRefNo, ownerId) : false;
    setUrlState({ extractParams: extractParams, isValidClaim: false });
    // set isValidClaim: isValidClaimRefNo for SMS/E-Mail Link redirection


  }, []);

  // passing URL parameters & validation boolean flag
  const { extractParams, isValidClaim } = urlState;
  const isValidParam = Boolean(extractParams?.ownerId?.trim() && extractParams?.claimRefNo?.trim());

  const fetchData = async () => {
    const response = await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    );
    setLanguageData(response?.config[0]);
  };

  const languageOTPData = {
    otp_info_message: languageData?.enter_otp_code,
    your_otp_will_expire: languageData?.your_otp_will_expire,
    confirm_otp: languageData?.confirm_otp,
    resend_otp: languageData?.resend_otp,
    enter_otp_code: languageData?.enter_otp_code
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFormFields(formHeaderData.formInputData);
  }, [formHeaderData.formInputData]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkIsButtonDisabled = () => {
    const mandatoryFields = formFields.filter(
      (val: formFieldData) => val.field_required
    );
    const mandatoryFieldValues = mandatoryFields.map(
      (val: formFieldData) => formInput[val.field_name]
    );
    return mandatoryFieldValues.every(
      (val) => val !== null && val !== undefined && val !== ""
    );
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    generateClaimTrackOtp();
    return false;
  }


  useEffect(() => {

    if (isValidParam && isValidClaim) {
      OtpTrigger();
    }

  }, [isValidClaim, isValidParam]);

  const generateOtpUrl = "/Motor/Claim/Track/V1/GetClaimDetails/GenerateOtp";

  const { makeApiCall, isLoading: isLoad, errors, data: responseData } = useApiCall<any, any>(8, generateOtpUrl, "post");

  const generateClaimTrackOtp = async () => {

    const sessionSecretID = getRandomString(16); // setting random session ID
    // setSessionID(sessionSecretID); // once sessionSecretID will available make it dynamic

    const urlRequestBody: GenerateOTPPayload = {
      sessionSecretID: sessionSecretID,
      ownerID: extractParams?.ownerId,
      claimNoOrCaseRefNo: extractParams?.claimRefNo,
      lineOfBusiness:"",
      isLoggedIn: false,
    };

      const requestBody: GenerateOTPPayload = {
        sessionSecretID: sessionSecretID, //"02try12001",
        ownerID: formInput.national_id_iqama_id_corp_id,
        claimNoOrCaseRefNo: formInput.case_ref_no_claim_id,
        lineOfBusiness: "",
        isLoggedIn: isAuthenticated
      };

    try {
      setIsLoading(true);
      if (isValidClaim && isValidParam) {
        await makeApiCall(urlRequestBody); // for SMS/E-Mail Link redirection
      }
      else {
        await makeApiCall(requestBody); // for normal OTP generation
      }

    } catch (error) {
      console.error("An error occurred while fetching the data", error);
    } finally {
      setIsLoading(false);
    }

  };

  // for SMS/E-Mail Link OTP trigger
  const OtpTrigger = () => {
    generateClaimTrackOtp();
  };

  useEffect(() => {
    if (responseData) {
      setShowOTPModal(!isAuthenticated);
      if (!isAuthenticated) {
        // refNo set from getRandomString method
        setReferenceData({
          referenceNo: responseData?.referenceNo,
          sessionSecretId: responseData?.sessionSecretId,
        });
      } else {
        navigateTo?.("/Motor/Claim/Track-Your-Claim", {
          trackClaimData: responseData,
        }); // setting data here to pass to next page
      }
    }
    if (errors) {
      setApiErrorMessage({
        title: errors?.messages?.details?.additionalInfo,
        description: errors?.messages?.message_en
      });
      setShowAlertModal(true);
    }
  }, [responseData, errors]);

  useEffect(() => {
    if (otpValue.length === 4) {
      validateOtp();
    }
  }, [otpValue]);


  const validateOtpUrl = "/Motor/Claim/Track/V1/GetClaimDetails/ValidateOtp";

  const { makeApiCall: validateCall, isLoading: validateLoad, errors: validateErrors, data: validateData } = useApiCall<any, any>(8, validateOtpUrl, "post");

  const validateOtp = async () => {
    const requestBody: ValidateOTPPayload = {
      "otp": otpValue,
      "referenceNo": referenceData.referenceNo,
      "sessionSecretId": referenceData.sessionSecretId,
    }
    try {
      setIsLoading(true);
      await validateCall(requestBody);
    } catch (error) {
      console.error("An error occurred while fetching the data", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (validateData) {
      setShowOTPModal(false);
      navigateTo?.("/Motor/Claim/Track-Your-Claim", { trackClaimData: validateData });
      // setting data here to pass to next page

    }

    if (validateErrors) {
      setMessageOTP(validateErrors?.messages?.message_en);
      setErrorCode(validateErrors?.code);
    }
  }, [validateData, validateErrors]);

  const handleReset = () => {
    setOtpValue("");
    setErrorCode("");
    setMessageOTP("")
  }

  const handleResend = () => {
    generateClaimTrackOtp();
  }

  const handleAlertClose = () => {
    setShowAlertModal(false);
  }

  return (
    <>
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleAlertClose}
      />
      <OTPValidation
        showModal={showOTPModal}
        setShowModal={setShowOTPModal}
        setOtpValue={setOtpValue}
        timerResend={timerResend}
        messageOTP={messageOTP}
        languageData={languageOTPData}
        isLoading={isLoading}
        isInputDisabled={errorCode === INVALID_OTP_ERROR_CODE}
        setDisabledBtn={setDisabledBtn}
        handleResend={handleResend}
        handleReset={handleReset}
      />
      <Container fluid id="claim-widget-wrapper">
        <div className="claim-widget">
          <div className="claim-head">
            <a
              href={formHeaderData.registerclaimlink}
              className="walaa-medium-500 col-md-12 col-lg-12 col"
            >
              {formHeaderData.registerclaim}
              <EastIcon className="register-claim-icon" />
            </a>
          </div>
          <div className="claim-body">
            <Row className="claim-content">
              <Col className="claim-icon col-md-2 col-lg-2 col">
                <img
                  src={formHeaderData.iconimages.url}
                  alt={formHeaderData.iconimages.alt}
                  title={formHeaderData.iconimages.title}
                />
              </Col>
              <Col className="claim-text col-md-10 col-lg-10 col">
                <p className="walaa-regular-400">
                  {formHeaderData.trackyourclaimdesc}
                </p>
                {/* noValidate validated={validated} */}
                <Form className="form-claim-track" onSubmit={handleSubmit} >
                  {formFields.map((val) => (
                    <Form.Group controlId="formBasic" key={val.field_name} className="form-group-fields">
                      {getInputField(
                        val.field_type,
                        val,
                        formInput,
                        handleFieldChange,
                        checkIsButtonDisabled,
                        upLoadLabels,
                        inputError,
                        setInputErrors,
                        setValidated,
                      )}
                    </Form.Group>
                  ))}
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </>
  );
};