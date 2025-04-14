import React, { useState, useRef, useEffect } from "react";
import {
  callAPI,
  getRandomString,
  useApiCall,
  useCommonContext,
  validateHomePoliciesCount,
} from "@dpm/shared-module";
import { Button, Row, Col } from "react-bootstrap";
import "./index.scss";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styles from "../../styles/custom.module.css";
import VerifiedIcon from "@mui/icons-material/Verified";
import EastIcon from "@mui/icons-material/East";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { Value } from "react-multi-date-picker";

import { IconsSet } from "../../utils/icons";
import QuoteCarouselItems from "./QuoteCarouselItems";
import { FormsField } from "./FormFields";
import OTPValidation from "../OTPValidation";
import {
  VITE_BACKEND_BASE_URL,
  ProductRedirect,
  apiRoutes,
  commonKeywords,
  internalRoutes,
  RESEND_OTP_ERROR_CODE,
  INVALID_OTP_ERROR_CODE,
} from "../../constant";
import { useSpring, animated } from "@react-spring/web";
import { AlertBox } from "../AlertBox";
import SequenceNum from "./SequenceNum";
import Comprehensive from "@dpm/main-app/src/pages/Motor/Claim/Comprehensive";
import HomeClaimDetails from "../../../../consumer-portal/src/Home/HomeClaimDetails";
import {
  CarouselButtonGroupProps,
  ApiResponse,
  formStateProps,
  GetOtpResponse,
  GetQuoteWidgetProps,
  ProductDetailToolTip,
  ResponsiveObjectProps,
  PayloadProps,
} from "./getQuoteInterface";
import { useSelector } from 'react-redux';
import { RootState, } from "@dpm/shared-module";

const ENABLE_RESEND_TIME = 600;
import CorpPhoneMail from "./CorpPhoneMail";
// import { Checkbox } from "@mui/material";

const label = { inputProps: { "aria-label": "Consent Checkbox" } };

const responsive: ResponsiveObjectProps = {
  desktop: {
    breakpoint: { max: 1199, min: 995 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 995, min: 768 },
    items: 4,
  },
};

interface ErrorResponse {
  name: string;
  code: string;
  messages: {
    message_en: string;
    message_ar: string;
  };
}
interface APIResponse<D = undefined> {
  code: number;
  message: string;
  data?: D;
  errors?: ErrorResponse[];
}

// Custom button group for carousel
export const ButtonGroup = ({
  next,
  previous,
  carouselState,
}: CarouselButtonGroupProps) => {
  let { currentSlide, totalItems } = { currentSlide: 0, totalItems: 0 };
  if (carouselState) ({ currentSlide, totalItems } = carouselState);
  const currentWidth = window.innerWidth;

  const currentBreakpoint = Object.keys(responsive).find((key) => {
    const { breakpoint } = responsive[key];
    return currentWidth >= breakpoint.min && currentWidth <= breakpoint.max;
  });

  let maxSlides = 1;
  if (currentBreakpoint) {
    const currentResponsiveSettings = responsive[currentBreakpoint];
    maxSlides = currentResponsiveSettings.items;
  }

  const showButtons = totalItems > maxSlides;

  return (
    showButtons && (
      <div className="carousel-button-group">
        <Button
          data-testid="carouselButtonPrevious"
          className={`carousel-button-previous ${currentSlide === 0 ? "disable" : ""
            }`}
          onClick={() => {
            if (previous) {
              previous();
            }
          }}
        >
          <KeyboardArrowLeftIcon
            data-testid="leftArrowicon"
            fontSize="small"
            className={`${styles.arrowprev} ${currentSlide === 0 ? "ondisable" : ""
              }`}
          />
        </Button>
        <Button
          data-testid="carouselButtonNext"
          className={`carousel-button-next ${currentSlide === totalItems - maxSlides ? "disable" : ""
            }`}
          onClick={() => {
            if (next) {
              next();
            }
          }}
        >
          <KeyboardArrowRightIcon
            data-testid="rightArrowicon"
            fontSize="small"
            className={`${styles.arrownext} ${currentSlide === totalItems - maxSlides ? "ondisable" : ""
              }`}
          />
        </Button>
      </div>
    )
  );
};

