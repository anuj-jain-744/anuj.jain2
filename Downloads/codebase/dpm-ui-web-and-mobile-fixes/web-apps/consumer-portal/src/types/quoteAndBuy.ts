import { ErrorResponse } from "./ErrorResponse";

interface Benefit {
    benefitCategory: string;
    benefitCode: string;
    benefitId: number;
    benefitNameAr: string;
    benefitNameEn: string;
    benefitPrice: number;
    description: string;
    mostPurchased: number;
}

interface PremiumBreakdown {
    amount: number;
    percentage?: number | null;
    sign: number;
    type: string;
}

interface TaxFeeBreakdown {
    amount: number;
    percentage?: number;
    type: string;
}

interface PricingOption {
    deductibleReferenceNo: string;
    deductibleAmount: number;
    finalAmount: number;
    premiumBreakdowns: PremiumBreakdown[];
    premiumDue: number;
    taxFeeBreakdowns: TaxFeeBreakdown[];
}

interface Vehicle {
    sequenceNo: string;
    vehicleMakeEnglishArabic: string;
    vehicleModelEnglishArabic: string;
}

interface PolicyDetails {
    benefits: Benefit[];
    policyEffectiveDate: string;
    policyExpiryDate: string;
    previousPolicyNo: string;
    pricingOptions: PricingOption[];
    quotationDate: string;
    quotationExpiryDate: string;
    renewalInd: string;
    vehicles: Vehicle[];
}

