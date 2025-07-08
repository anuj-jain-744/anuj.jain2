import { getAmountWithIcon } from "@app-shell/utils/common";
import { motorCoverageTypes } from "constant";
import  { LanguageData } from "types/LanguageData";
import { SuccessPagePolicyData } from "types/quoteAndBuy";
import { formatDate } from "utils/formatDate";
import { getVehicleMakeModel } from "utils/quoteAndBuy";
import { EndorsementDataProps, ClaimDataProps } from "Motor/SuccessPage/SuccessDataTypes";

  export const makeDataBuyMotor = (policyData:SuccessPagePolicyData,policyPeriod:string,plateNumber:string,languageData: LanguageData) => {
    const TPLData=[
      {
        label: policyData?.vehicleMakeText + " " +policyData?.vehicleModelText,
        value: plateNumber,
        class: "",
      },
      {
        label: languageData?.policy_period,
        value:policyPeriod || "",
        class: "",
      },
       {
        label: languageData?.premium_amount,
        value: getAmountWithIcon(policyData?.premiumAmount) || "N/A",
        class: "premium-amount",
      },
    ]
    if (policyData?.coverageName === motorCoverageTypes.tp) {
      return TPLData;
    }
    
    return ([
      {
        label: policyData?.vehicleMakeText + " " +policyData?.vehicleModelText,
        value: plateNumber,
        class: "",
      },
      { 
        label: languageData?.sum_insured,
        value: getAmountWithIcon(policyData?.sumInsured) || "N/A",
        class: "",
       },
       {
        label: languageData?.deductibles,
        value: getAmountWithIcon(policyData?.deductibleAmount) || "N/A",
        class: "",
      },
      {
        label: languageData?.policy_period,
        value:policyPeriod || "",
        class: "",
      },
       {
        label: languageData?.premium_amount,
        value: getAmountWithIcon(policyData?.premiumAmount) || "N/A",
        class: "premium-amount",
      },
    ]);
  };
  export const getEndorsementDataForPolicyDetails=(endorsementData: EndorsementDataProps,endoEffectiveDate:string,languageData:LanguageData)=>{
    if(endorsementData?.selectBenefit?.benefit){
      return([
        {
        label: languageData?.additional_benifits_s || "Additional Benefits",
        value: `${languageData?.extra_benefits} (${endorsementData?.benefitsPremiumData?.length})` || "Extra Benefits",
        class: "",
      },
      { 
        label: languageData?.date || "Date",
        value: formatDate(endoEffectiveDate || endorsementData?.endoEffectiveDate),
        class: "",
       },
       {
        label: languageData?.premium_amount,
        value: getAmountWithIcon(endorsementData?.totalAmount?.totalAmount) || "N/A",
        class: "premium-amount",
      },
      ])
    }else if(endorsementData?.selectManagerDriver?.manage){
      return([
         {
        label: languageData?.additional_benifits_s || "Additional Benefits",
        value: `${languageData?.manage_drivers}(${endorsementData?.driversPremiumData?.length})` || "Manage Drivers",
        class: "",
      },
      { 
        label: languageData?.date || "Date",
        value: endoEffectiveDate || "",
        class: "",
       },
       {
        label: languageData?.premium_amount,
        value: getAmountWithIcon(endorsementData?.totalAmount?.totalAmount) || "N/A",
        class: "premium-amount",
      },
      ])
    }
    return null
  }
  export const getClaimForPolicyDetails=(claimData: ClaimDataProps,languageData:LanguageData)=>{
    const validationData = claimData?.validationData;
    const vehicleMakeTextEn= claimData?.validationData?.vehicleMakeTextEn 
    const make=claimData?.validationData?.vehicleMake;
    const vehicleModelTextEn= claimData?.validationData?.vehicleModelTextEn;
    const model=claimData?.validationData?.vehicleModel;
    return([
      {
        label: languageData?.policy_no,
        value: validationData?.policyNumber || "N/A",
        class: "",
      },
      { 
        label: languageData?.owner_id_label,
        value: claimData?.claimsInfo?.ownerId || "N/A",
        class: "",
       },
       { 
        label: languageData?.case_reference_no,
        value: claimData?.claimsInfo?.refNo || "N/A",
        class: "",
       },
       {
        label: validationData? getVehicleMakeModel({vehicleMakeTextEn,make,model,vehicleModelTextEn}): "",
        value: validationData?.plateNo || "",
        class: "",
       }
    ])
  }