export const GetQuoteWidget = ({
  disclaimerText = "",
  products,
  tooltip,
  refNoTooltip,
  multiProduct = true,
  customTheme = false,
  isVisible = false,
  setShowCardFooter,
  otpInfo,
  navigateTo,
  languageData,
  homeLanguageData = {},
  setIsFirstPage,
  setProductSelectedTabName,
  backBtnClickHandler,
}: GetQuoteWidgetProps) => {

// use this to check authentication
const isAuthenticated= useSelector((state: RootState) => state.auth?.isAuthenticated);
const userID = useSelector((state: RootState) => state.auth?.userInfo?.userId);
const [animationOnRest, setAnimationOnRest] = useState(false);
  const springs = useSpring({
    from: {
      transform: isVisible
        ? "translateX(0%) translateY(100%)"
        : "translateX(0%) translateY(-50%)",
      display: isVisible ? "none" : "block",
    },
    to: {
      transform: isVisible
        ? "translateX(0%) translateY(-50%)"
        : "translateX(0%) translateY(100%)",
      display: isVisible ? "block" : "none",
    },
    config: { tension: 50, friction: 30 },
    delay: 200,
    onRest: () => {
      setAnimationOnRest(true);
    },
  });

  const [isHizriCalendar, setIsHizriCalendar] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [otpResponse, setOtpResponse] = useState<GetOtpResponse | null>(null);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [activeProduct, setActiveProduct] = useState<{
    [type: string]: {
      label: string;
      index: number;
      category: string;
      className?: string;
    };
  }>({
    product: { label: "", index: 0, category: "" },
    category: { label: "", index: 0, category: "" },
  });
  const [showProductDetailTooltip, setShowProductDetailTooltip] =
    useState<ProductDetailToolTip>({
      show: false,
      index: null,
    });

  const [isHomeClaim, setIsHomeClaim] = useState<boolean>(false);
  const activeTabRef = useRef<HTMLDivElement | null>(null);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [isScreenTablet, setIsScreenTablet] = useState<boolean | null>(null);

  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
    classes: "",
  });

  const [formState, setFormState] = useState<formStateProps>({});

  const [claimsInfo, setClaimsInfo] = useState<{
    refNo: string;
    ownerId: string;
    SourceType: number;
    type: string;
    mailPhone: string;
  }>({
    refNo: "",
    ownerId: "",
    SourceType: 0,
    type: "",
    mailPhone: "",
  });

  // story board decider to show
  const [onContinue, setContinue] = useState<boolean>(false);
  const [onMissingData, setMissingData] = useState<boolean>(false);
  const [validationData, setValidationData] = useState<any>();
  const [isIqmaId, setIsIqmaId] = useState<boolean>(false);

  //Corporate phone or mail related states
  const [isCorporatModal, setIsCorporatModal] = useState(false);
  const [cPhoneMail, setcPhoneMail] = useState("");

  // OTP Modal related states
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const numberOfIncorrectAttempts = 3;
  const [errorCode, setErrorCode] = useState<string>("");
  const [incorrectAttempt, setIncorrectAttempt] = useState(
    numberOfIncorrectAttempts
  );
  const [messageOTP, setMessageOTP] = useState("");

  //modal dialog handler state
  const [isModal, setShow] = useState<boolean>(false);

  // "timerForResend": 10min,
  const [timerResend, setTimerResend] = useState(600);

  const [claimCheckData, setClaimCheckData] = useState<any>();

  // Alert Box related states
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  // Travel register claim related states
  const [isTravelClaim, setIsTravelClaim] = useState<boolean>(false);
  const { makeApiCall, isLoading, errors, data } = useApiCall(
    0,
    "/GetOwnerDetails/GenerateOtp",
    "post"
  );
  const {
    makeApiCall: makeValidateApiCall,
    isLoading: validateIsLoading,
    errors: validateError,
    data: validateData,
  } = useApiCall(0, "/GetOwnerDetails/ValidateOtp", "post");

  const {
    makeApiCall: getNationalAddress,
    isLoading: nationalAddressIsLoading,
    errors: nationalAddressErrors,
    data: addressData,
  } = useApiCall(5, `${apiRoutes.splRoute}${formState?.ownerId?.value}`, "get"); //Get National Address via SPL

  //Api call for Register a Claim
  const {
    makeApiCall: claimInitialApiCal,
    isLoading: initialIsLoading,
    errors: initialError,
    data: initialData,
  } = useApiCall(5, "NonMotor/InitiateClaim", "post");

  const {
    makeApiCall: makeClaimInitialApiCall,
    isLoading: claimInitialIsLoading,
    errors: claimInitialError,
    data: claimInitialData,
  } = useApiCall(5, "NonMotor/ValidateClaim", "post");
  const {
    makeApiCall: getPolicyList,
    isLoading: getPolicyListIsLoading,
    errors: getPolicyListErrors,
    data: policyListData,
  } = useApiCall(11, `${apiRoutes.policyList}${formState?.ownerId?.value}`, "get"); //Get Policy List
  const {
    makeApiCall: validateHomePolicies,
    isLoading: homePoliciesIsLoading,
    errors: homePoliciesErrors,
    data: homePoliciesData,
  } = useApiCall(5, apiRoutes.validateClaim, "post"); //validate total home policies related to nationalid or iqamaid

  //state when carporate ids entered then below state to know capturing of mail / phone data
  const [isPhoneMailData, setIsPhoneMailData] = useState(false);

  //state for showing / hinding the spinner
  const [isClaimLoading, setIsLoading] = useState(false);
