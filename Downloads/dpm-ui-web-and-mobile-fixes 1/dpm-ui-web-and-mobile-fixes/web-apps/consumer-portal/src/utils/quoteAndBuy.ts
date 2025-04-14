import {
  DriverDetails,
  DriverDetailsMappingFields,
  DriverDetailsResponseData,
} from "types/quoteAndBuy";
import { CalculatePremiumApiPayload } from "types/HomeCalculatePremiumApiPayload";
import { Chargeable } from "../constant";
import { familtyFlowConstants } from "components/Travel/constantsTravel";

function geteDriverRelation(relationCode: number): string {
  const relationMapping = ["Family member", "Friend", "Private driver", "None"];

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
  if(field === "email"){
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

// fetch purchased coverage code from home calculate premium api and converted to benefits array to display
function convertCoverageToBenefits(
  data: Record<string, any>,
  languageData: LanguageData
) {
  const benefits: any[] = [];
  data.forEach((item: Record<string, any>, index: number) => {
    if (
      item.premiumInfo.finalPremium > 0 &&
      item.benefitCategory === Chargeable
    ) {
      const values: Record<string, string> = {};
      values["benefitCode"] = item.coverageCode;
      values["benefitId"] = `${index}_homebenefits`;
      values["benefitNameEn"] = item.coverageName;
      values["description"] = languageData?.additional_benefits_plan;
      values["benefitPrice"] = item.premiumInfo.finalPremium;
      benefits.push(values);
    }
  });
  return benefits;
}

const addAddtionalBenefitsToPremium = (
  requestPayload: CalculatePremiumApiPayload,
  code: string
) => {
  const policyCoverage = requestPayload.policyRisk[0].policyCoverage;

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
              ...{ policyCoverage: [{ coverageCode: code }] },
            }
          : addBenefits(code, policyCoverage)),
      },
    ],
  };

  if (policyCoverage && policyCoverage.length === 0) {
    delete requestPayloadScheme.policyRisk[0].policyCoverage;
  }

  return requestPayloadScheme;
};
const resetCoverageCodePayload = (
  requestPayload: CalculatePremiumApiPayload,
  defaultCoverageCode: string
) => {
  const policyCoverage = requestPayload.policyRisk[0].policyCoverage;
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
  return `${registrationPlateNo}-${registrationPlateText1?.split(" ")[0]}${
    registrationPlateText2?.split(" ")[0]
  }${registrationPlateText3?.split(" ")[0]}`;
};

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const truncateName = (name: string | undefined, maxLength: number) => {
  if (!name) return "";
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
};

// steps progress component for user coverage plan renew to ignore first key
const stepProgressToRenew = (steps: {[key:string]: string}) => {
  const stepsUpdated: {[key:string]: string} = {};
  Object?.keys(steps)?.forEach((k, i) => {
    if (i > 0) {
      stepsUpdated[k] = steps[k];
    }
  });
  return stepsUpdated;
};

// display house property address details related to quote and buy or renewal policy
const displayHouseAddress = (address: { [key: string]: string }, currentLanguage: string, ar: string) => {
  if (address?.streetAR && address?.districtAR) {
    return `${address.buildingNumber}, ${currentLanguage === ar ? address.streetAR : address.streetENG
    }, ${currentLanguage === ar ? address.districtAR : address.districtENG}, ${currentLanguage === ar ? address.cityAR : address.cityENG
      }, ${address.postCode}, ${address.additionalNumber}, ${currentLanguage === ar ? address.regionNameAR : address.regionNameENG
      }`
  } else if (address?.countryInArabic) {
    return `${address?.buildingNumber}, ${currentLanguage === ar ? address.streetNameInArabic : address.streetName
    }, ${currentLanguage === ar ? address.districtNameInArabic : address.district}, ${currentLanguage === ar ? address.cityInArabic : address.city
      }, ${address.postCode}`
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

export const toTitleCase = (input:string):string=>{
  return input.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}