const productType: Record<string, string> = {
  motor: "Motor Insurance",
  medical: "Medical Insurance",
  home: "Home Insurance",
  travel: "Travel Insurance",
  domestic_labour: "Domestic Labour Insurance",
};

const cmsAPIRoute: Record<string, string> = {
  corporateHomepage: "corporate-homepage",
  consumerHomepage: "consumerportal-config",
  personal_homeConfig:"home-config",
  paymentConfig: "payment-config",
  footer: "footer-menu",
  header: "header-menu",
  faqListing: "faqs-listing",
  personalProduct: "products/personal/",
  smeProduct: "products/sme/",
  corporateProduct: "products/corporate/",
  products: "products",
  services: "services",
  login: "login",
  newsListing: "news-listing",
  news: "news",
  consumerConfig: "consumerportal-config",
  travelConfig: "travel-config",
  sustainability: "sustainability",
  aboutWalaa: "about-walaa",
  BoardofDirectors: "board-of-directors",
  documentLibrary:"document-library",
  postFeedback: "post-feedback",
  jobsListing: "jobs-listing",
  BoardofManagement: "board-of-management",
  branchLocator: "branch-locator",
  FAQListing: "faq-listing",
  shariaGovernance: "sharia-governance", 
  registerClaim: "register-claim",
  privacyPolicy: "privacy-policy",
  surplus: "surplus",
  trackclaim: "track-claim",
  walaaAcademy: "walaa-academy",
  feature: "feature",
  branches:"branches",
  esgWorld: "esg-world",
};

const commonTexts = Object.freeze({
  loginRoute: "/login",
  chatbotRoute: "/chatbot",
  productsRoute: '/products',
  policyTitle: "policy-title",
  sustainabilityRoute: "/sustainability",
  string: "string",
  ar: {
    products: "منتجات",
    sustainability: "الاستدامة",
  },
  en: {
    products: "Products",
    sustainability: "Sustainability",
  },
})

export const CurrencyText = "SAR";

export { productType, cmsAPIRoute, commonTexts };
