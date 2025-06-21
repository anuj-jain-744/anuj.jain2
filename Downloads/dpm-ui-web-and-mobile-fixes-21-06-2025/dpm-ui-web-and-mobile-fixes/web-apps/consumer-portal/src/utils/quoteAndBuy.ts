
import { isValidCalendarDate } from "./formatDate";
import { getFullAge } from "./getFullAge";
import { subtractDates } from "./subtractDates";
import {
  DriverDetails,
  DriverDetailsMappingFields,
  DriverDetailsResponseData,
} from "types/quoteAndBuy";
import { CalculatePremiumApiPayload } from "types/HomeCalculatePremiumApiPayload";
import maleProfileIcon from "assets/QuoteAndBuy/userIcon.svg";
import femaleProfileIcon from "assets/common/female_profile.png";
import { genderCodes } from "../constant";
import { familtyFlowConstants } from "components/Travel/constantsTravel";
import { NOT_APPLICABLE, capitalizeNameFirstLetter } from '@dpm/shared-module';
import { DateObject } from "react-multi-date-picker";
import { LanguageData } from "types/languageData";
import { VehicleDetailsResponseData } from "types/quoteAndBuy";


function geteDriverRelation(relationCode: number, isEndrosement: boolean = false): string {
  const relationMapping = [
    ...(isEndrosement ? [" "] : []),
    "Family member",
    "Friend",
    "Private driver",
    "None"
  ];
  if (relationCode >= 0 && relationCode < relationMapping.length) {
    return relationMapping[relationCode];
  } else {
    return "Invalid relation code";
  }
}

export const driverRelationMappingValue = (
  relation: string | undefined
): number => {
  if (!relation) {
    return 3;
  }
  switch (relation) {
    case "Family member":
      return 0;
    case "Friend":
      return 1;
    case "Private driver":
      return 2;
    case "None":
      return 3;
    default:
      return 3;
  }
};

function updateRenewalCalculatePremiumPayload(renewalPolicy: { coverageType: string, selectedBenefits: [], contentBenefits: [] }, payload: { policyRisk: [] }) {
  const updatedPayload = deepCopy(payload);
  if (renewalPolicy.selectedBenefits) {
    updatedPayload.policyRisk[0].policyCoverage = [...updatedPayload.policyRisk[0].policyCoverage, ...renewalPolicy.selectedBenefits];
  }
  if (renewalPolicy.contentBenefits) {
    updatedPayload.policyRisk[0].policyCoverage[0]['declarationItem'] = renewalPolicy.contentBenefits
  }
  return updatedPayload;
}

function updateRedisDataCalculatePremiumPayload(selectedCoveragePayload: { policyRisk: [] }, payload: { policyRisk: [] }) {
  const updatedPayload = deepCopy(payload);
  updatedPayload.policyRisk = selectedCoveragePayload.policyRisk;
  return updatedPayload;
}

function updateCalculatePremiumPayload(field: string, value: any, payload: any) {

  const updatedPayload = deepCopy(payload);

  if (!updatedPayload.policyRisk) {
    updatedPayload.policyRisk = {};
  }

  if (field === 'repairCondition') {
    updatedPayload.policyRisk.repairCondition = value;
  } else if (field === 'planCode') {
    updatedPayload.planCode = value;
  } else {
    payload = {
      ...payload,
      [field]: value
    };
  }

  return updatedPayload;
}

export function updateTravelGenerateQuotePayload(field: string, value: any, payload: any) {
  if (field === "email") {
    payload.policyCustomer.email = value;
  } else {
    payload = {
      ...payload,
      [field]: value
    };
  }
  return payload;
}

