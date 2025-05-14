import { useMemo } from "react";
import { PolicyHolderDetails, VehicleDetails, PolicyPremiumAndBenefits, PolicyCard, PolicyDetails } from "types/policyDetails";
import { getCoverageName } from "utils/policyDetails";
import { capitalizeNameFirstLetter } from "@dpm/shared-module";
import { SuccessPagePolicyData } from "types/quoteAndBuy";
import { PolicyDataProps } from "types/viewQuote";
import { getCoverageDetails } from "utils/getCoverageDetails";
import { PRODUCTCODE_TRAVEL, } from "constant";

const noValue = "Not available";

const usePolicyData = (data: PolicyDataProps | null, productCode: string | null) => {
  return useMemo(() => {
  if (!data) {
    return {
      policyDetails: null,
      policyHolderDetails: null,
      planDetails: null,
      policyCard: null,
      vehicleDetails: [],
      policyPremiumAndBenefits: null,
    };
  }
  const customer = data?.policyCustomer[0];
  const policy = data?.policyBasic;
  const policyLob = data?.policyLob[0]?.policyRisk[0];
  const planDetails = data?.policyLob[0];
  const premiumAndBenefits = policy?.premiumInfo;
  const coverageType = data?.policyLob[0]?.typeOfCoverage !== undefined ? getCoverageDetails(data.policyLob[0]?.typeOfCoverage) : '';


  const policyDetails: PolicyDetails = {
    policyNo: policy?.policyNumber ??"",
    quoteNumber: policy?.quoteNumber ?? "",
    startDate: policy?.effectiveDate ?? "",
    expiryDate: policy?.expiryDate ?? "",
    idv: policyLob?.vehicleValue ?? "",
    prodCode: policy?.productCode ?? "",
    coverageName: productCode === PRODUCTCODE_TRAVEL ? coverageType : getCoverageName(policyLob),
    insurerName: capitalizeNameFirstLetter(customer?.customerNameEnglish ?? ""),
    nationalID: customer?.nationalId,
  };

  const policyHolderDetails: PolicyHolderDetails = {
    customerNameEnglish: capitalizeNameFirstLetter(
      customer?.customerNameEnglish ?? ""
    ),
    customerNameArabic: customer?.customerNameArabic ?? "",
    dateOfBirth: customer?.dateOfBirth,
    idNumer: customer?.nationalId || noValue,
    gender: customer?.gender,
    licenseType: policyLob?.drivers ? policyLob?.drivers[0]?.licenseType : noValue,
    address: {
      streetName: customer?.primaryAddress?.streetName,
      city: customer?.primaryAddress?.city,
      country: customer?.primaryAddress?.country,
      postCode: customer?.primaryAddress?.postCode,
      countryInArabic: customer?.primaryAddress?.countryInArabic,
      buildingNumber: customer?.primaryAddress?.buildingNumber,
      streetNameInArabic: customer?.primaryAddress?.streetNameInArabic,
      districtNameInArabic: customer?.primaryAddress?.districtNameInArabic,
      district: customer?.primaryAddress?.district,
      cityInArabic: customer?.primaryAddress?.cityInArabic
    },
  };

  const policyCard: PolicyCard = {
    customerNameEnglish: capitalizeNameFirstLetter(
      customer?.customerNameEnglish ??""
    ),
    customerNameArabic: customer?.customerNameArabic ?? "",
    nationalId: customer?.nationalId || noValue,
    dateOfBirth: customer?.dateOfBirth,
    nationality: customer?.nationality,
    mobileNo: customer?.mobile,
    address: {
      streetName: customer?.primaryAddress?.streetName,
      city: customer?.primaryAddress?.city,
      country: customer?.primaryAddress?.country,
      postCode: customer?.primaryAddress?.postCode,
      countryInArabic: customer?.primaryAddress?.countryInArabic,
      buildingNumber: customer?.primaryAddress?.buildingNumber,
      streetNameInArabic: customer?.primaryAddress?.streetNameInArabic,
      districtNameInArabic: customer?.primaryAddress?.districtNameInArabic,
      district: customer?.primaryAddress?.district,
      cityInArabic: customer?.primaryAddress?.cityInArabic
    },
  };

  interface Risk {
    plateNo: string;
    chassisNo: string;
    chassisType: string;
    vehicleMakeText: string;
    vehicleModelText: string;
    vehicleSequenceNo: string;
    manufactureYear: string;
    vehicleColour: string;
    transmissionType: string;
    serialNo: string;
    plateNoText1: string;
    plateNoText2?: string;
    plateNoText3?: string;
    repairCondition?: string;
  }

  const vehicleDetails: VehicleDetails[] = data.policyLob.flatMap((lob: any) =>
    lob.policyRisk.map((risk: Risk) => ({
      registrationPlateNo: risk.plateNo || noValue,
      registrationPlateText: risk.plateNoText1 || noValue,
      vehicleMakeText: risk.vehicleMakeText || noValue,
      vehicleModelText: risk.vehicleModelText || noValue,
      chassisNo: risk.chassisNo || noValue,
      typeOfChassis: risk.chassisType || noValue,
      vehicleSequenceNo: risk.vehicleSequenceNo || noValue,
      yearOfManufacture: risk.manufactureYear || noValue,
      vehicleColor: risk.vehicleColour || noValue,
      transmission: risk.transmissionType || noValue,
      serialNo: risk.serialNo || noValue,
      registrationPlateText1: risk.plateNoText1 ?? "",
      registrationPlateText2: risk.plateNoText2 ?? "",
      registrationPlateText3: risk.plateNoText3 ?? "",
      repairCondition: risk.repairCondition ?? noValue,

    }))
  );

  const policyPremiumAndBenefits: PolicyPremiumAndBenefits = {
    premiumAmount: premiumAndBenefits?.finalPremium ?? 0,
    premiumDue: premiumAndBenefits?.premiumDue ?? 0,
    sumInsured: premiumAndBenefits?.sumInsured ?? policyLob?.vehicleValue ?? "0",
  };

  const successPageData: SuccessPagePolicyData = {
    policyNo: policy?.policyNumber ?? "",
    startDate: policy?.effectiveDate ?? "",
    expiryDate: policy?.expiryDate ?? "",
    coverageName: productCode === PRODUCTCODE_TRAVEL ? coverageType : getCoverageName(policyLob),
    customerNameEnglish: capitalizeNameFirstLetter(customer?.customerNameEnglish ?? ""),
    customerNameArabic: customer?.customerNameArabic ?? "",
    nationalityId: customer?.nationalId,
    mobileNo: customer?.mobile,
    premiumAmount: (premiumAndBenefits?.premiumDue ?? 0) + "",
    sumInsured: (premiumAndBenefits?.sumInsured ?? policyLob?.vehicleValue ?? "0") + "",
    registrationPlateNo: vehicleDetails[0]?.registrationPlateNo ?? noValue,
    registrationPlateText1: vehicleDetails[0]?.registrationPlateText1 ?? "",
    registrationPlateText2: vehicleDetails[0]?.registrationPlateText2 ?? "",
    registrationPlateText3: vehicleDetails[0]?.registrationPlateText3 ?? "",
    vehicleMakeText: vehicleDetails[0]?.vehicleMakeText ?? noValue,
    vehicleModelText: vehicleDetails[0]?.vehicleModelText ?? noValue,
    repairCondition: vehicleDetails[0]?.repairCondition ?? noValue,
    vehicleMake: vehicleDetails[0]?.vehicleMakeText === "NA" ? undefined : vehicleDetails[0]?.vehicleMakeText,
  };

  return {
    policyDetails,
    planDetails,
    policyHolderDetails,
    policyCard,
    vehicleDetails, 
    policyPremiumAndBenefits,
    successPageData
  };
}, [data]);
};

export default usePolicyData;