// React and Redux Imports
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HOME } from "constant";
import {TRAVEL} from "@consumer-portal/constant"

// Bootstrap Components
import { Button, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";

// Third-Party Libraries
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSpring, animated } from "@react-spring/web";

// Shared Module Utilities
import {
  callAPI,
  getRandomString,
  useApiCall,
  useCommonContext,
  iqmaIdNationalIdValidation,
  useEncryptedUrlParams,
  checkPhoneNumberStarts,
  isValidAlphanumericKey,
  validateHomePoliciesCount,
  RootState,
  capitalizeNameFirstLetter
} from "@dpm/shared-module";

// Material-UI Icons
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  East as EastIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

// Styles
import styles from "../../styles/custom.module.css";
import "./index.scss";

// Assets
import CheckIcon from "../../assets/GetQuoteWidget/CheckIcon.svg";

// Local Components
import { IconsSet } from "../../utils/icons";
import QuoteCarouselItems from "./QuoteCarouselItems";
import { FormsField } from "./FormFields";
import OTPValidation from "../OTPValidation";
import { AlertBox } from "../AlertBox";
import SequenceNum from "./SequenceNum";
import CorpPhoneMail from "./CorpPhoneMail";
import Comprehensive from "@dpm/main-app/src/pages/Motor/Claim/Comprehensive";
import HomeClaimDetails from "@dpm/consumer-portal/src/Home/HomeClaimDetails";

// Constants
import {
  VITE_BACKEND_BASE_URL,
  ProductRedirect,
  apiRoutes,
  commonKeywords,
  internalRoutes,
  RESEND_OTP_ERROR_CODE,
  INVALID_OTP_ERROR_CODE,
  SECRET_KEY,
  othersCaseErrorCode,
  retrieveCaseErrorCode,
  sequenceNumberErrorCode,
  productIDs,
  PRODUCTS_NAMES,
  OTP_TIMER,
  RESEND_OTP_TIMER,
  INVALID_CLAIM_OTP_ERROR_CODE,
  RESEND_OTP_CLAIM_ERROR_CODE,
} from "../../constant";

// Interfaces and Types
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
import { familtyFlowConstants } from '@consumer-portal/components/Travel/constantsTravel';

import { isCrossed48Hours, Najm_Case, replaceMobileNumber,checkMobileNumberStartingWithZero } from "./ClaimTypeUtil";
import { Value } from "react-multi-date-picker";

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

export interface Category {
  form_fields: Field[];
}
export interface Field {
  field_field_class: string;
  field_formfields: string;
}

const getNameForWidget = (producTitle: string, languageData: { [key: string]: string }) => {
  if (producTitle.toLowerCase().includes(productIDs.motor)) {
    return languageData.motor_label;
  } else if (producTitle.toLowerCase().includes(productIDs.travel)) {
    return languageData.travel_label;
  } else if (producTitle.toLowerCase().includes(productIDs.home)) {
    return languageData.home_label;
  } else if (producTitle.toLowerCase().includes(productIDs.medical)) {
    return languageData.medical_label;
  } else if (producTitle.toLowerCase().includes(productIDs.domestic)) {
    return languageData.domestic_workers_health_label;
  } else if (producTitle.toLowerCase().includes(productIDs.visitor)) {
    return languageData.visitor_visa_label;
  } else if (producTitle.toLowerCase().includes(productIDs.protection)) {
    return languageData.protection_saving_label;
  }
}

