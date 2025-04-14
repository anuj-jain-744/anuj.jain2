interface PremiumObjectKeys {
  [key: string]: string | number;
}

const {
  VITE_ENDORSEMENT_ADD_BENEFIT_BASE_URL,
  VITE_CONTENT_BASE_URI,
  VITE_BACKEND_UTILITY_URL,
  VITE_GOOGLE_MAPS_API_KEY,
  VITE_POLICY_CANCELLATION_BASE_URL,
  VITE_BACKEND_MOTOR_URL,
  VITE_TRAVEL_POLICY_CANCELLATION_BASE_URL,
  VITE_BACKEND_BASE_URL,
} = import.meta.env;

export {
  VITE_CONTENT_BASE_URI,
  VITE_ENDORSEMENT_ADD_BENEFIT_BASE_URL,
  VITE_BACKEND_UTILITY_URL,
  VITE_GOOGLE_MAPS_API_KEY,
  VITE_POLICY_CANCELLATION_BASE_URL,
  VITE_BACKEND_MOTOR_URL,
  VITE_TRAVEL_POLICY_CANCELLATION_BASE_URL,
  VITE_BACKEND_BASE_URL,
};

export const JAVA_API_ROUTES: Record<string, string> = {
  getVehicleDetails: "/GetVehicleDetails",
  schemeCode: "SchemeCode",
  schemeCodeGenOtp: "Scheme/GenerateOtp",
  schemeCodeValOtp: "Scheme/ValidateOtp",
  redisGetValue: "/Redis/V1/getValue",
  redisSetValue: "/Redis/V2/setValue"
};

export const commonKeywords = Object.freeze({
  ar: "ar",
  No: "No",
  propertyNoLabel: "propertyNo",
  propertyBuildYearLabel: "propertyBuildYear",
  propertyFloorLabel: "propertyFloor",
  propertyTypeLabel: "propertyType",
  propertyNearCoastlineLabel: "propertyNearCoastline",
  warningLabel: "warning",
  weekly: "weekly",
  post: "post",
  rented: "Rented",
  owned: "Owned",
  yrsLabel: " yrs.",
  coastalLine: "question4",
  options: { Yes: true, No: false },
  declareOptions: { true: "Yes", false: "No" },
  contentBenefitsMaxSAR: 75000,
  contentBenefitsMinSAR: 10000,
});

export const apiRoutes = {
  homeCalculatePremium: "/Home/QuoteAndBuy/V1/CalculatePremium",
  homeDirectDraft: "/Home/QuoteAndBuy/V1/directDraft",
  homeViewPolicy: "/Home/Dashboard/V1/ViewPolicy",
  homeClaimBenefits: "/Home/Endo/V1/HomeInterestUpdate"
} as const;

// Some hardcoded values
export const ERROR = "Error";
export const SUCCESS = "Success";
export const INTERNAL_SERVER_ERROR = "Internal Server Error";
export const SOMETHING_WENT_WRONG = "Something went wrong!";
export const DATE_FORMAT = "DD/MM/YYYY";
export const CONTEXT_COMMON_ERROR =
  "useTravelPolicyContext must be used within a TravelPolicyProvider";
export const INVALID_PRICE_FORMAT_ERROR_MSG = 'Invalid price format'

export const PLACEMENTS = {
  START: "start",
  END: "end",
  TOP: "top",
  BOTTOM: "bottom",
} as const;

export const PREMIUM_DATA: PremiumObjectKeys = {
  math: 1,
  workShop: 2,
  agency: 3,
  thirdParty: 3,
  walaacare: 1,
  walaacareplus: 2,
  "walaacare+": 2,
  walaacaregold: 3,
  walaacaregoldplus: 4,
  "walaacaregold+": 4,
};

export const SA = "SA";
export const ibanLength = 24;
export const TRAVEL_COVERAAGE_DATA = {
  pearl: 2,
  traveller: 1,
  europe: 5,
  schengen: 4,
  family: 3,
};

export const TRAVEL_COVERAGE_TYPE = {
  type_one: "Worldwide - Traveller",
  type_two: "Worldwide - Pearl",
  type_three: "Worldwide Except USA & Canada - Traveller",
  type_four: "Worldwide Except USA & Canada - Pearl",
  type_five: "Europe - Schengen",
  type_six: "Europe - Europe",
  type_seven:"Worldwide - Family",
};

export const HOME_SCHEME_CODE = "B3";

export const fileExtension = {
  PDF: "pdf",
  ZIP: "zip",
};

export const TRAVEL_POLICY_TYPE = [
  "",
  "Worldwide",
  "Worldwide Except USA & Canada",
  "Europe",
];

export const Home_POLICY_TYPE = [
  "","Walaa Care","Walaa Care+","Walaa Care gold","Walaa Care Gold+"
];

export const TRAVEL_TYPE = ["", "Family", "Self"];
export const TRAVEL_PLAN_TYPE = {
  world_wide: "worldwide",
  world_wide_except: "worldwideexceptusa&canada",
  europe: "europe",
  type_pearl: "Pearl",
  type_traveller: "Traveler",
  type_europe: "Europe",
  type_schengen: "Schengen",
  type_family: "Family",
};
export const SELECTED = "Select...";
export const LOADING = "Loading...";

export const Chargeable = "Chargeable";

export const CURRENCY = "SAR";

// register-claim hard coded values
// workshop repair and city string
export const WORKSHOP: string = "workshop";
export const CITY: string = "city";
export const OPTION_DEFAULT: string = "NOT_VALID";
export const comprehensiveOD: string = "OD";
export const comprehensiveTP: string = "TPL";
export const IBAN: string = "IBan";
export const Motor: string = "Motor";
export const SeniorCtzAge: string = "65";
export const AdultAge: string = "18";

