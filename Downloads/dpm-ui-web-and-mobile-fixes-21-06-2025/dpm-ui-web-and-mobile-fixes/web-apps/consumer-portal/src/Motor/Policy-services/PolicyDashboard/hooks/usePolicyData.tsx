import { useMemo } from "react";
import { PolicyHolderDetails, VehicleDetails, PolicyPremiumAndBenefits, PolicyCard, PolicyDetails } from "types/policyDetails";
import { getCoverageName } from "utils/policyDetails";
import { capitalizeNameFirstLetter,NOT_APPLICABLE } from "@dpm/shared-module";
import { SuccessPagePolicyData } from "types/quoteAndBuy";
import { PolicyDataProps } from "types/viewQuote";
import { getCoveragePlanName } from "utils/getCoverageDetails";
import { PRODUCTCODE_TRAVEL, TRAVEL, } from "constant";
import { DriverProps } from "types/driver";


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
      driverList: [],
      benefitsList: []
    };
  }
  const customer = data?.policyCustomer[0];
  const drivers = data?.policyLob[0]?.policyRisk[0]?.drivers;
  const benefits = data?.policyLob[0]?.policyRisk[0]?.policyCoverage
  const policy = data?.policyBasic;
  const policyLob = data?.policyLob[0]?.policyRisk[0];
  const planDetails = data?.policyLob[0];
  const premiumAndBenefits = policy?.premiumInfo;
  const coverageType = data?.policyLob[0]?.typeOfCoverage !== undefined ? getCoveragePlanName(data.policyLob[0]?.typeOfCoverage, data.policyLob[0]?.plan) : '';
  const policyDetails: PolicyDetails = {
    policyNo: policy?.policyNumber ??"",
    quoteNumber: policy?.quoteNumber ?? "",
    startDate: policy?.effectiveDate ?? "",
    expiryDate: policy?.expiryDate ?? "",
    effectiveDate: policy?.effectiveDate ?? "",
    idv: policyLob?.vehicleValue ?? "",
    prodCode: policy?.productCode ?? "",
    coverageName: (productCode === PRODUCTCODE_TRAVEL || productCode === TRAVEL) ? coverageType : getCoverageName(policy?.productCode ?? ""),
    insurerName: capitalizeNameFirstLetter(customer?.customerNameEnglish ?? ""),
    insurerNameArabic: customer?.customerNameArabic ?? "",
    mobile: customer?.mobile ?? "",
    nationalID: customer?.nationalId,
    email: customer?.email ?? "",
  };

  const policyHolderDetails: PolicyHolderDetails = {
    customerNameEnglish: capitalizeNameFirstLetter(
      customer?.customerNameEnglish ?? ""
    ),
    customerNameArabic: customer?.customerNameArabic ?? "",
    dateOfBirth: customer?.dateOfBirth,
    idNumer: customer?.nationalId || NOT_APPLICABLE,
    gender: customer?.gender,
    licenseType: policyLob?.drivers ? policyLob?.drivers[0]?.licenseType : NOT_APPLICABLE,
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
  const driverList=drivers?.map((driver: DriverProps)=>{
    return({
      driverNameEnglish: capitalizeNameFirstLetter(
      driver?.driverName ?? ""
  ),
  driverNameArabic: driver?.driverNameArabic ?? "",
  dateOfBirth: driver?.dateOfBirth,
  driverID: driver?.driverID || NOT_APPLICABLE,
  gender: driver?.gender,
  licenseType: driver?.licenseType,
  address: {
    streetName: driver?.streetName,
    city: driver?.city,
    postCode: driver?.postalCode,
    buildingNumber: driver?.buildingNumber,
    district: driver?.district,
  },
  relation:driver.relation,
  
    })
}).filter(driver=>driver.relation!=null);

const benefitsList=benefits?.map((benefit)=>({benefitCode:benefit.coverageCode,benefitName:benefit.coverageName}))
  const policyCard: PolicyCard = {
    customerNameEnglish: capitalizeNameFirstLetter(
      customer?.customerNameEnglish ??""
    ),
    customerNameArabic: customer?.customerNameArabic ?? "",
    nationalId: customer?.nationalId || NOT_APPLICABLE,
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
    vehicleMakeTextEn: string;
    vehicleModelText: string;
    vehicleModelTextEn: string;
    vehicleSequenceNo: string;
    vehicleCustomID: string;
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
      registrationPlateNo: risk.plateNo || NOT_APPLICABLE,
      registrationPlateText: risk.plateNoText1 || NOT_APPLICABLE,
      vehicleMakeText: risk.vehicleMakeText || NOT_APPLICABLE,
      vehicleModelText: risk.vehicleModelText || NOT_APPLICABLE,
      vehicleMakeTextEn: risk.vehicleMakeTextEn || NOT_APPLICABLE,
      vehicleModelTextEn: risk.vehicleModelTextEn || NOT_APPLICABLE,
      chassisNo: risk.chassisNo || NOT_APPLICABLE,
      typeOfChassis: risk.chassisType || NOT_APPLICABLE,
      vehicleSequenceNo: risk.vehicleSequenceNo || NOT_APPLICABLE,
      vehicleCustomID: risk.vehicleCustomID || NOT_APPLICABLE,
      yearOfManufacture: risk.manufactureYear || NOT_APPLICABLE,
      vehicleColor: risk.vehicleColour || NOT_APPLICABLE,
      transmission: risk.transmissionType || NOT_APPLICABLE,
      serialNo: risk.serialNo || NOT_APPLICABLE,
      registrationPlateText1: risk.plateNoText1 ?? "",
      registrationPlateText2: risk.plateNoText2 ?? "",
      registrationPlateText3: risk.plateNoText3 ?? "",
      repairCondition: risk.repairCondition ?? NOT_APPLICABLE,

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
    coverageName: (productCode === PRODUCTCODE_TRAVEL || productCode === TRAVEL) ? coverageType : getCoverageName(policy?.productCode),
    customerNameEnglish: capitalizeNameFirstLetter(customer?.customerNameEnglish ?? ""),
    customerNameArabic: customer?.customerNameArabic ?? "",
    nationalityId: customer?.nationalId,
    mobileNo: customer?.mobile,
    premiumAmount: (premiumAndBenefits?.premiumDue ?? 0) + "",
    sumInsured: (premiumAndBenefits?.sumInsured ?? policyLob?.vehicleValue ?? "0") + "",
    registrationPlateNo: vehicleDetails[0]?.registrationPlateNo ?? NOT_APPLICABLE,
    registrationPlateText1: vehicleDetails[0]?.registrationPlateText1 ?? "",
    registrationPlateText2: vehicleDetails[0]?.registrationPlateText2 ?? "",
    registrationPlateText3: vehicleDetails[0]?.registrationPlateText3 ?? "",
    vehicleMakeText: vehicleDetails[0]?.vehicleMakeTextEn ?? NOT_APPLICABLE,
    vehicleModelText: vehicleDetails[0]?.vehicleModelTextEn ?? NOT_APPLICABLE,
    repairCondition: vehicleDetails[0]?.repairCondition ?? NOT_APPLICABLE,
    gender: customer.gender,
    vehicleMake: vehicleDetails[0]?.vehicleMakeText === "NA" ? undefined : vehicleDetails[0]?.vehicleMakeText,
  };

  return {
    policyDetails,
    planDetails,
    policyHolderDetails,
    policyCard,
    vehicleDetails, 
    policyPremiumAndBenefits,
    successPageData,
    driverList,
    benefitsList
  };
}, [data]);
};

export default usePolicyData;