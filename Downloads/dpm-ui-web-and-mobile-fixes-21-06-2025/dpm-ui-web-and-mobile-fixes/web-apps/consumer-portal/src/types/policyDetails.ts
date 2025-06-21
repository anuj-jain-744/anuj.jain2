interface PolicyHolderDetails {
  customerNameEnglish: string;
  customerNameArabic: string;
  dateOfBirth: string;
  gender: string;
  idNumer: string;
  licenseType: number | string;
  address: {
    streetName: string;
    city: string;
    country: string;
    postCode: string;
  };
}
interface PolicyCard {
  customerNameEnglish: string;
  nationalId: string;
  customerNameArabic: string;
  dateOfBirth: string;
  nationality: string;
  mobileNo: string;
  address: {
    streetName: string;
    city: string;
    country: string;
    postCode: string;
    countryInArabic: string;
    buildingNumber: string;
    streetNameInArabic: string;
    districtNameInArabic: string;
    district: string;
    cityInArabic: string;
  };
}

interface PolicyDetails {
  policyNo: string;
  quoteNumber?: string;
  startDate: string;
  expiryDate: string;
  idv?: string;
  coverageName: string;
  travelType?: string;
  prodCode?: string;
  insurerName?: string;
  nationalID?: string;
  travelerName?: string;
  effectiveDate?: string;
  insurerNameArabic?: string;
  mobile?: string;
  email?: string;
}

interface PlanDetails {
  typeOfCoverage: string;
}

interface VehicleDetails {
  registrationPlateNo: string;
  chassisNo: string;
  typeOfChassis: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleSequenceNo: string;
  yearOfManufacture: number;
  vehicleColor: number;
  transmission: number;
  serialNo: string;
  registrationPlateText: string;
  registrationPlateText1?: string;
  registrationPlateText2?: string;
  registrationPlateText3?: string;
  vehicleMakeText?: string;
  vehicleModelText?: string;
  vehicleMakeTextEn?: string;
  vehicleModelTextEn?: string;
  repairCondition?: string;
}

interface PolicyPremiumAndBenefits {
  premiumAmount: string | number;
  sumInsured: string | number;
}

interface VehicleDetailsCMSData {
  [key: string]: string | undefined;
}

// Assuming KeyMapping is defined like this
interface KeyMapping {
  [key: string]: string; // or whatever type you expect the value to be
}

interface GetFormattedValue {
  (key: string, value: any): any;
}

interface HandleVehicleClick {
  (index: number): void;
}

interface Address {
  streetName: string;
  city: string;
  country: string;
  postCode: string;
  buildingNumber: number | string;
  streetNameInArabic?: string;
}

interface HolderDetails {
  [key: string]: string | number | undefined;
}

interface PremiumAndBenefitTitle {
  [key: string]: string | number | undefined;
}

interface RequestBodyReviewPolicy {
  apiSource: string;
  policyNo: string;
  endorsementNo: string;
  isLatestSnapshot: string;
}

interface PolicyDetailsObj {
  policyNumber: string;
  vehicleDetails?: {
    name: string;
    make?: string;
    model?: string;
    plateNumber: string;
    plateNoText1?: string;
    plateNoText2?: string;
    plateNoText3?: string;
    vehicleSequenceNo: string;
    chassisNo: string;
    manufactureYear: number;
    vehicleMakeTextEn?: string;
    vehicleModelTextEn?: string;
    vehicleMakeId?: string | number;
  };
  refundValue: string;
  isAddon?: boolean;
  cancellation?: string;
}

export type {
  PolicyDetailsObj,
  PolicyHolderDetails,
  VehicleDetails,
  PolicyPremiumAndBenefits,
  VehicleDetailsCMSData,
  KeyMapping,
  GetFormattedValue,
  HandleVehicleClick,
  Address,
  HolderDetails,
  PremiumAndBenefitTitle,
  PolicyDetails,
  PlanDetails,
  PolicyCard,
  RequestBodyReviewPolicy
};
