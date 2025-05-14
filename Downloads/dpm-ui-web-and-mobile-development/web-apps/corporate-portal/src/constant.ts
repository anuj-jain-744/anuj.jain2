const {
  VITE_CONTENT_BASE_URI: VITE_CONTENT_BASE_URI,
  VITE_BACKEND_BASE_URL: VITE_BACKEND_BASE_URL,
  VITE_GOOGLE_MAPS_EMBED_API_KEY: VITE_GOOGLE_MAPS_EMBED_API_KEY,
  VITE_GOOGLE_MAPS_API_KEY: VITE_GOOGLE_MAPS_API_KEY,
} = import.meta.env;

const commonKeywords = {
  contactUs: "Contact Us",
  arabicContactUs: "اتصل بنا",
  englishLabel: "English",
  arabicLabel: "عربي",
  noResultTitle: "No FAQ found",
  noResultSubTitle: "We could not find any FAQs for current selection !",
  closed: "Closed",
  typeWarning: "type-warning",
  home: "Home",
  personal: "Personal",
  productCode: "HOME",
  productCodeTrvl: "TRVL",
  travel: "Travel",
  en: { home: "Home", faq: "FAQs" },
  ar: { home: "بيت", faq: "الأسئلة الشائعة" },
  mobileDeviceBreakpoint: 767,
  ownerDetail: "ownerDetail",
  ownerId: "ownerId",
  mobileNumber: "mobileNumber",
  addressData: "addressData",
  claimOD: "OD",
  claimTPL: "TPL",
  claimComprehensive: "Comprehensive",
  logoutRoute: "logout",
  loginRoute: "login",
  preferences: "preferences",
  dashboard: "Dashboard",
  user: "User",
  phone: "Phone",
  email: "email",
  webform_actions: "webform_actions",
  personalName: "الأفراد",
};

const cmsAPIRoute: Record<string, string> = {
  corporateHomepage: "corporate-homepage",
  footer: "footer-menu",
  header: "header-menu",
  faqListing: "faqs-listing",
  personalProduct: "products/personal/",
  products: "products",
  services: "services",
  login: "login",
};

const BreakPoints = {
  Tablet_Min: 769,
  Tablet_Max: 1200,
  Inner_Width: 1024,
};

export const workingDays = Object.freeze({
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
});

export const workingPeriod = Object.freeze({
  AM: "AM",
  PM: "PM",
});

const ProductRedirect:{[key: string]: string;} = {
  personal_motor: "/Motor/QuoteAndBuy",
  personal_travel: "/Travel/QuoteAndBuy",
  personal_home: "/Home/QuoteAndBuy",
  health: "health"
}
export const internalRoutes = Object.freeze({
  personalHomeQuote: "/personal/home/quote-buy",
  personalTravelQuote: "Travel/quoteandbuy",
  personalTravelClaimRegister: "/travel/claim/registerclaim",
});

export const apiRoutes = Object.freeze({
  splRoute: "GetNationalAddress/",
  policyList: "/Dashboard/V1/GetPolicyList/",
  validateClaim: "NonMotor/ValidateClaim"
});

export const SECRET_KEY = "AdGcN2KedPmj21Y";
export const othersCaseErrorCode:string = "DTXJCRC4003";
export const sequenceNumberErrorCode:string = "DTXJCRC4001";
export const retrieveCaseErrorCode:string = "DTXSCRS4011";
export const vehicleSequenceNumberIdent:string = "Vehicle_Sequence_No";
export const loginModuleErrorCode = Object.freeze({
  "password": "Password",
  "userId": "UserId",
  "DTXSLOG4001": "DTXSLOG4001",
  "DTXSGOT4002": "DTXSGOT4002",
  "DTXSGOT4003": "DTXSGOT4003",
  "DTXSGOT4004": "DTXSGOT4004",
})

export const formFieldModule = Object.freeze({
  'login':"login",
  'home': "Home"
})

export const viewPassword = {
  "show" : "View Password",
  "hide" : "Hide Password"
}

export {
  VITE_CONTENT_BASE_URI,
  VITE_BACKEND_BASE_URL,
  VITE_GOOGLE_MAPS_EMBED_API_KEY,
  VITE_GOOGLE_MAPS_API_KEY,
  commonKeywords,
  cmsAPIRoute,
  BreakPoints,
  ProductRedirect
};

export const productIDs = {
  motor: "motor",
  travel: "travel",
  home: "home",
  visitor: "visitor",
  medical: "medical",
  domestic_labour: "domestic_labour",
  services: "services",
  faqs: "faqs",
};

export const passwordInput ={
  "new_pasd":"new_pasd",
  "confirm_pasd":"confirm_pasd",
  "RESETPASSWORD": "RESETPASSWORD",
  "login": "login",
}

export const FIELD_NAMES = {
  CLAIM_TYPE: "Claim Type",
  NATIONAL_ID_IQAMA_NO: "National Id / IQAMA No.",
}

export const genderCodes = {
  male: "M",
  female: "F",
};
export const genderIdMap = {
  "1": genderCodes.male,
  "2": genderCodes.female,
};



//Product Codes
export const TRAVEL = "TRVL";
export const MOTOR = "RMTPL";
export const MOTOR_COMP = "RMCOM";
export const HOME = "HOME";
export const TRAVELER= "Traveler";
export const MOTORCOMP = "RMCOM";

export const INVALID_OTP_ERROR_CODE = "DTXSVLD4002";
export const INVALID_MOBILE_ERROR_CODE = "DTXSVLD4003";
export const RESEND_OTP_ERROR_CODE = "DTXSGOT4001";

export const OTP_TIMER = 180;