// restrict the file types to be uploaded
export const inValidExtensions = ["jfif", "jpe", "jif", "jfi"];

export const repairTypeComp = ["workShop", "agency", "math"];
export const repairTypeThird = "thirdParty";

export const HOME_COVERAGE_PLANS: string[] = [
  "walaacare",
  "walaacare+",
  "walaacaregold",
  "walaacaregold+",
];

export const HOME_COVERAGE_PLANS_TYPES: {} = {
  "walaacare": "contents", 
  "walaacare+": "contents",
  "walaacaregold": "buildingcontents",
  "walaacaregold+": "buildingcontents",
};

export const HOME_COVERAGE_PLANS_NAMES: {} = {
  "buildingcontents": "Building + Contents",
  "contents": "Contents",
};

export const productIDs = {
  motor: "motor",
  travel: "travel",
  home: "home",
  medical: "medical",
  domestic_labour: "domestic_labour"
};

export const ZERO_PRICE = "0.00";

export const  TRAVELER_TYPE = {
    individual: 2,
    family: 1
}
export const  TRAVELER_COVERGE_TYPES= {
    worldwide: 1,
    worldwideusa: 2,
    europe:3
}
export const myProfile = {
  'email' : "email",
  'mobile': "mobile",
  'profile': "profile"
}

export const validateDaysToExpiry = 45;

// dashboard hard coded values
export const NO_REQUEST_FOUND = "No requests found";
export const ERROR_LOADING_REQUESTS = "Error loading requests";
export const NA = "N/A";
export const CURRENT_YEAR = new Date().getFullYear(); //
export const MIN_NUMBER_ZERO = 0; // Min Number Zero
export const MIN_VEH_SEQUENCE_NUMBER = 8; // Vehicle Sequence Number Min Length
export const MAX_VEH_SEQUENCE_NUMBER = 11; // Vehicle Sequence Number Max Length
export const MAX_CUSTOM_CARD_NUMBER = 10; // Custom Card Number Max Length
export const MAX_OWNER_ID = 10; // National ID/ Iqama Number Max Length
export const MAX_MODEL_YEAR_DIGIT = 4; //  Model Year Max Length
export const MIN_MODEL_YEAR = 1900; // Min Manufacturing Year
export const MAX_MODEL_YEAR = CURRENT_YEAR; // Max Manufacturing Year
export const PaymentUrl = "/product/insurance-payment/"

//Product Codes
export const TRAVEL = "TRVL";
export const MOTOR = "RMTPL";
export const MOTOR_COMP = "RMCOM";
export const HOME = "HOME";
export const TRAVELER= "Traveler";
export const MOTORCOMP = "RMCOM";

// Maxmium of Drivers to add for particular vehicle
export const MAX_DRIVERS_TO_ADD = 4;
export const MAX_ADDITIONAL_DRIVERS_TO_ADD = 3;


export const PRODUCTS_INDENTIFIERS = {"motor": "RMTPL", "home": "Home", "travel": "TRVL"};

export const PRODUCTS_NAMES = {
  'HOME': 'Home',
  'RMCOM': 'Motor',
  'TRVL': 'Travel'
};

export const TRAVELER_DEFAULT_VALUES = {
  passPortNumber: "111111",
  passExpiryDate: "12/01/2025",
};

export const PRODUCTSAPI = {
  "01": {
    "viewQuoteNo": 2,
    "viewQuoteAPI": "/Motor/QuoteAndBuy/V1/viewQuote",
    "viewPolicyNo": 25,
    "viewPolicyAPI": "/Motor/Dashboard/V1/ViewPolicy",
  },
  "02": {
    "viewQuoteNo": 10,
    "viewQuoteAPI": "/Home/QuoteAndBuy/V1/View/Quote",
    "viewPolicyNo": 10,
    "viewPolicyAPI": apiRoutes.homeViewPolicy,
  },
  "03": {
    "viewQuoteNo": 23,
    "viewQuoteAPI": "/Travel/QuoteAndBuy/V1/LoadQuote",
    "viewPolicyNo": 25,
    "viewPolicyAPI": "/Travel/Dashboard/V1/ViewPolicy",
  }
}

export const PRODUCTS_CODE: { [key: string]: string } = {
  'RMCOM': '01',
  'RMTPL': '01',
  'Home': '02',
  'HOME': '02',
  'TRVL': '03'
};

export const PRODUCTCODE_TRAVEL = '03';
export const PRODUCTCODE_HOME = '02';
export const PRODUCTCODE_MOTOR = "01";
export const NOT_AVAILABLE_TEXT = "Not available"
export const INVALID_OTP_ERROR_CODE = "DTXSVLD4002";
export const RESEND_OTP_ERROR_CODE = "DTXSGOT4001";

export const taskStatus = {
  PENDING: "Pending",
  COMPLETED: "Completed",
}

export const taskConstants = {
  PENDING: "Pending",
  OK: "OK",
  MAX_FILE_SIZE_MB: 10,
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
}

export const validFileTypes = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const PASSPORT_EXP_DATE = 180;
// Delete Confirmation Msg for Travel on Review and payment page
export const CONFIRM_MSG_DELETE = 'Removing this traveller will change total policy payable premium. Do you wish to Proceed?'
export const POPUP_FOR = "deleteConfirmation"
export const TRAVEL_TARIFF_TYPE = {
  general: "General Tariff",
  broker: "Broker Tariff",
};
export const HOME_APISOURCE = 'apiSource';