export function updateGenerateQuotePayload(field: string, value: any, payload: any) {
  if (field === 'commercialRegistration') {
    payload.policyCustomer.commercialRegistration = "";
  } else if (field === "email") {
    payload.policyCustomer.email = value;
  } else if (field === "primaryAddress") {
    payload.policyCustomer.primaryAddress = value;
  } else if (field === "deductibleAmount") {
    payload.policyRisk.deductibleAmount = value;
  } else if (field === "vehicleValue") {
    payload.policyRisk.vehicleValue = value;
  } else if (field === "benefits") {
    payload.policyRisk.benefits = value;
  } else if (field === "drivers") {
    payload.policyRisk.drivers = value;
  } else {
    payload = {
      ...payload,
      [field]: value,
    };
  }
  return payload;
}
function updateSliderChangeCalculatePremiumPayload(
  field1: string,
  feild2: string,
  value1: any,
  value2: any,
  payload: any
) {
  if (field1 === "repairCondition" && feild2 === "vehicleValue") {
    payload.policyRisk.repairCondition = value1;
    payload.policyRisk.vehicleValue = value2;
  } else {
    payload = {
      ...payload,
      [field1]: value1,
      [feild2]: value2,
    };
  }

  return payload;
}

function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

const determineDriverIDType = (driverID: string | undefined): number => {
  if (!driverID) {
    return 2;
  }
  if (driverID.startsWith("1")) {
    return 2;
  } else if (driverID.startsWith("2")) {
    return 1;
  }

  return 2;
};

export const vehiclePlateNumberText = (
  plateNumber: string | undefined | null
): string => {
  if (!plateNumber) {
    return "";
  }
  const parts = plateNumber.split("-");
  return parts.length === 2 ? `${parts[0]} - ${parts[1]}` : parts[0];
};

export const driverEducationMappingValue = (
  education: string | undefined
): number => {
  if (!education) {
    return 8;
  }
  switch (education) {
    case "Primary":
      return 1;
    case "Elementary":
      return 2;
    case "Secondary":
      return 3;
    case "Diploma":
      return 4;
    case "Bachelor":
      return 5;
    case "Master":
      return 6;
    case "PhD":
      return 7;
    default:
      return 8;
  }
};

export const getDriverEducation = (educationLevel: number): string => {
  switch (educationLevel) {
    case 1:
      return "Primary";
    case 2:
      return "Elementary";
    case 3:
      return "Secondary";
    case 4:
      return "Diploma";
    case 5:
      return "Bachelor";
    case 6:
      return "Master";
    case 7:
      return "PhD";
    default:
      return "Others";
  }
};

export const driverMaritalMappingValue = (
  maritalStatus: string | undefined
): number => {
  if (!maritalStatus) {
    return 5;
  }
  switch (maritalStatus) {
    case "Married":
      return 1;
    case "Single":
      return 2;
    case "Divorced":
      return 3;
    case "Widowed":
      return 4;
    default:
      return 5;
  }
};

export const getMaritalStatus = (status: number): string => {
  switch (status) {
    case 1:
      return "Married";
    case 2:
      return "Single";
    case 3:
      return "Divorced";
    case 4:
      return "Widowed";
    default:
      return "Others";
  }
};

const getUsagesPercentage = (driverDetailsLength: number): number => {
  if (driverDetailsLength === 1) {
    return 0.5;
  } else if (driverDetailsLength === 2) {
    return 0.25;
  }
  return 0;
};

const createAddDriverDetailsMappingFields = (
  driver: Partial<DriverDetails> & Partial<DriverDetailsResponseData>,
  driverDetailsLength: number
): DriverDetailsMappingFields => {
  return {
    mainDriverInd: "N",
    usagePercentage: getUsagesPercentage(driverDetailsLength) || 0.5,
    nationality: driver.licenseCountry || "Saudi Arabia",
    driverIDType: driver.driverIDType
      ? determineDriverIDType(driver.driverID)
      : 2,
    driverID: driver.driverID || "1080072984",
    driverName: driver.driverName || "OMAR ABDULMOHSEN AHMED ALNAIM",
    driverNameArabic: driver.driverNameArabic || "عمر عبدالمحسن بن احمد النعيم",
    relation: driverRelationMappingValue(driver.driverRelationship) || 1,
    dateOfBirth: driver.dateofBirth || "1994-01-04",
    dateOfBirthH: driver.dateofBirthH || "22-07-1414",
    gender: driver.gender || "M",
    occupation: driver.occupation || " ",
    educationLevel: driverEducationMappingValue(driver.driverEducation) || 5,
    maritalStatusCd: driverMaritalMappingValue(driver.maritalStatus) || 1,
    childrenBelow16: driver.noOfChildren || 0,
    workCompanyName: driver.workCompanyName || null,
    workCityCode: driver.workCityCode || "",
    homeCityCode: driver.homeCityCode || "",
    homeAddress: driver.homeAddress || "",
    licenseType: driver.licenseType || 1,
    licenseYear: driver.licenseYear || 5,
    licenseExpiryDateH: driver.licenseExpiryDateH || null,
    idIssuePlaceCode: driver.idIssuePlaceCode || "الخبر",
    ncdReference: driver.ncdReferenceNo || "NCD23052462833",
    noOfAccidents: driver.noOfAccidents || 0,
    noOfClaims: driver.noOfClaims || 0,
    unitNo: driver.unitNo || "",
    buildingNumber: driver.buildingNumber || "2180",
    streetName: driver.streetName || "28جـ",
    district: driver.district || "حي الراكة الشمالية",
    city: driver.city || "الدمام",
    additionalNumber: driver.additionalNumber || "8822",
    postalCode: driver.postalCode || "34225",
    healthConditions: driver.healthCondition || "",
    trafficViolations: driver.trafficViolation || "",
    najmCaseDetails: driver.najmCaseDetails || [],
    validDrivingLicenses: driver.validDrivingLicenses || [],
  };
};