// handle class name on dropdown
  const [borderClassName, setBorderClassName] = useState<string>("");
  // OTP Modal related language data
  const languageOTPData = {
    otp_info_message: languageData?.enter_otp_code,
    your_otp_will_expire: languageData?.your_otp_will_expire,
    confirm_otp: languageData?.confirm_otp,
    resend_otp: languageData?.resend_otp,
    enter_otp_code: languageData?.enter_otp_code,
    otp_timedout_three_wrong_attempts_error_msg:
      languageData?.otp_timedout_three_wrong_attempts_error_msg,
    entered_otp_is_invalid: languageData?.entered_otp_is_invalid,
  };

  const errorTitle = "ERROR";

  const handleFieldChange = (
    fieldName: string,
    value: string | number | Value,
    isValid: boolean,
    fieldType: string
  ) => {
    setIsPhoneMailData(false);
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: { value, isValid },
    }));
    if (fieldType === "select") {
      setBorderClassName(value ? "dropdown-border" : "");
    }
  };

  // when user is authenticated, set the national id / iqama no, and claim type to initial state
  useEffect(() => {
    if (isAuthenticated && userID) {
      setFormState((prevState) => ({
        ...prevState,
        claim_type: { value: languageData?.comprehensive as string, isValid: true },
        national_id_iqama_no: { value: userID, isValid: true },
      }));
    }
  }, [isAuthenticated, userID]);
 
  const allFieldsValid = () =>
    Object.values(formState).every(
      (field) => field.value != "" && field.isValid
    );

  const checkAllFieldsFilled = allFieldsValid();

  useEffect(() => {
    setIsConsentChecked(checkAllFieldsFilled);
  }, [checkAllFieldsFilled])

  useEffect(() => {
    // Initialize formState with empty values and valid status
    if (activeProduct?.product?.label) {
      const initialState: formStateProps = {};

      activeProduct?.product?.label &&
        products[activeProduct?.product?.label]?.[
          activeProduct?.category?.index
        ]?.fields?.forEach(({ field_name, field_type }) => {
          if (field_type !== "submit") {
            initialState[field_name] = { value: "", isValid: false };
          }
        });
      setFormState(initialState);
    }
  }, [activeProduct, products]);

  useEffect(() => {
    const firstKey = Object.keys(products)[0];
    if (firstKey) {
      setActiveProduct((prevState) => ({
        ...prevState,
        product: {
          label: firstKey,
          index: 0,
          category: products[firstKey][0]?.category,
        },
      }));
    }
  }, [products]);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenTablet(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const productCategories = Object.keys(products);

  const isFirstTabActive = activeProduct.category.index === 0;

  useEffect(() => {
    if (isPhoneMailData === true) {
      handleRegisterClaim();
    }
  }, [isPhoneMailData]);

  const handleToggleClick = (
    type: string,
    productLabel: string,
    productIndex: number,
    productCategory?: string,
    className?: string
  ) => {
    setActiveProduct((prevState) => ({
      ...prevState,
      [type]: {
        label: productLabel,
        index: productIndex,
        category: productCategory,
        className: className,
      },
      ...(type === "product" && {
        category: { ...prevState.category, index: 0 },
      }),
    }));
  };

  const handleRegisterClaim = async () => {
    setDisabledBtn(true);
    //check all the fields are filled then submit the values to API
    if (customTheme) {
      //check National / Iqama Id if it starts with 7 then get the mail id or phone no first
      if (
        isPhoneMailData === false &&
        typeof formState?.national_id_iqama_no?.value === "string" &&
        formState.national_id_iqama_no.value.toString().startsWith("7")
      ) {
        setIsCorporatModal(true);
        return;
      }
      if(activeProduct?.category?.className?.toLowerCase() === "travel"){

        if (allFieldsValid()) {
          setIsTravelClaim(true);
          await fetchTravelData();
          setTimerResend(ENABLE_RESEND_TIME);
        }
      } 
      //check all the fields are filled then submit the values to API
      if (activeProduct?.category?.label === commonKeywords?.home && activeProduct?.product?.label === commonKeywords?.personal) {
        if (checkAllFieldsFilled) {
          setIsHomeClaim(true);
          await fetchHomeData();
          setTimerResend(ENABLE_RESEND_TIME);
        }
      } else {
        await fetchInitiateClaimAPI();
        setTimerResend(ENABLE_RESEND_TIME);
      }
    } else await fetchMotorData();
    setDisabledBtn(false);
  };

  const handleReset = () => {
    setOtpValue("");
    setErrorCode("");
    setMessageOTP("");
  };

  const handleResend = () => {
    if (customTheme) fetchInitiateClaimAPI();
    else fetchMotorData(true);
  };

  const convertDate = (currentDate: string) => {
    return currentDate.replace("/", "-");
  };

  const getSecretSessionId = () => {
    const sessionId = getRandomString();
    setSessionId(sessionId);
    return sessionId;
  };
  const fetchMotorData = async (isResend: boolean = false) => {
    const sessionSecretId = isResend ? sessionId : getSecretSessionId();

    handleReset();
    await makeApiCall({
      ownerId: formState?.ownerId?.value,
      ownerDobG: isHizriCalendar
        ? null
        : convertDate(formState?.ownerDob?.value + ""),
      ownerDobH: isHizriCalendar
        ? convertDate(formState?.ownerDob?.value + "")
        : null,
      mobileNumber: formState?.mobileNumber?.value,
      sessionSecretId: sessionSecretId,
    });
  };

  // Register Aa claim - Home
  const fetchHomeData = async (isResend: boolean = false) => {
    const sessionSecretId = isResend ? sessionId : getSecretSessionId();
    handleReset();
    await claimInitialApiCal({
      nationalId: formState?.national_id_iqama_no?.value,
      mobileNo: formState?.mobile_no?.value,
      productCode: commonKeywords?.productCode,
      sessionSecretId: sessionSecretId,
    });
  }
  const fetchTravelData = async (isResend: boolean = false) => {
    const sessionSecretId = isResend ? sessionId : getSecretSessionId()
    handleReset();
    await makeApiCall({
      ownerId : formState?.national_id_iqama_no?.value, // "2580598681",
      ownerDobG : "",
      ownerDobH : "",
      mobileNumber: formState?.mobile_no?.value, //"966547285574",
      sessionSecretId: sessionSecretId,
    });
  }

  const fetchInitiateClaimAPI = async () => {
    setApiErrorMessage({ title: "", description: "", classes: "" });
    let SourceType = 0;
    //Najm case fist two character if it is alhphabet then set source type 1
    //otherwise source type is 2
    //If source type =1, CaseReportId is AR No.;
    //If source type =2, CaseReportId is Basheer Accident Number
    //Reference from -- Claim Portal API Document --
    if (
      typeof formState.case_reference_no.value === "string" &&
      /^\d{2}/.test(formState.case_reference_no.value)
    ) {
      SourceType = 2;
    } else {
      SourceType = 1;
    }
    const ClaimRequestType =
      formState?.claim_type?.value === "Comprehensive" ? "OD" : "TPL";
    setClaimsInfo({
      refNo:
        typeof formState.case_reference_no.value === "string"
          ? formState.case_reference_no.value
          : "",
      ownerId:
        typeof formState.national_id_iqama_no.value === "string"
          ? formState.national_id_iqama_no.value
          : "",
      SourceType: SourceType,
      type: formState?.claim_type?.value === "Comprehensive" ? "OD" : "TPL",
      mailPhone: cPhoneMail,
    });
    try {
      let payload: PayloadProps = {
        caseReportId: formState.case_reference_no.value,
        claimRequestType: ClaimRequestType,
        ownerId: formState.national_id_iqama_no.value,
        sourceType: SourceType,
        mobileNumber: undefined,
        email: undefined,
        isLoggedIn: isAuthenticated
      };
      // when owner id starts with 7 AND is a number, then it is a mobile number
      formState?.national_id_iqama_no.value?.toString().startsWith("7") &&
        /^\d*$/.test(cPhoneMail)
        ? (payload.mobileNumber = cPhoneMail)
        : (payload.email = cPhoneMail);

      setIsLoading(true);
      const response: ApiResponse = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/InitiateClaim`,
        payload
      );

      if (response.message === "SUCCESS" || response.code === 1) {
        let mobileNum: string = response?.data?.mobileNo
          ? response?.data?.mobileNo?.toString()
          : "";

        //as per the FSD in next pages we are setting the mobile number starts with 0 instead starts with 966(country code)
        if (mobileNum?.length === 12) {
          const regex = /^966/;
          if (regex.test(mobileNum) && response.data) {
            response.data.mobile = mobileNum.replace(regex, "0");
          }
        }
        setClaimCheckData(response?.data);
        if (ClaimRequestType === "OD") {
            if (isAuthenticated && userID) {
            setContinue(true);
            } else {
            setIncorrectAttempt(numberOfIncorrectAttempts);
            setShowOTPModal(true); // Show the modal for OTP
            }

          if (setShowCardFooter) setShowCardFooter(false);
          //modal dialog opener state
          setShow(true);
        } else {
          setShowOTPModal(true); // Show the modal for OTP
        }
      } else if (
        (response.message === "ERROR" || response.code === 0) &&
        Array.isArray(response?.errors) &&
        response?.errors.length > 0
      ) {
        //Error code DTXJCRC4001 provided by Java team - Need to consider this code for and mark it as Sequence number not available
        //in the database so need to get it from the user
        if (response?.errors[0]?.code === "DTXJCRC4001") {
          setMissingData(true);
          setShow(true);
        } else if (response?.errors[0]?.code === "DTXSCRS4011") {
          //Vehicle retrieve is failed. redirect to get the input from the user //using the code DTXSCRS4011
          setMissingData(true);
          setShow(true);

          //Error code DTXJCRC4003 provided by Java team - Need to consider this Code for OTHER case redirect
          //} else if (response?.errors[0]?.code == "DTXJCRC4003") {
        } else {
          setApiErrorMessage({
            title: response?.message,
            description: response?.errors[0]?.messages?.message_en,
            classes: "type-warning",
          });
          setShowAlertModal(true);
        }
      }
    } catch (error) {
      setApiErrorMessage({
        title: errorTitle,
        description: languageData?.something_went_wrong || "",
        classes: "type-error",
      });
      setShowAlertModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  //Fetch OTP Data
  const fetchOTPData = async (digits: string) => {
    setIncorrectAttempt(incorrectAttempt - 1);
    try {
      setIsLoading(true);
      const response: ApiResponse = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateClaim`,
        {
          referenceNo: claimCheckData?.referenceNo,
          otp: digits,
        }
      );
      if (response && response?.message && response?.message === "SUCCESS") {
        let mobileNum: string = response?.data?.mobileNo
          ? response?.data?.mobileNo?.toString()
          : "";
        //as per the FSD in next pages we are setting the mobile number starts with 0 instead starts with 966(country code)
        if (mobileNum?.length === 12) {
          const regex = /^966/;
          const phoneNumber = mobileNum;
          if (regex.test(phoneNumber) && response.data) {
            response.data.mobile = phoneNumber.replace(regex, "0");
          }
        }
        setContinue(true);
        if (setShowCardFooter) setShowCardFooter(false);
        setValidationData(response);
        setShowOTPModal(false);
      } else {
        setMessageOTP(languageData?.entered_otp_is_invalid ?? "");
      }
    } catch (error) {
      setApiErrorMessage({
        title: errorTitle,
        description: languageData?.something_went_wrong || "",
        classes: "type-error",
      });
      setShowAlertModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHomeOTPData = async () => {
    setIncorrectAttempt(incorrectAttempt - 1);
    try {
      setIsLoading(true);
      setContinue(true);
      if (setShowCardFooter) setShowCardFooter(false);
      setShowOTPModal(false);
    } catch (error) {
      setApiErrorMessage({
        title: errorTitle,
        description: languageData?.something_went_wrong || "",
        classes: "type-error",
      });
      setShowAlertModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTravelClaimData = async (digits: string) => {
    setContinue(true);
    setIncorrectAttempt(incorrectAttempt - 1);
    try {
      setIsLoading(true);
      if (isTravelClaim) {
      const response: ApiResponse = await callAPI("post", VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateClaim`,
        {
          referenceNo: claimCheckData?.referenceNo, otp: digits
        }
       );
      setContinue(true);
      setShowOTPModal(false);
      } else {
        setMessageOTP("Entered OTP is not valid");
      }
      
    } catch (error) {
      console.error("An error occurred while fetching the data", error);
      setApiErrorMessage({
        title: errorTitle,
        description: languageData?.something_went_wrong || "",
        classes: "type-error"
      });
      setShowAlertModal(true);
    }
  }

  const validateOtp = async () => {
    await makeValidateApiCall({
      otp: otpValue,
      referenceNo: otpResponse?.referenceNo ?? "",
      sessionSecretId: otpResponse?.sessionSecretId ?? "",
    });
  };

  const validateClaim = async () => {
    setIsLoading(true);
    await makeClaimInitialApiCall({
      otp: otpValue,
      referenceNo: otpResponse?.referenceNo ?? "",
      sessionSecretId: otpResponse?.sessionSecretId ?? "",
    });
  };

  useEffect(() => {
    isModal === false ? setMissingData(false) : "";
  }, [isModal]);

  useEffect(() => {
    if (customTheme) {
      if (otpValue.length === 4 && incorrectAttempt <= 0) {
        setContinue(false);
      } else {
        if (otpValue.length === 4 && incorrectAttempt > 0) {
          if (isTravelClaim) {
            validateOtp();
          } else if (isHomeClaim) {
            validateClaim();
          } else {
            fetchOTPData(otpValue);
          }
        }
      }
    } else {
      if (otpValue.length === 4) {
        validateOtp();
      }
    }
  }, [otpValue]);

  useEffect(() => {
    if (data) {
      setOtpResponse(data as GetOtpResponse);
      setShowOTPModal(true);
      setTimerResend(parseInt((data as GetOtpResponse)?.timerForResend ?? "0"));
    }
    if (errors) {
      console.error(errors);
      setApiErrorMessage({
        title: errors?.name,
        description: errors.messages?.message_en ?? "",
        classes: "type-warning",
      });
      if (errors.code === RESEND_OTP_ERROR_CODE) setShowOTPModal(false);
      setShowAlertModal(true);

    }
  }, [isLoading, errors, data]);

  useEffect(() => {
    if (initialData) {
      setOtpResponse(initialData as GetOtpResponse);
      setShowOTPModal(true);
      setTimerResend(
        parseInt((initialData as GetOtpResponse)?.timerForResend ?? "0")
      );
    }
    if (initialError) {
      setApiErrorMessage({
        title: initialError?.name,
        description: initialError.messages?.message_en ?? "",
        classes: "type-warning",
      });
      setShowAlertModal(true);
      setDisabledBtn(false);
    }
  }, [initialIsLoading, initialError, initialData]);

  const { currentLanguage } = useCommonContext();

  useEffect(() => {
    if (validateError) {
      setMessageOTP(validateError?.messages?.message_en ?? "");
      setErrorCode(validateError?.code);
    } else if (validateData) {
      if (navigateTo) {
        if (
          activeProduct?.category?.label === commonKeywords.home &&
          activeProduct?.product?.label === commonKeywords.personal
        ) {
          validateHomePolicies({
            otp: otpValue,
            referenceNo: otpResponse?.referenceNo ?? "",
            sessionSecretId: otpResponse?.sessionSecretId ?? "",
          });
        } else {
          navigateTo("/Motor/QuoteAndBuy", {
            ownerDetail: validateData,
            ownerId: formState?.ownerId?.value,
            mobileNumber: formState?.mobileNumber?.value,
          });
        }
      }
    }
  }, [validateIsLoading, validateError, validateData]);

  useEffect(() => {
    if (homePoliciesErrors) {
      setMessageOTP(homePoliciesErrors?.messages?.message_en ?? "");
      setErrorCode(homePoliciesErrors?.code);
      setShowAlertModal(true);
    } else if (homePoliciesData) {
      if (navigateTo) {
        if (
          activeProduct?.category?.label === commonKeywords.home &&
          activeProduct?.product?.label === commonKeywords.personal
        ) {
          const checkHomePolicesCount = validateHomePoliciesCount(
            formState?.ownerId?.value,
            homePoliciesData?.policyList?.length,
            languageData?.active_home_policies
          );
          if (checkHomePolicesCount) {
            handleReset();
            setShowOTPModal(false);
            setShowAlertModal(true);
            setApiErrorMessage({
              title: "",
              description:
                "Active home policies exceed of maximum count specific to National/Iqama ID.",
              //This error message will be dynamic - CMS team adding in api
              classes: commonKeywords.typeWarning,
            });
          } else {
            getNationalAddress();
          }
        } else {
          navigateTo("/Motor/QuoteAndBuy", {
            ownerDetail: validateData,
            ownerId: formState?.ownerId?.value,
            mobileNumber: formState?.mobileNumber?.value,
          });
        }
      }
    }
  }, [homePoliciesIsLoading, homePoliciesErrors, homePoliciesData]);

  const goTo = (location: string) => {
    navigateTo &&
      navigateTo(location, {
        ownerDetail: validateData,
        ownerId: formState?.ownerId?.value,
        mobileNumber: formState?.mobileNumber?.value,
      });
  };

  useEffect(() => {
    if (validateError) {
      setMessageOTP(validateError?.messages?.message_en ?? "");
      setErrorCode(validateError?.code);
    } else if (validateData) {
      const navigateToPath = products[activeProduct?.product?.label][
        activeProduct?.category?.index
      ]?.category
        ? products[activeProduct?.product?.label][
          activeProduct?.category?.index
        ]?.category.toLowerCase()
        : "";
      if (navigateTo) {
        if (
          activeProduct?.category?.label === commonKeywords.home &&
          activeProduct?.product?.label === commonKeywords.personal
        ) {
          validateHomePolicies({
            otp: otpValue,
            referenceNo: otpResponse?.referenceNo ?? "",
            sessionSecretId: otpResponse?.sessionSecretId ?? "",
          });
        } else if (
          products[
            activeProduct?.product?.label
          ][0].product_name.toLowerCase() === "travel"
        ) {
          goTo(ProductRedirect.personal_travel);
        } else {
          if (navigateToPath) {
            goTo(ProductRedirect[navigateToPath]);
          } else {
            goTo(ProductRedirect.personal_motor);
          }
        }
      }
    }
  }, [validateIsLoading, validateError, validateData]);

  useEffect(() => {
    if (formState?.ownerId?.value?.toString()?.startsWith("1")) {
      setIsIqmaId(true);
    } else {
      setIsIqmaId(false);
    }
  }, [formState?.ownerId?.value]);

  const handleNationalAddress = (
    nationalAddressErrors: ErrorResponse | null,
    addressData: ErrorResponse | null
  ) => {
    if (nationalAddressErrors) {
      setShowAlertModal(true);
      setApiErrorMessage({
        title: "",
        description:
          "We are not able to verify your national address. Kindly update your national address from SPL (Saudi Post Limited).",
        //This error message will be dynamic - CMS team adding in api
        classes: commonKeywords.typeWarning,
      });
    }
    if (addressData) {
      if (navigateTo) {
        navigateTo(internalRoutes.personalHomeQuote, {
          ownerDetail: validateData,
          ownerId: formState?.ownerId?.value,
          mobileNumber: formState?.mobileNumber?.value,
          addressData: addressData,
        });
      }
    }
  };

  useEffect(() => {
    handleNationalAddress(nationalAddressErrors, addressData);
  }, [nationalAddressIsLoading, nationalAddressErrors, addressData]);

  useEffect(() => {
    setIsLoading(false);
    if (claimInitialError) {
      setMessageOTP(claimInitialError?.messages?.message_en ?? "");
      setErrorCode(claimInitialError?.code);
    } else if (claimInitialData) {
      if(isHomeClaim){
        setContinue(true);
        if (setShowCardFooter) setShowCardFooter(false);
        setShowOTPModal(false);
      }
      if (navigateTo) {
        navigateTo("/Register-Claim", {
          policyList: claimInitialData,
          nationalId: formState?.ownerId?.value,
          mobileNo: formState?.mobileNumber?.value,
        });
      }
    }
  }, [claimInitialIsLoading, claimInitialError, claimInitialData]);

  const handelTravelPolicyList = (getPolicyListErrors:ErrorResponse | null, policyListData:ErrorResponse | null)=>{
    if(getPolicyListErrors){
      setShowAlertModal(true);
      setApiErrorMessage({
        title: "",
        description: "We are not able to verify your policy. Kindly update your policy from Travel Insurance.",
        //This error message will be dynamic - CMS team adding in api
        classes: commonKeywords.typeWarning,
      });
    }
    if(policyListData){
      if(navigateTo){
          navigateTo(internalRoutes.personalTravelClaim,
            {
            "ownerDetail": validateData,
            "ownerId": formState?.national_id_iqama_no?.value,
            "mobileNumber": formState?.mobile_no?.value,
            "policyListData": policyListData
          });
      }
    }
  }

  useEffect(()=>{
    handelTravelPolicyList(getPolicyListErrors, policyListData);
  },[getPolicyListIsLoading, getPolicyListErrors, policyListData]);


  useEffect(() => {
    // Initialize formState with empty values and valid status
    if (activeProduct?.product?.label) {
      const initialState: formStateProps = {};
      const productData =
        products[activeProduct?.product?.label]?.[
        activeProduct?.category?.index
        ];

      customTheme &&
        activeProduct?.product?.label &&
        productData["fields"]?.forEach(({ field_name, field_type }) => {
          if (field_type !== "submit") {
            initialState[field_name] = { value: "", isValid: false };
          }
        });
      !customTheme &&
        productData &&
        productData["form_fields"]?.forEach(({ field_name }) => {
          initialState[field_name] = { value: "", isValid: false };
        });
      setFormState(initialState);
      if (setProductSelectedTabName) {
        setProductSelectedTabName(productData.product_name);
      }
      setIsConsentChecked(false);
    }
  }, [activeProduct, products]);

  useEffect(() => {
    const firstKey = Object.keys(products)[0];
    const firstProduct = products[firstKey];
    if (firstKey) {
      setActiveProduct((prevState) => ({
        ...prevState,
        product: {
          label: firstKey,
          index: 0,
          category: firstProduct[0]?.category,
        },
        category: { label: products[firstKey][0]?.product_name, index: 0 },
      }));
    }
  }, [products]);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenTablet(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClose = () => {
    setShowAlertModal(false);
    setDisabledBtn(false);
  };

  //Back button Click handler fn
  // on continue reset
  const backBtnClickHandle = () => {
    setContinue(false);
    // call for reset fn
    handleReset();
    setBorderClassName("");
    backBtnClickHandler();
  };
  return (
    <>
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
        classes={apiErrorMessage.classes}
      />
      {(otpInfo || languageOTPData) && (
        <OTPValidation
          showModal={showOTPModal}
          setShowModal={setShowOTPModal}
          setOtpValue={setOtpValue}
          otpValue={otpValue}
          timerResend={timerResend}
          messageOTP={messageOTP}
          languageData={otpInfo || languageOTPData}
          isLoading={isLoading || validateIsLoading || isClaimLoading}
          isInputDisabled={errorCode === INVALID_OTP_ERROR_CODE}
          setDisabledBtn={setDisabledBtn}
          handleResend={handleResend}
          handleReset={handleReset}
        />
      )}
      <CorpPhoneMail
        isCorporatModal={isCorporatModal}
        setIsCorporatModal={setIsCorporatModal}
        setIsPhoneMailData={setIsPhoneMailData}
        cPhoneMail={cPhoneMail}
        setcPhoneMail={setcPhoneMail}
        languageData={languageData}
      />

      {onMissingData && languageData && (
        <SequenceNum
          isModal={isModal}
          setShow={setShow}
          setContinue={setContinue}
          languageData={languageData}
          setValidationData={setValidationData}
          setShowModal={setShowOTPModal}
          setClaimCheckData={setClaimCheckData}
          propData={{
            type:
              formState?.claim_type?.value === "Comprehensive" ? "OD" : "TPL",
            module: "motor",
          }}
          claimsInfo={claimsInfo}
        />
      )}

      {onContinue &&
        setIsFirstPage &&
        (formState?.claim_type?.value === "Comprehensive" ? (
          <Comprehensive
            claimCheckData={claimCheckData}
            validationData={validationData?.data}
            claimsInfo={claimsInfo}
            setIsFirstPage={setIsFirstPage}
            // backbtn click handler
            backBtnClickHandler={backBtnClickHandle}
          />
        ) : onContinue &&
          activeProduct?.category?.label === commonKeywords?.home ? (
          <HomeClaimDetails
            claimData={claimInitialData}
            languageData={homeLanguageData}
            setIsFirstPage={setIsFirstPage}
            backBtnClickHandler={backBtnClickHandle}
          />
        ) : (
          <Comprehensive
            claimCheckData={claimCheckData}
            validationData={validationData?.data}
            claimsInfo={claimsInfo}
            setIsFirstPage={setIsFirstPage}
            // backbtn click handler
            backBtnClickHandler={backBtnClickHandle}
          />
        ))}

      {!onContinue && (
        <animated.div
          style={isVisible ? springs : {}}
          className={`get-a-quote-widget
            ${!multiProduct
              ? "single-product-widget"
              : customTheme
                ? "container-fluid custom-widget"
                : "home-widget"
            }
          `}
        >
          <div
            className={`sticky-bar ${!multiProduct ? "single-product-bar" : ""
              }`}
          >
            {multiProduct && (
              <div className="widget-options">
                {!customTheme && (
                  <div className="product-toggle-wrapper">
                    <div className="product-toggle walaa-medium-500">
                      {productCategories?.length > 0 &&
                        productCategories.map((product, index) => (
                          <div
                            data-testid={`productToggle-${index}`}
                            key={index}
                            className={`${activeProduct?.product?.index === index
                              ? "selected"
                              : "default"
                              }`}
                            onClick={() =>
                              handleToggleClick(
                                "product",
                                product,
                                index,
                                products[product][0]?.category
                              )
                            }
                          >
                            <span>{product}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                <div className="subproduct-wrapper">
                  {isScreenTablet && products[activeProduct?.product?.label] ? (
                    <Carousel
                      responsive={responsive}
                      infinite={false}
                      arrows={false}
                      autoPlay={false}
                      swipeable={true}
                      renderArrowsWhenDisabled={true}
                      renderButtonGroupOutside={true}
                      customButtonGroup={<ButtonGroup />}
                      data-testid="carousel"
                      rtl={currentLanguage === "ar"}
                    >
                      {products[activeProduct?.product?.label] &&
                        Array.isArray(
                          products[activeProduct?.product?.label]
                        ) &&
                        products[activeProduct?.product?.label].map(
                          (
                            { product_name, class_name, category },
                            index: number
                          ) => (
                            <QuoteCarouselItems
                              key={index}
                              showProductDetailTooltip={
                                showProductDetailTooltip
                              }
                              index={index}
                              productName={product_name}
                              className={class_name}
                              activeProduct={activeProduct}
                              activeTabRef={activeTabRef}
                              productCategory={category}
                              handleToggleClick={handleToggleClick}
                              setShowProductDetailTooltip={
                                setShowProductDetailTooltip
                              }
                              data-testid="quoteCarouselItem"
                            />
                          )
                        )}
                    </Carousel>
                  ) : (
                    //  add If condition here ,IF the tablet width below 1024 the below content will come inside  react multi carsoual and else will be normal content as below
                    products[activeProduct?.product?.label] &&
                    products[activeProduct?.product?.label].map(
                      ({ product_name, class_name, category }, index) => (
                        <QuoteCarouselItems
                          key={index}
                          showProductDetailTooltip={showProductDetailTooltip}
                          index={index}
                          productName={product_name}
                          className={class_name}
                          productCategory={category}
                          activeProduct={activeProduct}
                          activeTabRef={activeTabRef}
                          handleToggleClick={handleToggleClick}
                          setShowProductDetailTooltip={
                            setShowProductDetailTooltip
                          }
                          animationDone={animationOnRest ? true : false}
                        />
                      )
                    )
                  )}
                </div>
              </div>
            )}
            <Row
              className={`getquote-widget-form ${isFirstTabActive ? "border-radius" : ""
                } ${multiProduct ? "multi-product" : "single-product"}`}
              id="getquote-widget-form-id"
            >
              <Col lg={12}>
                <Row
                  className={`form-wrapper ${!multiProduct ? "gap-16" : ""}`}
                >
                  {window.innerWidth <= 768 && (
                    <Col sm={12} className="getquote-dropdown-wrapper">
                      <DropdownButton
                        data-testid="dropdownToogleClick-button"
                        title={
                          <div className="getquote-dropdown walaa-regular-400">
                            <span className="walaa-medium-500">
                              <img
                                src={
                                  IconsSet[
                                  activeProduct?.product?.label &&
                                  products[activeProduct?.product?.label][
                                    activeProduct?.category?.index
                                  ]?.class_name
                                  ]
                                }
                                alt="get-quote-dropdown"
                              />
                              {activeProduct?.product?.label &&
                                products[activeProduct?.product?.label][
                                  activeProduct?.category?.index
                                ]?.product_name}
                            </span>
                            <ExpandMoreIcon />
                          </div>
                        }
                      >
                        {activeProduct?.product?.label &&
                          products[activeProduct?.product?.label].map(
                            (
                              { product_name, class_name, category },
                              pIndex
                            ) => (
                              <React.Fragment key={pIndex}>
                                {activeProduct?.product?.label &&
                                  products[activeProduct?.product?.label][
                                    activeProduct?.category?.index
                                  ]?.product_name !== product_name && (
                                    <Dropdown.Item
                                      data-testid="dropdownToogleClick"
                                      onClick={() =>
                                        handleToggleClick(
                                          "category",
                                          product_name,
                                          pIndex,
                                          category
                                        )
                                      }
                                      className="getquote-dropdown-label unactive"
                                    >
                                      <span>
                                        <img
                                          src={
                                            IconsSet[class_name.toLowerCase()]
                                          }
                                          alt="get-quote-dropdown"
                                        />
                                        {product_name}
                                      </span>
                                    </Dropdown.Item>
                                  )}
                              </React.Fragment>
                            )
                          )}
                      </DropdownButton>
                    </Col>
                  )}
                  {!multiProduct && (
                    <div className="widget-wrapper">
                      <div className="widget-product-icon">
                        <span className="desktop-only">
                          <img
                            src={
                              IconsSet[
                              activeProduct?.product?.label &&
                              products[activeProduct?.product?.label] &&
                              products[activeProduct?.product?.label][
                                activeProduct?.category?.index
                              ]?.class_name
                              ]
                            }
                            alt="get-quote-icon"
                          />
                        </span>
                        <span className="tab-only walaa-medium-500">
                          <img
                            src={
                              IconsSet[
                              activeProduct?.product?.label &&
                              products[activeProduct?.product?.label] &&
                              products[activeProduct?.product?.label][
                                activeProduct?.category?.index
                              ]?.class_name
                              ]
                            }
                            alt="get-quote-icon"
                          />
                          <span>
                            {activeProduct?.product?.label &&
                              products[activeProduct?.product?.label] &&
                              products[activeProduct?.product?.label][
                                activeProduct?.category?.index
                              ]?.product_name}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                  {customTheme ? (
                    <React.Fragment>
                      {/* New Response Fields Start */}
                      {activeProduct?.product?.label &&
                        products[activeProduct?.product?.label]?.[
                          activeProduct?.category?.index
                        ]?.fields?.map(
                          (
                            {
                              field_title,
                              field_maxLength,
                              field_type,
                              field_class,
                              field_options,
                              field_name,
                            },
                            index
                          ) => (
                            <React.Fragment key={index}>
                              {field_type !== "submit" ? (
                                <Col
                                  lg={3}
                                  md={6}
                                  sm={12}
                                  className="form-input-field"
                                >
                                  <div className={`form-fields ${field_type} ${field_type === "select" ? borderClassName : ""}`}>
                                    <FormsField
                                      classType={field_class}
                                      fieldType={field_type}
                                      fieldName={field_title}
                                      fieldOptions={field_options}
                                      field_name={field_name}
                                      tooltip={tooltip}
                                      setIsHizriCalendar={setIsHizriCalendar}
                                      refNoTooltip={refNoTooltip}
                                      onFieldChange={(fieldName, value, isValid) => handleFieldChange(fieldName, value, isValid, field_type)}
                                      languageData={languageData}
                                      productName={
                                        products[activeProduct?.product?.label][
                                          activeProduct?.category?.index
                                        ]?.class_name
                                      }
                                      isqmaId={isIqmaId}
                                      maxLength={field_maxLength}
                                    />
                                  </div>
                                </Col>
                              ) : (
                                <div className="right-quote-btn">
                                  <Button className={
                                    (!checkAllFieldsFilled || disabledBtn)
                                      ? `getquote-button disabled`
                                      : `getquote-button`
                                  }
                                    onClick={handleRegisterClaim}
                                  >
                                    <span className="button-label walaa-medium-500">
                                      {field_title}
                                    </span>
                                    <span className="icon">
                                      <EastIcon />
                                    </span>
                                  </Button>
                                </div>
                              )}
                            </React.Fragment>
                          )
                        )}
                      {/* New Response Fields End */}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {/* Old Response Fields Start */}
                      {activeProduct?.product?.label &&
                        products[activeProduct?.product?.label] &&
                        products[activeProduct?.product?.label][
                          activeProduct?.category?.index
                        ]?.form_fields.map(
                          (
                            {
                              field_formfields,
                              field_fieldtype,
                              field_field_class,
                              field_name,
                              field_maxLength,
                            },
                            index
                          ) => (
                            <Col
                              lg={3}
                              md={6}
                              sm={12}
                              key={index}
                              className={`form-input-field col-field ${field_name === "ownerId" ? "width-264" : ""
                                }`}
                            >
                              <div className={`form-fields ${field_fieldtype}`}>
                                <FormsField
                                  classType={field_field_class}
                                  fieldType={field_fieldtype}
                                  fieldName={field_formfields}
                                  field_name={field_name}
                                  tooltip={tooltip}
                                  setIsHizriCalendar={setIsHizriCalendar}
                                  refNoTooltip={refNoTooltip}
                                  format="MM/YYYY"
                                  onFieldChange={handleFieldChange}
                                  languageData={languageData}
                                  productName={
                                    products[activeProduct?.product?.label][
                                      activeProduct?.category?.index
                                    ]?.class_name
                                  }
                                  isqmaId={isIqmaId}
                                  maxLength={field_maxLength}
                                />
                              </div>
                            </Col>
                          )
                        )}
                      <div className="right-quote-btn">
                        <Button
                          className={
                            !(checkAllFieldsFilled && isConsentChecked) ||
                                disabledBtn
                              ? `getquote-button disabled`
                              : `getquote-button`
                          }
                          onClick={handleRegisterClaim}
                        >
                          <span className="button-label walaa-medium-500">
                            {activeProduct?.product?.label &&
                              products[activeProduct?.product?.label] &&
                              products[activeProduct?.product?.label][
                                activeProduct?.category?.index
                              ]?.button_text}
                          </span>
                          <span className="icon">
                            <EastIcon />
                          </span>
                        </Button>
                      </div>
                      {/* Old Response Fields End */}
                    </React.Fragment>
                  )}
                </Row>
              </Col>
              {disclaimerText && (
                <Col lg={12}>
                  <div
                    className={`consent-tab ${isConsentChecked ? "checked" : "unchecked"
                      }`}
                  >
                    <div className="checkbox-wrapper">
                      {!isConsentChecked && (
                        <input
                          aria-label="disclaimerConsent"
                          data-testid="disclaimerRadio"
                          type="radio"
                          id="consent"
                          name="consent"
                          onChange={() => setIsConsentChecked(true)}
                        />
                      )}
                      {isConsentChecked && (
                        <VerifiedIcon
                          data-testid="verifiedIcon"
                          onClick={() => setIsConsentChecked(false)}
                        />
                      )}
                    </div>
                    <span className="walaa-regular-400">{disclaimerText}</span>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </animated.div>
      )}
    </>
  );
};
