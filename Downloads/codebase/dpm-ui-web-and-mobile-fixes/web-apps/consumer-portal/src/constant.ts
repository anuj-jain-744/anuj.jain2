interface PremiumObjectKeys {
  [key: string]: string | number | null;
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
export const ADDITIONAL_BENEGITS_AGE_LIMIT = "50";
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
  Yes: "Yes",
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
  homeClaimBenefits: "/Home/Endo/V1/HomeInterestUpdate",
  homeNonMotorFNOL: "NonMotor/FNOL/NonMotorFNOL",
  nonMotorRegistration: "NonMotor/FNOL/nonMotorRegistration",
  homeRejectQuote: "/Home/Dashboard/V1/RejectQuote"
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
export const COMPREHENSIVE_TRAVEL_INSURANCE_CODE = 'CTI';
export const WINTER_SPORTS_COVER_CODE = 'WSC'
export const LICENSE_TYPE = 'License Type';
export const INSURANCE_NAME = 'Insurance Name';
export const NATIONAL_ID = 'NATIONAL_ID';

export const PLACEMENTS = {
  START: "start",
  END: "end",
  TOP: "top",
  BOTTOM: "bottom",
} as const;

export const PREMIUM_DATA: PremiumObjectKeys = {
  agency: 1,
  workShop: 2,
  math: 3,
  thirdParty: null, // third party is not used in home insurance
  walaacare: 1,
  walaacareplus: 2,
  "walaacare+": 2,
  walaacaregold: 3,
  walaacaregoldplus: 4,
  "walaacaregold+": 4,
};

export const SA = "SA";
export const ibanLength = 24;
export const TOTAL_LIMIT = 8;
export const TRAVEL_COVERAAGE_DATA = {
  pearl: 2,
  traveller: 1,
  europe: 5,
  schengen: 4,
  family: 3,
};


export const TRAVEL_COVERAGE_TYPE = {
  type_one: "Worldwide - Traveler",
  type_two: "Worldwide - Pearl",
  type_three: "Worldwide I - Traveler",
  type_four: "Worldwide I - Pearl",
  type_five: "Europe - Schengen",
  type_six: "Europe - Europe",
  type_seven: "Worldwide - Family",
};

export const coverageTypeIdMap = {
  worldwide: "1",
  worldwide1: "2",
  europe: "3"
}

export const coveragePlanTypeIdMap = {
  type1: "1",
  type2: "2",
  type3: "3",
  type4: "4",
  type5: "5",
};

export const travelerTypeIdMap = {
  family: "1",
  self: "2",
};

export const travelerType = {
  self: "self",
  family: "family",
  default: "default-value",
};

export const HOME_SCHEME_CODE = "P1";

export const fileExtension = {
  PDF: "pdf",
  ZIP: "zip",
  DOC: "doc",
  DOCX: "docx",
  JPG: "jpg",
  PNG: "png"
};
export const allFileExtension = ["pdf", "zip", "doc", "docx", "jpg", "png"];

export const TRAVEL_POLICY_TYPE = [
  "",
  "Worldwide",
  "Worldwide I",
  "Europe",
];

export const Home_POLICY_TYPE = [
  "", "Walaa Care", "Walaa Care+", "Walaa Care gold", "Walaa Care Gold+"
];

export const TRAVEL_TYPE = ["", "Family", "Self"];
export const OWNER_OR_TENANT = ["", "Owner(Resident)", "Tenant", "Owner(Non-Resident)"];
export const TRAVEL_PLAN_TYPE = {
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

export const DATE_FORMATS = {
  "DD/MM/YYYY": "DD/MM/YYYY",
  "YYYY-MM-DD": "YYYY-MM-DD"
}

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
export const BankNumDefault: string = "45";
export const Additional_Remarks: string = "Additional Remarks";
export const AdultAge: string = "18";
export const taqderr: string = "taqdeerNo";
export const NOT_VALID_AMOUNT: string = "Not Valid Amount";
export const NOT_VALID_MOBILE: string = "Invalid mobile number";
export const lossDate: string = "LossDate";
export const lossType: string = "LossType";
export const estAmountOthers: string = "EstAmtOthers";
export const submit: string = "Submit";
export const thirdParty: string = "TPL";
export const comprehensive: string = "CP";
export const OTHERS_CASE_SOURCE_TYPE: number = 3;
export const TRANSFERRING_COMPENSATION: string = "Transfering the Compensation";
export const OTHERS_CASE_BANK: string = "Bank Transfer";
export const OTHERS_TITL: string = "other";
export const OTHERS_LIABILITY_PER: string = "liabilityPercentage";
export const lossDescription: string = "Description of Loss";
export const Damage = "Repair";
export const Bank = "Bank";


// restrict the file types to be uploaded
export const inValidExtensions = ["jfif", "jpe", "jif", "jfi"];

export const repairTypeComp = ["workShop", "agency", "math"];
export const repairTypeThird = "thirdParty";

export const motorCoverageTypes = {
  comp: "Comprehensive",
  tp: "ThirdParty",
};

export const repairCond = {
  WORKSHOP: "Workshop Repair",
  MAWTH: "Mawthoq Repair",
  AGENCY: "Agency Repair"
}

export const HOME_COVERAGE_PLANS: string[] = [
  "walaacare",
  "walaacare+",
  "walaacaregold",
  "walaacaregold+",
];

export const HOME_COVERAGE_PLANS_TYPES: {
  [key: string]: string;
} = {
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
  domestic_labour: "domestic_labour",
  domestic: "domestic",
};

export const ZERO_PRICE = "0.00";

export const TRAVELER_TYPE = {
  individual: 2,
  family: 1
}
export const TRAVELER_COVERGE_TYPES = {
  worldwide: 1,
  worldwideusa: 2,
  europe: 3
}
export const travelClaimBufferDurationDays = 28;
export const endorseTypes = {
  cancel: "Cancellation",
};
export const myProfile = {
  'email': "email",
  'mobile': "mobile",
  'bank': "bank",
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
export const TRAVELER = "Traveler";
export const MOTORCOMP = "RMCOM";

// converage codes
export const MRAS = "MRAS";
export const MPAD = "MPAD";
export const MRCR = "MRCR";
export const MGAE_Bahrain = "MGAE-Bahrain";
export const MGAE_GCC = "MGAE-GCC";

export const cancelPolicyIndex = {
  "Home": 95,
  "Travel": 8
}

// Maxmium of Drivers to add for particular vehicle
export const MAX_DRIVERS_TO_ADD = 4;
export const MAX_ADDITIONAL_DRIVERS_TO_ADD = 3;
export const DRIVER_NAME = 'Driver Name';

export const PRODUCTS_INDENTIFIERS = { "01": "RMTPL", "02": "HOME", "03": "TRVL" };

export const PRODUCTS_NAMES = {
  'HOME': 'Home',
  'RMCOM': 'Motor',
  'RMTPL': 'Motor',
  [TRAVEL]: "Travel",
};

export const TRAVELER_DEFAULT_VALUES = {
  passPortNumber: "111111",
  passExpiryDate: "12/01/2025",
};

export const PRODUCTSAPI: {
  [key: string]: {
    viewQuoteNo: number;
    viewQuoteAPI: string;
    viewPolicyNo: number;
    viewPolicyAPI: string;
    productName: string;
  }
} = {
  "01": {
    viewQuoteNo: 2,
    viewQuoteAPI: "/Motor/QuoteAndBuy/V1/viewQuote",
    viewPolicyNo: 25,
    viewPolicyAPI: "/Motor/Dashboard/V1/ViewPolicy",
    productName: "motor",
  },
  "02": {
    viewQuoteNo: 10,
    viewQuoteAPI: "/Home/QuoteAndBuy/V1/View/Quote",
    viewPolicyNo: 10,
    viewPolicyAPI: apiRoutes.homeViewPolicy,
    productName: "home",
  },
  "03": {
    viewQuoteNo: 23,
    viewQuoteAPI: "/Travel/QuoteAndBuy/V1/LoadQuote",
    viewPolicyNo: 25,
    viewPolicyAPI: "/Travel/Dashboard/V1/ViewPolicy",
    productName: "travel",

  }
}

export const PRODUCTS_CODE: { [key: string]: string } = Object.fromEntries(
  [
    ['RMCOM', 'Rmcom', 'rmcom', 'RMTPL', 'Rmtpl', 'rmtpl'],
    ['HOME', 'Home', 'home'],
    ['TRVL', 'trvl', 'Trvl']
  ].flatMap((keys, index) => keys.map(key => [key, (index + 1).toString().padStart(2, '0')]))
);

export const PRODUCTCODE_TRAVEL = '03';
export const PRODUCTCODE_HOME = '02';
export const PRODUCTCODE_MOTOR = "01";
export const NOT_AVAILABLE_TEXT = "Not available"

// consumer OTP wrapper constants
export const INVALID_OTP_ERROR_CODE = "DTXSVLD4002";
export const RESEND_OTP_ERROR_CODE = "DTXSGOT4001";
export const OTP_TIMER = 180;
export const RESEND_OTP_TIMER = 30;
export const OTP_LENGTH = 4;

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
export const CONFIRM_MSG_DELETE = 'Removing this traveler will change total policy payable premium. Do you wish to Proceed?'
export const POPUP_FOR = "deleteConfirmation"
export const SENIOR_CITIZEN_VALIDATION_MSG = 'Traveler(s) aged 80 years and above are not eligible for the current plan. As a result, this senior citizen must be excluded from the existing plan, and a separate Schengen Countries plan needs to be purchased for them. \n \nDo you want to delete this traveler and continue?'
export const INVALID_SENIOR_CITIZEN_DELETED_MSG = (traveller_count: number) => `You have successfully deleted 'Traveler ${traveller_count} - Senior Citizen', and the policy premium has been updated accordingly.`

export const PORTAL = "Portal";
export const TRAVEL_TARIFF_TYPE = {
  general: "General Tariff",
  broker: "Broker Tariff",
};
export const travelMultiTripDurationDays = 180;
export const genderCodes = {
  male: "M",
  female: "F",
};
export const genderIdMap = {
  "1": genderCodes.male,
  "2": genderCodes.female,
};
export const toasterTimout = 5000;
export const dateFormats = {
  date: "DD/MM/YYYY",
  apiDate: "YYYY-MM-DD",
  monthYear: "MM/YYYY",
};

export const pepValues = {
  no: 1, // no pep and no related party
  pep: 2, // pep (politically exposed person)
  relatedParty: 3, // no pep but related party
};
export const HOME_APISOURCE = 'apiSource';

export const ENDORSEMENT_TYPE = {
  ADD_DRIVER: 'addDriver',
  ADD_BENEFITS: 'addBenefits'
};

export const POLICY_EXPIRY_DAYS = 364;

// constants related to Dashboard MyRequest
export const FILTER_TYPES: { [key: string]: string } = {
  ALL: "All",
  ACTIVE: "Active",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

// dahsboard hard coded values
export const DEFAULT_CARD_TOSHOW = 2;

// constants related to Dashboard MyRequest
export const REQUEST_TYPES: { [key: string]: string } = {
  ALL: "All",
  CLAIM: "Claim",
  ENQUIRY: "Enquiry",
  APPROVAL: "Approval",
  CANCELLATION: "Cancellation",
  QUOTATION: "Quotation",
  ENDORSEMENT: "Endorsement",
};
export const TRAVEL_TOTAL_COUNT = 8; //total number of travellers allowed
export const TRAVELER_COVERAGE_TYPE = "Traveler";
export const TRAVELER_COVERAGE_COMPARE = "Traveller";
export const FILE_SIZE_LIMIT = 5;// file size in MB
export const FREE = "Free";

export const docType = {
  Policy: {
    Policy_Schedule: { code: "2" },
    Policy_Confirmation_Letter: { code: "8" },
    Policy_Wording: { code: "309" }, // as Dikesh suggested don't included in the API
    // Memorandum: { code: "141" }, // as Dikesh suggested don't included in the API
    E_Invoice: { code: "356" },
  },
  Endorsement: {
    Endorsement_Letter: { code: "3" },
    Risk_Object_Certificates: { code: "7" },
    Policy_Wording: { code: "309" },
    Endorsement_Schedule_Letter: { code: "500" },
    E_Invoice: { code: "356" },
    Policy_Confirmation_Letter: { code: "8" },
  },
  Quotation: {
    Quotation_Letter: { code: "1" },
    Policy_Schedule_Draft: { code: "2" },
    Risk_Object_Certificates_Draft: { code: "7" },
    Premium_Debit_Note_Draft: { code: "8" },
  },
  ClaimSettlement: {
    Bank_Transfer_Slip: { code: "301", transType: "Claim Settlement" },
    Credit_Debit_Note: { code: "101", transType: "Claim Settlement" },
    Claim_Approval_Form: { code: "308", transType: "Claim Settlement" },
    Discharge_Slip_With_Subro_Wording: { code: "305", transType: "Claim Settlement" },
    Discharge_Slip_Without_Subro_Wording: { code: "306", transType: "Claim Settlement" },
    Transfer_Request: { code: "303", transType: "Claim Settlement" },
  },
  ClaimRegistration: {
    Claim_Rejection_Letter: { code: "164", transType: "Claim Registration" },
    Claim_Acknowledgment_Slip: { code: "159", transType: "Claim Registration" },
    Motor_Claim_Receipt_Letter: { code: "145", transType: "Claim Registration" },
    Motor_Theft_Letter: { code: "503", transType: "Claim Registration" },
  },
  ClaimFieldInvestigation: {
    Motor_Claim_Direction_Letter: { code: "507", transType: "Claim Field Investigation" },
    Motor_Claim_Repair_Approval: { code: "504", transType: "Claim Field Investigation" },
    Motor_Claim_Repair_Authorization: { code: "505", transType: "Claim Field Investigation" },
  },
  ClaimTotalloss: {
    Motor_Claim_Total_Loss_Offer: { code: "169", transType: "Claim Totalloss" },
  },
  ClaimTowing: {
    Motor_Claim_Towing_Letter: { code: "171", transType: "Claim Towing" },
  },
};

export const accessPolicyDocumentTable = {
  Policy: ['Policy Schedule', 'Policy Confirmation Letter', 'E-Invoice'],
  Quotation: ['Quotation Letter'],
  Claims: ['Claim Acknowledgment Slip', 'Bank Transfer Slip', 'Credit/Debit Note', 'Claim Rejection letter'],
};


export const NAME_CHARACTER_LIMIT = 12;
export const DIRECT_PAY = "directpay";

export const NOT_AVAILABLE = "Not available";

export const PAYMENT_INFO = {
  paymentDirect: 100,
  providerCompanyName: "OnlineMotor",
  invoiceVatPercentage: "15%",
  quantity: 1,
  language: 'en',
  webPlatform: 1,
  responseUrl: VITE_BACKEND_UTILITY_URL + "Payment/Redirect",
  WEBHOOK_TYPES: {
    PAYMENT_INITIATED: "PAYMENT_INITIATED",
    PAYMENT_INPROGRESS: "PAYMENT_IN_PROGRESS",
  },
  paymentMethods: {
    SADAD_PAY: "EDAAT",
    CARD_PAY: "directpay"
  },
  generateOTPUrl: 'Payment/InitiatePayment',
  validateOTPUrl: 'Payment/StcURPayVerifyOtp',
  sadadPaymentUrl: 'Payment/CreateSadadInvoice',
};
//Case types for claims
export const CLAIM_CASES = {
  POLICE_CASE: "Police",
  NAJM_CASE: "Najm",
  Other_Case: "Other",
}

// Operator constants for comparison
export const OPERATORS = {
  Operator_Equal: "EQUAL",
  Operator_Greater: "GREATER",
  Operator_Less: "LESS"
}

export const SHOW_DEFAULT_BENEFIT = 4;

export const sessionTimer = {
  SESSION_TIMEOUT: 480, // 8 minutes in seconds
  WARNING_TIME: 120, // 2 minutes in seconds
};

export const DEFAULT_HOME_COVERAGE_CODE = 'CFAP'; // Default coverage code for home insurance
