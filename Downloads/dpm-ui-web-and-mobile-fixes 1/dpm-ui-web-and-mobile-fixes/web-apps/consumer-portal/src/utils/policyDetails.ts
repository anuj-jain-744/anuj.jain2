import { Address, GetFormattedValue } from "types/policyDetails";
import { TRAVEL, TRAVEL_POLICY_TYPE, HOME } from "constant";

const colorMapping: { [key: number]: string } = {
  1: "White",
  2: "Black",
  3: "Blue",
  4: "Red",
  5: "Green",
  6: "Yellow",
  7: "Gold",
  8: "Silver",
  9: "Orange",
  10: "Pink",
  11: "Brown",
  12: "Beige",
  13: "Gray",
  14: "Light Blue",
  15: "Dark Green",
  16: "Pearl",
  17: "Purple",
  35: "Dark Red",
  36: "Light Red",
  38: "Light Orange",
  39: "Dark Golden",
  40: "Olive",
  41: "Dark Olive",
  42: "Lime",
  43: "Light Green",
  44: "Dark Turquoise",
  45: "Turquoise",
  46: "Medium Turquoise",
  47: "Light Blue",
  48: "Dark Blue",
  49: "Dark Violet",
  50: "Light Violet",
  51: "Light Pink",
  52: "Light Yellow",
  53: "Dark Brown",
  54: "Light Brown",
  55: "Dark Gray",
  56: "Light Gray",
};

const licenseMapping: { [key: number]: string } = {
  1: "Public",
  2: "Private",
};

const transmissionMapping: { [key: number]: string } = {
  1: "Manual",
  2: "Automatic",
};

const genderMapping: { [key: string]: string } = {
  M: "Male",
  F: "Female",
};

function getVehicleColor(colorCode: number): string | undefined {
  return colorMapping[colorCode];
}

function getVehicleLicense(code: number | undefined): string {
  return code ? licenseMapping[code] : 'Not available';
}

function getVehicleTransmission(code: number): string | undefined {
  return transmissionMapping[code];
}

const getFormattedValue: GetFormattedValue = (key, value) => {
  switch (key) {
    case "vehicleColor":
      return getVehicleColor(value);
    case "transmission":
      return getVehicleTransmission(value);
    case "license":
      return getVehicleLicense(value);
    default:
      return value;
  }
};

function formatAddress(address: Address | undefined | null): string {
  // const englishStreetName = address?.streetName?.split(/[\u0600-\u06FF]/)[0]    TODO: Remove Arabic characters from address, because is not consistent some it show only Arabic and some it show both Arabic and English
  //   .trim();

  return address ? `${address?.streetName}, ${address?.city}, ${address?.postCode}` : 'Not available';
}

function getGender(gender: string | undefined): string | undefined {
  return gender ? genderMapping[gender] : undefined;
}

function getFormattedPrice(price: number | string | undefined): string {
  if (!price) price = '0';
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    throw new Error("Invalid price value");
  }

  return numericPrice.toFixed(2);
}


function getCoverageName(policyLob: any) {
  return policyLob?.policyCoverage.some((coverage: any) => coverage?.coverageName === 'Comprehensive') ? 'Comprehensive' : 'ThirdParty';
}

function getPlanName(policyPlan) {
  let planName = policyPlan?.policyDetails?.coverageName;
 
  if (policyPlan?.policyDetails?.prodCode === TRAVEL) {
    planName = TRAVEL_POLICY_TYPE[policyPlan?.planDetails.typeOfCoverage];
  }
  if (policyPlan?.policyDetails?.prodCode?.toLocaleLowerCase() === HOME?.toLocaleLowerCase()) { 
    planName = policyPlan?.planDetails.planCode;
  }
  return planName;
}

function getRemainingDays(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const currDate = new Date();

  const diffInMilliSec = expiry.getTime() - currDate.getTime();
  const diffInDays = Math.ceil(diffInMilliSec / (1000 * 60 * 60 * 24));

  return diffInDays >= 0 ? diffInDays : 0;
}

export {
  getFormattedValue,
  getVehicleColor,
  getVehicleLicense,
  getVehicleTransmission,
  formatAddress,
  getGender,
  getFormattedPrice,
  getCoverageName,
  getRemainingDays,
  getPlanName
};
