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
  en: { home: "Home", faq: "FAQs" },
  ar: { home: "بيت", faq: "الأسئلة الشائعة" },
  mobileDeviceBreakpoint: 767,
  ownerDetail: "ownerDetail",
  ownerId: "ownerId",
  mobileNumber: "mobileNumber",
  addressData: "addressData",
  logoutRoute: "logout",
  loginRoute: "login",
  preferences: "preferences",
  dashboard: "Dashboard",
  user: "User",
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

const ProductRedirect = {
  personal_motor: "/Motor/QuoteAndBuy",
  personal_travel: "/Travel/QuoteAndBuy",
  personal_home: "/Home/QuoteAndBuy",
  health: "health"
}
export const internalRoutes = Object.freeze({
  personalHomeQuote: "/personal/home/quote-buy",
  personalTravelClaim: "Travel/quoteandbuy",
});

export const apiRoutes = Object.freeze({
  splRoute: "GetNationalAddress/",
  policyList: "/Dashboard/V1/GetPolicyList/",
  validateClaim: "NonMotor/ValidateClaim"
});

export const loginModuleErrorCode = Object.freeze({
  "password": "Password",
  "userId": "UserId",
  "DTXSGOT4001": "DTXSGOT4001",
  

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
  medical: "medical",
  domestic_labour: "domestic_labour"
};

export const INVALID_OTP_ERROR_CODE = "DTXSVLD4002";
export const RESEND_OTP_ERROR_CODE = "DTXSGOT4001";