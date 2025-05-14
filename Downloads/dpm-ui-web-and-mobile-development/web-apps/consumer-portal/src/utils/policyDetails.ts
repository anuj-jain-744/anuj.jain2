import { Address, GetFormattedValue } from "types/policyDetails";
import { NOT_APPLICABLE } from '@dpm/shared-module';
import { TRAVEL, HOME, HOME_COVERAGE_PLANS_TYPES, HOME_COVERAGE_PLANS_NAMES } from "constant";

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

const checkValueIsEmpty = (data: string | null, lastString = false) => {
  if (data !== null) {
    data = data?.trim();
  }
  return (data !== "" && data !== null && data !== undefined) ? `${data}${!lastString ? "," : ""}` : "";
}

function formatAddress(address: Address | undefined | null, currentLanguage: string, ar: string): string {
  let addressData = checkValueIsEmpty(address?.buildingNumber);
  const streetName = currentLanguage === ar ? address.streetNameInArabic : address.streetName;
  addressData = addressData + checkValueIsEmpty(streetName);
  const district = currentLanguage === ar ? address.districtNameInArabic : address.district;
  addressData = addressData + checkValueIsEmpty(district);
  const city = currentLanguage === ar ? address.cityInArabic : address.city
  addressData = addressData + checkValueIsEmpty(city) + checkValueIsEmpty(address.postCode, true);
  return (addressData ? addressData : NOT_APPLICABLE);

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
  return policyLob?.policyCoverage?.some((coverage: any) => coverage?.coverageName === 'Comprehensive') ? 'Comprehensive' : 'ThirdParty';
}

function getPlanName(policyPlan: policyPlanType, isShowPlanName: boolean = false) {
  let planName = policyPlan?.policyDetails?.coverageName;

  if (policyPlan?.policyDetails?.prodCode === TRAVEL) {
    planName = policyPlan?.policyDetails?.coverageName; // Applying coverage values for travel in policydetails itself for travel
  }
  if (policyPlan?.policyDetails?.prodCode?.toLocaleLowerCase() === HOME?.toLocaleLowerCase()) {
    const planType = policyPlan?.planDetails.planCode;
    if (isShowPlanName) {
      const planValue = HOME_COVERAGE_PLANS_TYPES[planType?.replace(/\s+/g, '').toLowerCase()] || null;
      planName = HOME_COVERAGE_PLANS_NAMES[planValue];
    } else {
      planName = planType;
    }
  }
  return planName;
}

function getSumInsuredDeductible(policyRisk) {
  const sumInsuredDeductible = { sumInsured: null, minDeductible: null };
  for (const risk in policyRisk) {
    for (const coverage in policyRisk[risk].policyCoverage) {
      const data = policyRisk[risk].policyCoverage[coverage];
      if (data.sumInsured !== null && data.minDeductible !== null) {
        sumInsuredDeductible.sumInsured = sumInsuredDeductible.sumInsured + data.sumInsured;
        sumInsuredDeductible.minDeductible = sumInsuredDeductible.minDeductible + data.minDeductible
      }
    }
  }
  return sumInsuredDeductible;
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
  getPlanName,
  getSumInsuredDeductible
};