interface Model {
    benefits: Benefit[];
    policyEffectiveDate: string;
    policyExpiryDate: string;
    previousPolicyNo: string;
    pricingOptions: PricingOption[];
    quotationDate: string;
    quotationExpiryDate: string;
    renewalInd: string;
    vehicles: Vehicle[];
  }

  interface Data {
    model: Model;
  }

  interface ApiResponse {
    code: number;
    message: string;
    transactionId: string;
    customerRefNum: string;
    data: Data;
    errors: ErrorResponse[];
  }
  /// this is related to formData
  export interface VehicleDetails {
    plateNumber?: string;
    registrationYear?: number;
    chassisNo?: string;
    majorColor?: string;
    engineSize?: string;
    transmission?: string;
    vehicleDefinitionType?: string;
    vehicleSequenceNo?: string;
    vehicleCustomID?: string;
    features?: {
      adaptiveCruiseControl: boolean;
      cruiseControl: boolean;
      modification: boolean;
    };
    camera?: {
      rearParkingSensor: boolean;
      frontSensor: boolean;
      frontCamera: boolean;
      rearCamera: boolean;
      degreeCamera: boolean;
    };
    safety?: {
      parking: string;
      antiTheftAlarm: string;
      antiLockBrakingSystem: number | string;
      automaticBrakingSystem?: boolean;
    };
    commercialVehicle?: {
      vehicleAxleWeight: number;
      fireExtinguisher: boolean;
    };
  }

  export interface VehicleDetailsResponseData {
    chassisNumber: string;
    logId: string;
    vehicleColour: string;
    manufactureYear: string;
    vehicleOwnerName: string;
    vehicleRegistrationCity: string;
    vehicleLoad: number | null;
    vehicleMakeText: string;
    vehicleModelText: string | null;
    weight: string;
    vehicleOwnerId: string;
    lkVehBodyType: string;
    lkVehicleClassDesc: string;
    vehicleCapacity: string;
    vehicleMakerCode: string;
    vehicleModelCode: string;
    cylinderCapacity: number | null;
    coOwnerFullName: string | null;
    coOwnerId: string | null;
    plateNo: string | null;
    plateNoText1: string | null;
    plateNoText2: string | null;
    plateNoText3: string | null;
    plateType: string | null;
    regCityLocationCode: string | null;
    vehicleRegistrationExpiryDateH: Date | null;
    transmissionType: string;
    engineCapacity: string;
    referenceNo: string;
    admeid: number;
    description: string;
    vehicleValue: number;
    vehicleMaxValue: number;
    vehicleMinValue: number;
    modelYearID: number;
    make: string;
    makeID: number;
    model: string;
    modelID: number;
    spec: string;
    specID: number;
    engineSizeID: number;
    vehicleCylinders: string;
    noOfCylsID: number;
    hp: string;
    hpID: number;
    vehicleBodyType: string;
    bodyTypeID: number;
    transmissionID: number;
    doors: string;
    doorsID: number;
    seats: string;
    seatsID: number;
    finalDrive: string;
    finalDriveID: number;
    vehicleType: string;
    vehicleTypeID: number;
    fuelType: string;
    fuelID: number;
    engineType: string;
    engineTypeID: number;
    axels: string;
    axelsID: number;
    gears: string;
    gearsID: number;
    cubicCapacity: string;
    cubicCapacityID: number;
    additionFeatures?: VehicleDetails;
    vehicleDefinitionType?: string;
    vehicleCustomID?: string;
    vehicleColourEn?: string;
    vehicleMakeTextAr?: string;
    vehicleMakeTextEn?: string;
    vehicleModelTextAr?: string;
    vehicleModelTextEn?: string;
    vehicleMakeId?: string | number;
  }

  export interface DriverDetails {
    maritalStatusCd?: number;
    childrenBelow16?: number;
    driverRelationship?: string | null;
    educationLevel?: number;
    licenseCountry?: string;
    trafficViolations?: string;
    healthConditions?: string;
    najmCaseDetails?: any[];
    validDrivingLicenses?: any[];
    driverID?: string | null;
  }

  export interface DriverDetailsResponseData {
    driverID: string;
    driverIDType: string | null;
    driverName: string;
    driverNameArabic: string;
    dateofBirth: string;
    dateofBirthH: string;
    nationality: string;
    gender: string;
    occupation: string;
    workCompanyName: string | null;
    workCityCode: string | null;
    homeCityCode: string | null;
    homeAddress: string;
    licenseType: number | null;
    licenseYear: number | null;
    licenseExpiryDateH: string | null;
    idIssuePlaceCode: string;
    noOfAccidents: number;
    noOfClaims: number;
    unitNo: string | null;
    buildingNumber: string;
    streetName: string;
    district: string;
    city: string;
    additionalNumber: string;
    postalCode: string;
    healthConditions: string | null;
    trafficViolations: string | null;
    najmCaseDetails?: {[key:string]: string}[];
    validDrivingLicenses?: string[];
    mainDriverInd: string;
    ncdFreeYears: string | null;
    ncdReferenceNo: string | null;
    relation?: string | null;
    relationship?: string | null;
    additionalDriverDetails?: DriverDetails
  }

  export interface OwnerDetailsResponseData {
    message: string,
    isValid: boolean,
    referenceNo: number,
    sessionSecretId: string,
    ownerFullNameEnglish: string,
    ownerFullNameArabic: string,
    ownerDobG: string,
    ownerDobH: string,
    gender: string,
    nationality: string,
    nationalityCode: string,
    mobileNumber?: string,
    ownerId?: string,
    nationalId?: string,
    mobile?: string,
  }


  export interface DriverDetailsMappingFields {
    mainDriverInd: string;
    usagePercentage: number;
    nationality: string;
    driverIDType: number;
    driverID: string;
    driverName: string;
    driverNameArabic: string;
    relation: number;
    dateOfBirth: string;
    dateOfBirthH: string;
    gender: string;
    occupation?: string;
    educationLevel: number;
    maritalStatusCd: number;
    childrenBelow16: number;
    workCompanyName?: string | null;
    workCityCode?: string;
    homeCityCode?: string;
    homeAddress?: string;
    licenseType?: number;
    licenseYear: number;
    licenseExpiryDateH?: string | null;
    idIssuePlaceCode: string;
    ncdReference?: string;
    noOfAccidents: number;
    noOfClaims: number;
    unitNo?: string;
    buildingNumber: string;
    streetName: string;
    district: string;
    city: string;
    additionalNumber: string;
    postalCode: string;
    healthConditions?: string;
    trafficViolations?: string;
    najmCaseDetails?: any[];
    validDrivingLicenses?: any[];
  }

  export interface RenewPolicyDataProps {
    loggedInRenew?: boolean;
    isValidParam: boolean;
    isValidPolicy: boolean;
    ownerDetail?: OwnerDetailsResponseData;
    ownerId: string;
    ownerDObH: string;
    mobileNumber: string;
    customCardNumber?: string;
    modelYear?:string;
    sequenceNumber: string;
    transferOwnerId?: string;
    policyNumber: string;
    nationalId?:string;
    customerNameEnglish?:string;
    customerNameArabic?:string;
    ownerFullNameEnglish?: string,
    ownerFullNameArabic?: string,
    gender?:number;
    nationality?:string;
    dateOfBirth?:string;
  }

  export interface ViewPolicyDataProps {
    expiryDate: string;
    policyNumber: string;
  }

  export interface SuccessPagePolicyData {
    policyNo: string;
    startDate: string;
    expiryDate: string;
    coverageName: string;
    customerNameEnglish: string;
    customerNameArabic: string;
    nationalityId: string;
    mobileNo: string;
    premiumAmount: string;
    sumInsured: string;
    repairCondition: string;
    vehicleMake: string | undefined;
    gender?: string;
    [key: string]: string | undefined;
    deductibleAmount?: string;
  }

  export interface TravelinformationData {
    travelType?: string;
    travelStartDate?: string;
    travelEndDate?: string;
    travelPeriod?: string;
  }

  interface TravelTaxFeeBreakdown {
    amount: number;
    percentage: number | null;
    type: string;
  }

  interface TravelPricingOption {
    finalAmount: number;
    premiumDue: number;
    taxFeeBreakdowns: TravelTaxFeeBreakdown[];
  }

  interface TravelPremiumInfo {
    annualPremium: number;
    finalPremium: number;
    grossPremium: number;
    netPremium: number;
  }

  interface TravelPurchasedCoverage {
    coverageCode: string;
    coverageName: string;
    premiumInfo: TravelPremiumInfo;
  }

  interface TravelAPIModel {
    policyEffectiveDate: string;
    policyExpiryDate: string;
    pricingOptions: TravelPricingOption[];
    purchasedCoverage: TravelPurchasedCoverage[];
    quotationDate: string;
    renewalInd: string;
  }

  interface TravelAPIData {
    model: TravelAPIModel;
    status: string;
  }

  export interface TravelApiResponse {
    pricingOptions: TravelPricingOption[];
    purchasedCoverage: any;
    code: number;
    message: string;
    transactionId: string | null;
    customerRefNum: string | null;
    data: TravelAPIData;
    errors: any;
  }

  export interface OwnerResponseTravel
  {
    ownerFullNameEnglish: string,
    ownerFullNameArabic: string,
    ownerDobG: string,
    ownerDobH: string,
    gender: string,
    nationality: string,
    nationalityCode: string,
    mobileNumber?: string,
    ownerId: string
  }

  export interface TravelCoverageplanResponse {
    coverageTypes:[];
    pricingOptions: TravelPricingOption[];
    code: number;
    message: string;
    transactionId: string | null;
    customerRefNum: string | null;
    data: TravelAPIData;
    errors: any;
  }

  export interface DriverDetailsData {
    maritalStatus: number | string;
    noOfChildren: number,
    driverRelationship: number | string;
    driverEducation: number | string;
    licenseCountry: string | number;
    trafficViolation: string;
    healthCondition: string;
  }

export type { Benefit, PremiumBreakdown, TaxFeeBreakdown, PricingOption, Vehicle, PolicyDetails, ApiResponse };