const mergeDriverDetails = (
  driverInput: Partial<DriverDetails>[],
  driverResponse: Partial<DriverDetailsResponseData>[],
  driverDetailsLength: number
): DriverDetailsMappingFields[] => {
  const map = new Map<string, Partial<DriverDetails>>();

  driverInput?.forEach((item) => {
    if (item.driverID) {
      map.set(item.driverID, item);
    }
  });

  const result = driverResponse.map((item) => {
    if (item.driverID) {
      const matchingItem = map.get(item.driverID);
      return matchingItem ? { ...matchingItem, ...item } : item;
    }
    return item;
  });

  return result.map((item) =>
    createAddDriverDetailsMappingFields(item, driverDetailsLength)
  );
};

const getParkingType = (parkingType: string | undefined): number => {
  switch (parkingType) {
    case "Street":
      return 1;
    case "HomeLane":
      return 2;
    case "Garage":
      return 3;
    default:
      return 1;
  }
};

const getAntiTheftAlarmValue = (antiTheftAlarm: string | undefined): string => {
  switch (antiTheftAlarm) {
    case "Working":
      return "1";
    case "Not Working":
      return "0";
    default:
      return "0";
  }
};

const getFrieExtinguisherValue = (
  fireExtinguisher: boolean | undefined
): string => {
  return fireExtinguisher ? "1" : "0";
};

const getEngineCapacity = (engineCapacity: string | undefined): number => {
  if (!engineCapacity) {
    return 0;
  }
  const parts = engineCapacity?.split(" ");
  return parts.length > 0 ? parseFloat(parts[0]) : 0;
};

function additionalBenefitsCMSData(languageData: LanguageData, formAddressSelection: { propertyType: { activeIndex: number } }
) {
  const benefits: [] = [];
  const propertyType = Number(formAddressSelection?.propertyType?.activeIndex) + 1 || 0;
  if (Array.isArray(languageData?.coverage_beneits) && languageData?.coverage_beneits.length > 0) {
    for (const item of languageData.coverage_beneits) {
      const values: Record<string, string | number> = {};
      if (item.coverageFor && item.coverageFor.indexOf(propertyType.toString()) !== -1) {
        values["benefitId"] = `${item.coverageCode}_homebenefits`;
        values["benefitCode"] = item.coverageCode;
        values["benefitNameEn"] = item.coverageName;
        values["description"] = languageData?.additional_benefits_plan;
        values["benefitPrice"] = Number(item.annualPremium);
        benefits.push(values);
      }
    }
  }
  return benefits;
}