export const GetQuoteJourneyText = ({ productTitle, languageData }) => {
  const { name } = useSelector((state: RootState) => state.auth?.userInfo) ?? {};
  const { languageData : dashboardCmsDataDetails }  = useSelector((state: RootState) => state.dashbaordLanguageData);
  const productNam: string = (productTitle && getNameForWidget(productTitle, languageData)) || "";

  const text = dashboardCmsDataDetails?.lets_get_started_with_your_insurance_journey
      ? dashboardCmsDataDetails?.lets_get_started_with_your_insurance_journey
      : "";
    const htmlContent = text.replace(
      "<DYNAMIC_NAME>",
      capitalizeNameFirstLetter(name.split(" ")[0])
    );
    const content = htmlContent.replace(
      "<DYNAMIC_PRODUCT>",
      productNam
    );
  return (
  <div className="text-container">
    <span className="text-box">{content}</span>
  </div>
  );
}

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
  setOtherCase,
  backBtnClickHandler,
  othersClaimInfo,
  setOthersClaimInfo,
  productTitle,
  isProducts,
}: GetQuoteWidgetProps) => {

  const { currentLanguage } = useCommonContext();



// use this to check authentication
const isAuthenticated= useSelector((state: RootState) => state.auth?.isAuthenticated);
const { userId } = useSelector((state: RootState) => state.auth?.userInfo) ?? {};
const nationalId = useSelector(
  (state: RootState) => state.auth?.userInfo?.userId
);
const userDetails = useSelector((state: RootState) => state.auth?.userInfo);
const authDetails = useSelector((state: RootState) => state.auth?.authDetails);
const addressInfo = useSelector((state: RootState) => state.addressData);
const [animationOnRest, setAnimationOnRest] = useState(false);
const [missingPayload, setMissingPayload] = useState<PayloadProps | undefined>();

const arabicPlaceholder = Object.values(products)
  .flatMap((categories: Category[]) => categories.flatMap((category: Category) => category.form_fields))
  .filter((field: Field) => field?.field_field_class === "DOB")[0]?.field_formfields;



const navigate = useNavigate();

  const springs = useSpring({
    from: {
      transform: isVisible
        ? "translateX(0%) translateY(100%)"
        : "translateX(0%) translateY(-50%)",
      display: isVisible ? "none" : "block",
    },
    to: {
      transform: isVisible && !multiProduct
        ? "translateX(0%) translateY(-53%)"
        : isVisible ? "translateX(0%) translateY(-62%)"
        :"translateX(0%) translateY(100%)",
      display: isVisible ? "block" : "none",
    },
    config: { tension: 100, friction: 30 },
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
    sessionId?: string;
  }>({
    refNo: "",
    ownerId: "",
    SourceType: 0,
    type: "",
    mailPhone: "",
    sessionId: "",
  });


  const [isSeqNo, setIsSeqNo] = useState<boolean>(false);
  const [resendSeqNo, setResendSeqNo] = useState<string>("");

  // story board decider to show
  const [onContinue, setContinue] = useState<boolean>(false);
  const [onMissingData, setMissingData] = useState<boolean>(false);
  const [validationData, setValidationData] = useState<any>();

  //Corporate phone or mail related states
  const [isCorporatModal, setIsCorporatModal] = useState(false);
  const [cPhoneMail, setcPhoneMail] = useState("");

  // OTP Modal related states
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");
  const [messageOTP, setMessageOTP] = useState("");

  //other case state
  const [otherCase, setIsOtherCase] = useState<boolean>(false);


  //modal dialog handler state
  const [isModal, setShow] = useState<boolean>(false);

  // "timerForResend": 10min,
  const [timerResend, setTimerResend] = useState(OTP_TIMER); // default to 180 seconds (3 minutes)
  const [resendOtpTimer, setResendOtpTimer] = useState(0); // Resend OTP enable timer state configurable

  const [claimCheckData, setClaimCheckData] = useState<any>();
  const [postLoginClaimData, setPostLoginClaimData] = useState<any>();

  // Alert Box related states
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  // SMS/Email OTP related states and functions
  const [extractParams, setExtractParams] = useState<Record<string, string> | null>(null);
  const [urlError, setUrlError] = useState<boolean | null>(null);
  const [paramError, setParamError] = useState<boolean | null>(null);
  const [isValidPolicy, setIsValidPolicy] = useState<boolean>(false);
  const [isValidParam, setIsValidParam] = useState<boolean>(false);

  const validateParams = (value: string | undefined, validator: (val: string) => boolean): boolean =>
    value ? validator(value) : false;

  const location = useLocation();
 const { mobileNumber, productIDs: productName, ownerId, policies, isPolicyCardSelected } = location.state?.data ?? {};

  const validKey = validateParams(SECRET_KEY, (val) => isValidAlphanumericKey(val));

  const { extractParams:hookExtractParams, urlError:hookUrlError , paramError:hookParamError} = useEncryptedUrlParams(location.search, SECRET_KEY);

  // hook call for url parameters
  useEffect(() => {
    if (validKey && location.search) {
      setExtractParams(hookExtractParams);
    }
  }, [validKey, location.search,hookExtractParams ]);

  // setting values for extracted params Errors from hook
  useEffect(() => {
    if(hookUrlError){
      setUrlError(hookUrlError);
    }
    if(hookParamError){
      setParamError(hookParamError);
    }
  }, [hookUrlError,hookParamError]);


  const handleExtractedParams = () => {
    if (extractParams){
      const validOwnerid = validateParams(extractParams?.ownerId, (val) => !iqmaIdNationalIdValidation(val));
      const validOwnerDobH = validateParams(extractParams?.ownerDobH, (val) => /^\d{2}\/\d{4}$/.test(val));
      const validMob = validateParams(extractParams?.mobileNumber, checkPhoneNumberStarts);


      if (validOwnerid && validOwnerDobH && validMob) {
          setIsValidParam(true);
      }
      else {
        setIsValidParam(false);
      }

    }
  }

  const handleError = () => {

  if (urlError) {

    setApiErrorMessage({
      title: languageData?.decryption_failed ?? "",
      description: languageData?.there_was_an_error_decrypt ?? "",
      classes: "type-warning"
    });
    setShowAlertModal(true);
  }


  if (paramError) {
    setApiErrorMessage({
      title: languageData?.no_parameters_found ?? "",
      description: languageData?.the_url_does_not_contain ?? "",
      classes: "type-warning"
    });
    setShowAlertModal(true);
  }


};

useEffect(() => {
  if (location.search) {
    handleExtractedParams();
    handleError();
  }
}, [location.search, extractParams, urlError,paramError]);

  useEffect(() => {
    if (isValidParam) {
      setIsValidPolicy(true);
    }
    else{
      setIsValidPolicy(false);
    }
  }, [isValidParam]);

  useEffect(() => {
    if (isValidPolicy && extractParams?.ownerDobH){
      setIsHizriCalendar(true);
    }
  }, [isValidPolicy,extractParams]);

  useEffect(() => {
    if (isValidPolicy && isHizriCalendar) {
      fetchTrigger();
    }
  }, [isValidPolicy,isHizriCalendar]);

  const fetchTrigger = () => {
    fetchMotorData(false, "" ,isHizriCalendar);
  };


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

  //Api call for OTHERS Claim OTP
  const {
    makeApiCall: makeClaimOthersOTPApiCall,
    isLoading: claimIsLoading,
    errors: claimError,
    data: claimDataOthers,
  } = useApiCall(8, "/Motor/Claim/V1/OtherClaim/ValidateOtp", "post");

  //story board pages enable after others case OTP
  useEffect(() => {
    if (claimDataOthers?.message === "Authentication Success") {
      setShowOTPModal(false);
      setContinue(true);
      setShow(false);
      setIsOtherCase(true);
      if (setShowCardFooter) setShowCardFooter(false);
    }
  }, [claimDataOthers]);

  useEffect(() => {
    if(claimError) {
      setIsLoading(false);
      setErrorCode(claimError?.code || "");
      setMessageOTP(claimError?.messages?.message_en ?? "");
    }
  }, [claimError]);

  //Api call for Register a Claim
  const {
    makeApiCall: claimInitialApiCal,
    isLoading: initialIsLoading,
    errors: initialError,
    data: initialData,
  } = useApiCall(5, "NonMotor/InitiateClaim", "post");

    const {
    makeApiCall: getClaimInitialApiCall,
    isLoading: claimInitialLoading,
    errors: initialClaimError,
    data: initiaClaimlData,
  } = useApiCall(8, "/Motor/Claim/V1/InitiateClaim", "post");

  const {
    makeApiCall: makeClaimInitialApiCall,
    isLoading: claimInitialIsLoading,
    errors: claimInitialError,
    data: claimInitialData,
  } = useApiCall(5, "NonMotor/ValidateClaim", "post");

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
    otp_validity_expired_msg: languageData?.otp_validity_expired_msg,
    otp_verification: languageData?.otp_verification,
    didn_t_receive_otp: languageData?.didn_t_receive_otp,
  };
  const resendOTP: boolean = false;

  const errorTitle = "ERROR";

  const handleFieldChange = (
    fieldName: string,
    value: string | number | Value,
    isValid: boolean,
    fieldType?: string
  ) => {
    setIsPhoneMailData(false);
    if(userId){
      setFormState((prevState) => ({
        ...prevState,
        national_id_iqama_no: {
          value: userId,
          isValid: true
        }
      }));
    }
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
    if (isAuthenticated && userId) {
      setFormState((prevState) => ({
        ...prevState,
        claim_type: { value: languageData?.comprehensive as string, isValid: true },
        national_id_iqama_no: { value: userId, isValid: true },
        case_reference_no: { value: '', isValid: false },
      }));
    }
  }, [isAuthenticated, userId]);

  const formStateValue = () => {
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
        return initialState;
    }
  }
  const allFieldsValid = () => {
    const fields = formStateValue();
    return fields && Object.keys(fields).every(key => formState[key]?.value != "" && formState[key]?.isValid);
  };

  const checkAllFieldsFilled = allFieldsValid();
  useEffect(() => {
    setIsConsentChecked(checkAllFieldsFilled || false);
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
        !isAuthenticated && setFormState(initialState);
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

  // calling initial claim API is user is authenticated and productIds is not empty

  const fetchHomeDataForPostLogin = async () => {
    handleReset();
    await claimInitialApiCal({
        nationalId:  ownerId,
        mobileNo:  checkMobileNumberStartingWithZero(mobileNumber),
        productCode: productName?.toUpperCase(),
        sessionSecretId: getSecretSessionId(),
        isLoggedIn: isAuthenticated,
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && productName ===  productIDs.home) {
        setContinue(true);
        setIsHomeClaim(true);
        await fetchHomeDataForPostLogin();
      }
    };

    fetchData();
  }, [isAuthenticated, productName]);

  useEffect(() => {
    if (isAuthenticated && productName === productIDs.home && isHomeClaim) {

      initialData && setPostLoginClaimData(initialData);
    }
  }, [isAuthenticated, productName, initialData]);

  useEffect(() => {
    if (isAuthenticated && productName === productIDs.travel && isTravelClaim) {
      initialData && initialData?.referenceNo !== null &&
        navigate(internalRoutes.personalTravelClaimRegister, {
          state: {
            policies: policies
          }
        });
    }
  }, [isAuthenticated, productName, initialData]);

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

  const getProductName = (producTitle: string) => {
    if (producTitle.includes(PRODUCTS_NAMES.HOME)) {
      return PRODUCTS_NAMES.HOME;
    } else if (producTitle.includes(PRODUCTS_NAMES.TRVL)) {
      return PRODUCTS_NAMES.TRVL;
    } else return PRODUCTS_NAMES.RMCOM;
  }

  const getNavigationPath = (productName: string) => {
    return (productName === PRODUCTS_NAMES.HOME) ?
     `/personal/${productName}/quote-buy` : `/${productName}/QuoteAndBuy`;
  };

  const getbuyPropsData = () => {
    const propsData = {
      ownerDetail: {
        message: authDetails?.message,
        isValid: authDetails?.isValid,
        referenceNo: authDetails?.referenceNo,
        sessionSecretId: authDetails?.sessionSecretId,
        ownerFullNameEnglish: userDetails?.name,
        ownerFullNameArabic: userDetails?.ownerFullNameArabic,
        ownerDobG: userDetails?.ownerDobG || userDetails?.dateOfBirth || familtyFlowConstants.dobG,
        ownerDobH: userDetails?.ownerDobH,
        gender: userDetails?.gender,
        nationality: userDetails?.nationality,
        nationalityCode: userDetails?.nationalityCode,
        email: userDetails?.email,
      },
      ownerId: userDetails?.userId,
      mobileNumber: userDetails?.mobileNumber,
      addressData: { addresses: addressInfo.addressData },
    };

    return propsData;
  }

  const buyPropsData = getbuyPropsData();

  const getBuyProductData = (productName: string) => {
    switch (productName) {
      case PRODUCTS_NAMES.RMCOM:
        return buyPropsData;
      case PRODUCTS_NAMES.TRVL:
        return buyPropsData;
      case PRODUCTS_NAMES.HOME:
        return buyPropsData;
      case PRODUCTS_NAMES.MEDICAL:
        return null;
      default:
        return buyPropsData;
    }
  }

  const productNam: string = (productTitle && getProductName(productTitle)) || "";

  const handleNavigate = () => {
    const path = getNavigationPath(productNam);
    const data = getBuyProductData(productNam);
    path && navigate(path, {
      state: { data }
    });
  }

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

        if (checkAllFieldsFilled) {
          setIsTravelClaim(true);
          isProducts ? handleNavigate() : await fetchTravelData();
          setTimerResend(OTP_TIMER);
          setResendOtpTimer(RESEND_OTP_TIMER);
        }
      }
      //check all the fields are filled then submit the values to API
      if (activeProduct?.category?.label === commonKeywords?.home && activeProduct?.product?.label === commonKeywords?.personal) {
        if (checkAllFieldsFilled) {
          setIsHomeClaim(true);
          isProducts ? handleNavigate() : await fetchHomeData();
          setTimerResend(OTP_TIMER);
          setResendOtpTimer(RESEND_OTP_TIMER);
        }
      } else {
        await fetchInitiateClaimAPI();
        setTimerResend(OTP_TIMER);
        setResendOtpTimer(RESEND_OTP_TIMER);
      }
    } else isProducts ? handleNavigate() : await fetchMotorData();
    setDisabledBtn(false);
  };

  const handleReset = () => {
    setOtpValue("");
    setErrorCode("");
    setMessageOTP("");
  };

  const handleResend = (resendSessionId: string, missingPayload?: PayloadProps ) => {
    if (customTheme && missingPayload === undefined) {
      fetchInitiateClaimAPI(true, resendSessionId);
    } else if (customTheme && missingPayload) {
      getClaimInitialApiCall(missingPayload);
    }
    else fetchMotorData(true, resendSessionId);
  };

  const convertDate = (currentDate: string) => {
    return currentDate.replace("/", "-");
  };

  const getSecretSessionId = () => {
    const sessionId = getRandomString();
    setSessionId(sessionId);
    return sessionId;
  };

  const fetchMotorData = async (isResend: boolean = false, resendSessionId?: string, isHizriCalendar?: boolean) => {
    const sessionSecretId = isResend && resendSessionId ? resendSessionId : getSecretSessionId();

    handleReset();

    if (isValidPolicy && isValidParam) {
      await makeApiCall({
        ownerId: extractParams?.ownerId, // "2580598681",
        ownerDobG: isHizriCalendar ? null : convertDate(extractParams?.ownerDobG + ""), //"10/1/1999",
        ownerDobH:isHizriCalendar ? convertDate(extractParams?.ownerDobH + "") : null, //"10/1/1999",
        mobileNumber: extractParams?.mobileNumber, //"966547285574",
        sessionSecretId: sessionSecretId,
        policyNumber: extractParams?.policyNumber,
      });
    } else {
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
    }


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
    await claimInitialApiCal({
      nationalId: formState?.national_id_iqama_no?.value,
      mobileNo: formState?.mobile_no?.value,
      productCode: commonKeywords?.productCodeTrvl,
      sessionSecretId: sessionSecretId,
    });
  }

  const fetchInitiateClaimAPI = async (isResend?: boolean, sessionId?: string) => {
    setMissingPayload(undefined);
    const sessionSecretId = isResend && sessionId ? sessionId : getSecretSessionId();
    setApiErrorMessage({ title: "", description: "", classes: "" });
    let SourceType = 1;
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
      sessionId: sessionSecretId,
    });
    try {
      const payload: PayloadProps = {
        caseReportId: formState.case_reference_no.value,
        claimRequestType: ClaimRequestType,
        ownerId: formState.national_id_iqama_no.value,
        sourceType: SourceType,
        mobileNumber: undefined,
        email: undefined,
        isLoggedIn: isAuthenticated,
        sessionSecretId: sessionSecretId,
      };

      if (isSeqNo && resendSeqNo) {
        payload.sequenceNo = resendSeqNo;
      }

      // when owner id starts with 7 AND is a number, then it is a mobile number
      formState?.national_id_iqama_no.value?.toString().startsWith("7") &&
        /^\d*$/.test(cPhoneMail)
        ? (payload.mobileNumber = cPhoneMail)
        : (payload.email = cPhoneMail);

      setIsLoading(true);
      getClaimInitialApiCall(payload);
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

  useEffect(() => {
    if(initiaClaimlData) {
      const ClaimRequestType = formState?.claim_type?.value === "Comprehensive" ? "OD" : "TPL";
      const mobile  = replaceMobileNumber(initiaClaimlData?.mobile);
      const claimCheckData = {
        mobile,
        ...initiaClaimlData,
      }


      if(missingPayload) {
        setClaimCheckData(initiaClaimlData);
        setMissingData(false);
        setShow(false);
        setShowOTPModal(true); // Show the modal for OTP
      } else if (ClaimRequestType === commonKeywords?.claimOD) {
        setClaimCheckData(claimCheckData);
        if (isAuthenticated && userId) {
          setContinue(true);
        } else {
          setShowOTPModal(true); // Show the modal for OTP
        }
        if (setShowCardFooter) setShowCardFooter(true);
        //modal dialog opener state
        setShow(true);
      } else {
        setClaimCheckData(claimCheckData);
        setShowOTPModal(true); // Show the modal for OTP
      }
    }
  }, [initiaClaimlData, missingPayload]);

  useEffect(() => {
    if(missingPayload) {
      getClaimInitialApiCall(missingPayload)
    }
  }, [missingPayload]);

  useEffect(() => {
    if( initialClaimError) {
      switch (initialClaimError?.code) {

        case RESEND_OTP_CLAIM_ERROR_CODE:
          setApiErrorMessage({
            title: initialClaimError?.message,
            description: initialClaimError?.messages?.message_en,
            classes: "type-warning",
          });
          setShowAlertModal(true);
          setShowOTPModal(false);
          setShow(false);
          break;
        case sequenceNumberErrorCode:
        case retrieveCaseErrorCode:
          setMissingData(true);
          setShow(true);
          break;
        case othersCaseErrorCode:
          if (Najm_Case(formState?.case_reference_no?.value as string)) {
            if (
              isCrossed48Hours(formState?.case_reference_no?.value as string)
            ) {
              //setting source type specific to other case
              setClaimsInfo({
                refNo:
                  typeof formState.case_reference_no.value === "string"
                    ? formState.case_reference_no.value
                    : "",
                ownerId:
                  typeof formState.national_id_iqama_no.value === "string"
                    ? formState.national_id_iqama_no.value
                    : "",
                SourceType: 3,
                type:
                  formState?.claim_type?.value === commonKeywords.claimComprehensive
                    ? commonKeywords.claimOD
                    : commonKeywords.claimTPL,
                mailPhone: cPhoneMail,
                sessionId: claimsInfo?.sessionId,
              });
              //setting parent state for title specific
              setOtherCase(true);
              //Vehicle retrieve is failed. redirect to get the input from the user //using the code DTXJCRC4003
              setMissingData(true);
              setShow(true);
              setIsOtherCase(true);
            } else {
              setApiErrorMessage({
                title: initialClaimError?.message,
                description: initialClaimError?.messages?.message_en,
                classes: "type-warning",
              });
              setShowAlertModal(true);
              setIsOtherCase(false);
            }
          } else {
            setClaimsInfo({
              refNo:
                typeof formState.case_reference_no.value === "string"
                  ? formState.case_reference_no.value
                  : "",
              ownerId:
                typeof formState.national_id_iqama_no.value === "string"
                  ? formState.national_id_iqama_no.value
                  : "",
              SourceType: 3,
              type:
                formState?.claim_type?.value === commonKeywords.claimComprehensive ? commonKeywords.claimOD : commonKeywords.claimTPL,
              mailPhone: cPhoneMail,
              sessionId: claimsInfo?.sessionId,
            });
            //setting parent state for title specific
            setOtherCase(true);
            //Vehicle retrieve is failed. redirect to get the input from the user //using the code DTXJCRC4003
            setMissingData(true);
            setShow(true);
            setIsOtherCase(true);
          }
          break;
        default:
          setApiErrorMessage({
            title: initialClaimError?.message,
            description: initialClaimError?.messages?.message_en,
            classes: "type-warning",
          });
          setShowAlertModal(true);
          setShowOTPModal(false);
          setShow(false);
      }
  }
  },[initialClaimError]);
  //Fetch OTP Data
  const fetchOTPData = async (digits: string) => {
    try {
      setIsLoading(true);
      const response: ApiResponse = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateClaim`,
        {
          sessionSecretId: claimsInfo?.sessionId,
          referenceNo: claimCheckData?.referenceNo,
          otp: digits,
        }
      );
      if (response && response?.message && response?.message === "SUCCESS") {
        const mobileNum: string = response?.data?.mobileNo
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
        setErrorCode(response?.errors?.[0]?.code || "");
        setMessageOTP(response?.errors?.[0]?.messages?.message_en || "");
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

  const validateOtp = async () => {
    await makeValidateApiCall({
      otp: otpValue,
      referenceNo: otpResponse?.referenceNo ?? "",
      sessionSecretId: otpResponse?.sessionSecretId ?? "",
    });
  };

  const validateClaim = async () => {
    setIsLoading(true);
    let payload = {
      otp: otpValue,
      referenceNo: otpResponse?.referenceNo ?? "",
      sessionSecretId: otpResponse?.sessionSecretId ?? "",
    }
    if (isHomeClaim) {
      payload = {
        ...payload,
        userId: formState?.national_id_iqama_no?.value,
        productCode: HOME
      }
    }
    await makeClaimInitialApiCall(payload);
  };

  const travelValidateClaim = async () => {
    setIsLoading(true);
    await makeClaimInitialApiCall({
      otp: otpValue,
      referenceNo: otpResponse?.referenceNo ?? "",
      sessionSecretId: otpResponse?.sessionSecretId ?? "",
      productCode: TRAVEL,
      userId: formState?.national_id_iqama_no?.value,
    });
  };
  // otp invoke for others case
  const fetchOTPOTHER = async () => {
    setIsLoading(true);
    await makeClaimOthersOTPApiCall({
      otp: otpValue,
      referenceNo: claimCheckData?.referenceNo,
      sessionSecretId: claimsInfo?.sessionId,
    });
  };

  useEffect(() => {
    if (!isModal) {
      setMissingData(false);
    }
  }, [isModal]);

  useEffect(() => {
    if (customTheme) {
      if (otpValue.length === 4) {
        if (otpValue.length === 4) {
          if (isTravelClaim) {
            travelValidateClaim();
          } else if (isHomeClaim) {
            validateClaim();
          } else {
            otherCase ? fetchOTPOTHER() : fetchOTPData(otpValue);
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
      setResendOtpTimer(parseInt((data as GetOtpResponse)?.resendOtpTimer ?? RESEND_OTP_TIMER)); // Resend OTP button will be enabled after configured seconds from API, default is 30 seconds
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
    if (initialData && !isAuthenticated) {
      setOtpResponse(initialData as GetOtpResponse);
      setShowOTPModal(true);
      setTimerResend(
        parseInt((initialData as GetOtpResponse)?.timerForResend ?? "0")
      );
      setResendOtpTimer(
        parseInt((initialData as GetOtpResponse)?.resendOtpTimer ?? RESEND_OTP_TIMER)
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
          //getNationalAddress();
          formState?.ownerId?.value && validateHomePolicies({
            otp: otpValue,
            referenceNo: otpResponse?.referenceNo ?? "",
            sessionSecretId: otpResponse?.sessionSecretId ?? "",
            userId: formState?.ownerId?.value,
            productCode: HOME
          });
        }
        else if (isValidPolicy && isValidParam){

          navigateTo("/Motor/QuoteAndBuy",
            {
              ownerDetail: validateData,
              mobileNumber: extractParams?.mobileNumber,
              ownerId: extractParams?.ownerId,
              isValidPolicy:isValidPolicy,
              isValidParam:isValidParam,
              ownerDobH: extractParams?.ownerDobH,
              customCardNumber: extractParams?.customCardNumber,
              modelYear:extractParams?.modelYear,
              sequenceNumber: extractParams?.sequenceNumber,
              transferOwnerId: extractParams?.transferOwnerId,
              policyNumber: extractParams?.policyNumber,

          });
        }

       else {
          navigateTo("/Motor/QuoteAndBuy", {
            ownerDetail: validateData,
            ownerId: formState?.ownerId?.value,
            mobileNumber: formState?.mobileNumber?.value
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
          ownerId && validateHomePolicies({
            otp: otpValue,
            referenceNo: otpResponse?.referenceNo ?? "",
            sessionSecretId: otpResponse?.sessionSecretId ?? "",
            userId: ownerId,
            productCode: HOME
          });
        } else if (
          products[activeProduct?.product?.label][0].product_name.toLowerCase().includes(commonKeywords.travel.toLocaleLowerCase())
          || activeProduct?.category?.label.includes(commonKeywords.travel)
        ) {
          navigate(ProductRedirect.personal_travel, {
            replace: true,
            state: {
              data: {
                ownerDetail: validateData,
                ownerId: formState?.ownerId?.value,
                mobileNumber: formState?.mobileNumber?.value,
              }
            }
          });
        } else if(!isValidPolicy) {
          if (navigateToPath)  {
           goTo(ProductRedirect[navigateToPath]);
          } else {
            goTo(ProductRedirect.personal_motor);
          }

        }
      }
    }
  }, [validateIsLoading, validateError, validateData]);

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
      if(isTravelClaim) {
        if(Array.isArray(claimInitialData.policyList) && claimInitialData.policyList.length > 0){
          navigate(internalRoutes.personalTravelClaimRegister, {
            state: {
              userProfileData: { ...claimInitialData },
              policies: claimInitialData.policyList
            }
          })
        }
      } else {
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
    }
  }, [claimInitialIsLoading, claimInitialError, claimInitialData]);

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
        !isAuthenticated && setFormState(initialState);
      if (setProductSelectedTabName) {
        setProductSelectedTabName(productData.product_name);
      }
      !isAuthenticated && setIsConsentChecked(false);
    }
  }, [activeProduct, products]);

  useEffect(() => {
    const firstKey = Object.keys(products)[0];
    const firstProduct = products[firstKey];
    if (firstKey && !isAuthenticated) {
      setActiveProduct((prevState) => ({
        ...prevState,
        product: {
          label: firstKey,
          index: 0,
          category: firstProduct[0]?.category,
        },
        category: { label: products[firstKey][0]?.product_name, index: 0, category: firstProduct[0]?.category },
      }));
    }
  }, [products, isAuthenticated]);

  useEffect(() => {
    // set session id to default
    setClaimsInfo({...claimsInfo, sessionId: getRandomString(16) });
    const handleResize = () => {
      setIsScreenTablet(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setOthersClaimInfo && setOthersClaimInfo({...othersClaimInfo, ClaimType: formState?.claim_type?.value as string });
  }, [formState && formState?.claim_type]);

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
      { languageOTPData && showOTPModal && (
        <OTPValidation
          showModal={showOTPModal}
          setShowModal={setShowOTPModal}
          setOtpValue={setOtpValue}
          otpValue={otpValue}
          timerResend={timerResend}
          resendOtpTimer={resendOtpTimer}
          messageOTP={messageOTP}
          languageData={languageOTPData}
          isLoading={isLoading || validateIsLoading || isClaimLoading}
          isInputDisabled={errorCode === INVALID_OTP_ERROR_CODE || INVALID_CLAIM_OTP_ERROR_CODE === errorCode}
          setDisabledBtn={setDisabledBtn}
          handleResend={() => handleResend(sessionId, missingPayload)}
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
          languageData={languageData}
          setShowModal={setShowOTPModal}
          setClaimCheckData={setClaimCheckData}
          setIsSeqNo={setIsSeqNo}
          setResendSeqNo={setResendSeqNo}
          setMissingData={setMissingData}
          setMissingPayload={setMissingPayload}
          propData={{
            type:
              formState?.claim_type?.value === "Comprehensive" ? "OD" : "TPL",
            module: "motor",
          }}
          claimsInfo={claimsInfo}
          setClaimsInfo={setClaimsInfo}
          othersClaimInfo={othersClaimInfo}
          setOthersClaimInfo={setOthersClaimInfo}
          isOtherCase={otherCase}
          setIsOtherCase={setIsOtherCase}
          formState={formState}
          cPhoneMail={cPhoneMail}
        />
      )}

      {onContinue &&
        setIsFirstPage && !isHomeClaim &&
        formState?.claim_type?.value === "Comprehensive" ? (
          <Comprehensive
            claimCheckData={claimCheckData}
            othersClaimInfo={othersClaimInfo}
            validationData={validationData?.data}
            claimsInfo={claimsInfo}
            setIsFirstPage={setIsFirstPage}
            // backbtn click handler
            backBtnClickHandler={backBtnClickHandle}
          />
        ) : onContinue &&
          ((activeProduct?.category?.label === commonKeywords?.home) || isAuthenticated) ? (
          <HomeClaimDetails
            claimData={isAuthenticated ? postLoginClaimData : claimInitialData}
            languageData={homeLanguageData}
            setIsFirstPage={setIsFirstPage}
            backBtnClickHandler={backBtnClickHandle}
            isPolicyCardSelected={isPolicyCardSelected}
            policies = {policies}
            handleNavigate={navigateTo}
          />
        ) : ( onContinue &&
          <Comprehensive
            claimCheckData={claimCheckData}
            othersClaimInfo={othersClaimInfo}
            validationData={validationData?.data}
            claimsInfo={claimsInfo}
            setIsFirstPage={setIsFirstPage}
            // backbtn click handler
            backBtnClickHandler={backBtnClickHandle}
          />
        )}

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
                  <div className="product-toggle-wrapper-Ui-Tabs">
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
                            role="button" tabIndex={0} onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleToggleClick(
                                    "product",
                                    product,
                                    index,
                                    products[product][0]?.category
                                  )
                              }
                          }}
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
                } ${multiProduct ? "multi-product" : "single-product"} ${isProducts ? "getquote-widget-spacing" : ""}`}
              id="getquote-widget-form-id"
            >
              <Col lg={12}>
                <Row
                  className={`form-wrapper ${!multiProduct ? "gap-16" : ""} ${isProducts ? "form-wrapper-spacing" : ""}`}
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
                                products?.[activeProduct?.product?.label]?.[
                                  activeProduct?.category?.index ?? 0
                                ]?.class_name?.toLowerCase() ?? "defaultIcon"
                                ]
                              }
                                alt="get-quote-dropdown"
                              />
                              {products?.[activeProduct?.product?.label]?.[
                                activeProduct?.category?.index ?? 0
                              ]?.product_name ?? ""}
                            </span>
                            <ExpandMoreIcon />
                          </div>
                        }
                      >
                        {activeProduct?.product?.label &&
                          (products?.[activeProduct?.product?.label] ?? []).map(
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
                    <div className={`${isProducts ? "icon-spacing" : ""} widget-wrapper`}>
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
                                      maxLength={field_maxLength}
                                      isArabic={currentLanguage === "ar"}
                                      arabicPlaceholder={arabicPlaceholder}
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
                      {!isProducts ? activeProduct?.product?.label &&
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
                              field_validation_message,
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
                                  fieldValidationMessage={field_validation_message}
                                  setIsHizriCalendar={setIsHizriCalendar}
                                  refNoTooltip={refNoTooltip}
                                  // format="MM/YYYY"
                                  onFieldChange={handleFieldChange}
                                  languageData={languageData}
                                  productName={
                                    products[activeProduct?.product?.label][
                                      activeProduct?.category?.index
                                    ]?.class_name
                                  }
                                  maxLength={field_maxLength}
                                  isArabic={currentLanguage === "ar"}
                                  arabicPlaceholder={arabicPlaceholder}

                                />
                              </div>
                            </Col>
                          )
                          ) : (<GetQuoteJourneyText productTitle={productTitle} languageData={languageData} />)}
                      <div className={`${isProducts ? "right-quote-btn-spacing" : ""} right-quote-btn`}>
                        <Button
                          className={
                            (!isProducts) && (!(checkAllFieldsFilled && isConsentChecked) ||
                                disabledBtn)
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
                    <img src={CheckIcon} alt="get-quote-dropdown" />
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