// fetch purchased coverage code from home calculate premium api and converted to benefits array to display
function convertCoverageToBenefits(
  benefit: [{ coverageCode: string, coverageName: string, premiumInfo: { finalPremium: number } }],
  languageData: LanguageData,
  addToBenefits: [],
  formAddressSelection: { propertyType: { activeIndex: number } }
) {
  const codeCMSData = additionalBenefitsCMSData(languageData, formAddressSelection);
  const benefits: any[] = [];
  if (benefit) {
    for (const parentItem of benefit) {
      const values: Record<string, string | number> = {};
      if (parentItem.coverageCode !== languageData?.defaultCoverageCode) {
        values["benefitId"] = `${parentItem.coverageCode}_homebenefits`;
        values["benefitCode"] = parentItem.coverageCode;
        values["benefitNameEn"] = parentItem.coverageName;
        values["description"] = languageData?.additional_benefits_plan;
        values["benefitPrice"] = Number(parentItem.premiumInfo.finalPremium);
        benefits.push(values);
        let index = 0;
        for (const childItem of codeCMSData) {
          if (childItem.benefitCode === parentItem.coverageCode) {
            codeCMSData.splice(index, 1);
          }
          index++;
        }
      }
    }
  }

  return addToBenefits.concat(codeCMSData, benefits);
}

const addAddtionalBenefitsToPremium = (
  requestPayload: CalculatePremiumApiPayload,
  code: string
) => {
  const policyCoverage = requestPayload?.policyRisk[0]?.policyCoverage || [];

  const addBenefits = (code: string, benefits: { coverageCode?: string }[]) => {
    const benefitsIndex = benefits.findIndex(
      (data) => data.coverageCode === code
    );
    if (benefitsIndex !== -1) {
      benefits.splice(benefitsIndex, 1);
    } else {
      benefits.push({ coverageCode: code });
    }
  };

  const requestPayloadScheme: CalculatePremiumApiPayload = {
    ...requestPayload,
    policyRisk: [
      {
        ...requestPayload.policyRisk[0],
        ...(!policyCoverage
          ? {
            ...{ policyCoverage: [] },
          }
          : addBenefits(code, policyCoverage)),
      },
    ],
  };

  // if (policyCoverage && policyCoverage.length === 0) {
  //   delete requestPayloadScheme.policyRisk[0].policyCoverage;
  // }

  return requestPayloadScheme;
};
const resetCoverageCodePayload = (
  requestPayload: CalculatePremiumApiPayload,
  defaultCoverageCode: string
) => {
  const policyCoverage = requestPayload?.policyRisk[0]?.policyCoverage || [];
  const requestPayloadScheme: CalculatePremiumApiPayload = {
    ...requestPayload,
    policyRisk: [
      {
        ...requestPayload.policyRisk[0],
        ...(policyCoverage && {
          ...{ policyCoverage: [{ coverageCode: defaultCoverageCode }] },
        }),
      },
    ],
  };
  return requestPayloadScheme;
};

export const getRepairType = (repairCondition: number) => {
  if (!repairCondition) {
    return "";
  }
  if (repairCondition === 1) {
    return "Agency";
  } else if (repairCondition === 2) {
    return "Workshop";
  } else if (repairCondition === 3) {
    return "Mawthoq";
  }
};

export const getRegistrationNumber = (
  registrationPlateNo: string,
  registrationPlateText1: string,
  registrationPlateText2: string,
  registrationPlateText3: string
) => {
  return `${registrationPlateNo}-${registrationPlateText1?.split(" ")[0]}${registrationPlateText2?.split(" ")[0]
    }${registrationPlateText3?.split(" ")[0]}`;
};

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/(\d{1,2}) (\w+) (\d{4})/, '$1 $2, $3');
};

export const truncateName = (name: string | undefined, maxLength: number) => {
  if (!name) return "";
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
};

// steps progress component for user coverage plan renew to ignore first key
const stepProgressToRenew = (steps: { [key: string]: string }) => {
  const stepsUpdated: { [key: string]: string } = {};
  Object?.keys(steps)?.forEach((k, i) => {
    if (i > 0) {
      stepsUpdated[k] = steps[k];
    }
  });
  return stepsUpdated;
};

const checkValueIsEmpty = (data: string | null, lastString = false) => {
  if (data !== null) {
    data = data?.trim();
  }
  return (data !== "" && data !== null && data !== undefined) ? `${data}${!lastString ? "," : ""}` : "";
}

// display house property address details related to quoteandbuy or renewal policy
const displayHouseAddress = (address: { [key: string]: string }, currentLanguage: string, ar: string) => {
  if (address?.streetAR && address?.districtAR) {
    return `${address.buildingNumber}, ${currentLanguage === ar ? address.streetAR : address.streetENG
      }, ${currentLanguage === ar ? address.districtAR : address.districtENG}, ${currentLanguage === ar ? address.cityAR : address.cityENG
      }, ${address.postCode}, ${address.additionalNumber}, ${currentLanguage === ar ? address.regionNameAR : address.regionNameENG
      }`
  } else if (address?.countryInArabic) {
    let addressData = checkValueIsEmpty(address?.buildingNumber);
    const streetName = currentLanguage === ar ? address.streetNameInArabic : address.streetName;
    addressData = addressData + checkValueIsEmpty(streetName);
    const district = currentLanguage === ar ? address.districtNameInArabic : address.district;
    addressData = addressData + checkValueIsEmpty(district);
    const city = currentLanguage === ar ? address.cityInArabic : address.city
    addressData = addressData + checkValueIsEmpty(city) + checkValueIsEmpty(address.postCode, true);
    return (addressData ? addressData : NOT_APPLICABLE);
  }
  else if (address?.cityDistrict) {
    let addressData = checkValueIsEmpty(address?.areaLocalityEn);
    addressData = addressData + checkValueIsEmpty(address?.streetNameEn);
    addressData = addressData + checkValueIsEmpty(address?.cityDistrict);
    addressData = addressData + checkValueIsEmpty(address?.country, true);
    return (addressData ? addressData : NOT_APPLICABLE);
  }
  else {
    return null;
  }
}

export {
  resetCoverageCodePayload,
  addAddtionalBenefitsToPremium,
  convertCoverageToBenefits,
  geteDriverRelation,
  updateCalculatePremiumPayload,
  updateRenewalCalculatePremiumPayload,
  updateRedisDataCalculatePremiumPayload,
  deepCopy,
  createAddDriverDetailsMappingFields,
  mergeDriverDetails,
  getParkingType,
  getAntiTheftAlarmValue,
  getFrieExtinguisherValue,
  getEngineCapacity,
  updateSliderChangeCalculatePremiumPayload,
  stepProgressToRenew,
  displayHouseAddress
};

export const cleanSpaces = (text?: string): string => {
  if (typeof text === "string")
    return text.replace(/\s{2,}/g, " ").trim();
  else return "";
};

export const isTravellerChild = (age: number) => {
  return age < familtyFlowConstants.adultAge;
};

export const isTravellerAdult = (age: number) => {
  return (
    age >= familtyFlowConstants.adultAge &&
    age < familtyFlowConstants.SENIOR_CITIZEN_AGE_CHECK
  );
};

export const isTravellerSenior = (age: number) => {
  return age >= familtyFlowConstants.SENIOR_CITIZEN_AGE_CHECK;
};

export const getTravellerCountsWithoutPrimary = (
  primary: { personAge: number },
  counts: {
    child: number;
    adult: number;
    senior: number;
  }
) => {
  const result = {
    child: counts.child,
    adult: counts.adult,
    senior: counts.senior,
    isPrimaryChild: isTravellerChild(primary.personAge),
    isPrimaryAdult: isTravellerAdult(primary.personAge),
    isPrimarySenior: isTravellerSenior(primary.personAge),
  };
  if (result.isPrimaryChild) result.child > 0 && --result.child;
  else if (result.isPrimaryAdult) result.adult > 0 && --result.adult;
  else if (result.isPrimarySenior) result.senior > 0 && --result.senior;
  return result;
};

export const isValidTravelerDOB = (
  person: Partial<Travel.Traveler>,
  langData: LanguageData,
  dob?: string
): true | string => {
  const dateText = dob ?? person.dateOfBirth;
  let error = "";
  if (person.type === familtyFlowConstants.TITLES.SELF) return true;
  else if (isValidCalendarDate(dateText) === true) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const [day, month, year] = (dateText as string).split("/");
    const dobDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    const age = getFullAge(dateText as string, "/");
    if (person.type === familtyFlowConstants.TITLES.CHILD) {
      const minDate = new Date(date);
      minDate.setMonth(minDate.getMonth() - 3);
      minDate.setDate(minDate.getDate() + 1);
      if (isTravellerChild(age) === true && dobDate < minDate) return true;
      else error = langData.age_lessthan_18;
    } else if (person.type === familtyFlowConstants.TITLES.ADULT) {
      if (isTravellerAdult(age) === true) return true;
      else error = langData.age_lessthan_60;
    } else if (person.type === familtyFlowConstants.TITLES.SR_CITIZEN) {
      if (
        isTravellerSenior(age) === true &&
        age <= familtyFlowConstants.seniorAgeLimit
      )
        return true;
      else error = langData.age_greaterthan_80;
    }
  }
  return error;
};

export const isValidPassportExpiry = (
  policyStartDate: string | DateObject,
  expiryDate: string | DateObject
): boolean => {
  let start = policyStartDate;
  if (typeof start !== "string") start = start?.format("DD/MM/YYYY");
  let end = expiryDate;
  if (typeof end !== "string") end = end?.format("DD/MM/YYYY");
  if (isValidCalendarDate(start) && isValidCalendarDate(end)) {
    const days = subtractDates(end, start);
    if (days >= 180) return true;
  }
  return false;
};

export const isValidPassportNum = (value: string): boolean => {
  const regex = /^[A-Z]{1,2}\d{4,8}$/;
  return regex.test(value ?? "");
};

export const isValidPassportNumEdit = (value: string): boolean => {
  const regexAlpha = /^[A-Z]{0,2}$/;
  const regexAlphaNum = /^[A-Z]{1,2}\d{0,8}$/;
  return regexAlpha.test(value ?? "") || regexAlphaNum.test(value ?? "");
};

export const isValidName = (value: string = ""): boolean => {
  const regex = /^[A-Za-z]+( [A-Za-z]+)* ?$/;
  return regex.test(value ?? "");
};

export const isValidNameEdit = (value: string = ""): boolean => {
  return value === "" || isValidName(value);
};

export const toTitleCase = (input: string): string => {
  return input.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}

export const isValidAmountEdit = (value: string = ""): boolean => {
  const regex = /^\d+\.?\d*$/;
  return value === "" || regex.test(value ?? "");
};

export const getGenderProfileIcon = (gender?: string) => {
  if (gender === genderCodes.female) return femaleProfileIcon;
  else return maleProfileIcon;
};

export const getVehicleMakeModel = (vehicleDetailsResponseData: VehicleDetailsResponseData | null) => {
  if (!vehicleDetailsResponseData) return null;
  const vehilceName = `${vehicleDetailsResponseData?.vehicleMakeTextEn || vehicleDetailsResponseData?.make || ""} ${vehicleDetailsResponseData?.vehicleModelTextEn || vehicleDetailsResponseData?.model || ""}`;

  return capitalizeNameFirstLetter(vehilceName);
};

export function ucFirstAllWords(str: string) {
  const pieces = str.split(" ");
  for (let i = 0; i < pieces.length; i++) {
    const j = pieces[i].charAt(0).toUpperCase();
    pieces[i] = j + pieces[i].substr(1);
  }
  return pieces.join(" ");
}

export const isValidCalendarDateFormat = (dateStr: string): boolean => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  const [day, month, year] = dateStr.split("/").map(Number);
  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};

export const skipToSelectSameBenefits = (
  data: [],
  benefitCode: string,
  benefitId: number,
  benefitPrice: string,
  benefitTitleEn: string,
  benefitTitleAr: string
) => {
  if (!benefitCode || !benefitId) return data; // Skip if code or id is missing

  const existingIndex = data.findIndex(
    (item) => item.benefitCode === benefitCode
  );

  // Case 1: Same code & id → Remove it 
  // This is to ensure that if the same benefit is toggled off, it is removed from the selected benefits
  if (existingIndex !== -1 && data[existingIndex].benefitId === benefitId) {
    return data.filter((_, i) => i !== existingIndex);
  }

  // Case 2: Same code, different id → Replace it
  if (existingIndex !== -1 && data[existingIndex].benefitId !== benefitId) {
    return data.map((item, i) =>
      i === existingIndex
        ? { benefitNameEn: benefitTitleEn, benefitNameAr: benefitTitleAr, benefitPrice: benefitPrice, benefitCode: benefitCode, benefitId: benefitId }
        : item
    );
  }

  // Case 3: Code doesn't exist → Add it
  return [...data, { benefitNameEn: benefitTitleEn, benefitNameAr: benefitTitleAr, benefitPrice: benefitPrice, benefitCode: benefitCode, benefitId: benefitId }];
}
