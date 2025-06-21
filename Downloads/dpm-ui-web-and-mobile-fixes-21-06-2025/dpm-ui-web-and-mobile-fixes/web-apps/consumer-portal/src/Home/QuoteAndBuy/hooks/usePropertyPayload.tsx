import { convertYear, apiFormatDate, formatDate } from "utils/formatDate";
import calculatePremiumPayload from './calculatePremiumPayload.json';
import { TyperFormAddressSelection, PropertyMap, UserInfo } from 'types/HomeCalculatePremiumApiPayload';
import { LanguageData } from "types/languageData";
import { ucFirstAllWords } from "utils/quoteAndBuy";

interface PolicyCoverge {
  coverageCode: string;
  coverageName: string;
  premiumInfo: {finalPremium: string | number};
  declarationItem?: [];
}

const init = () => {
  return calculatePremiumPayload;
}

const contentBenefitsDeclaration = (policyCoverage: PolicyCoverge[], languageData: LanguageData) => {
  const declarationIndex = policyCoverage?.findIndex((data) => data?.coverageCode === languageData?.defaultCoverageCode)
  return policyCoverage[declarationIndex]?.declarationItem || null;
}

const removeDefaultBenefits = (policyCoverage: PolicyCoverge[], languageData: LanguageData) => {
  const benefits = [...policyCoverage];
  const declarationIndex = benefits?.findIndex((data) => data?.coverageCode === languageData?.defaultCoverageCode)
  benefits.splice(declarationIndex, 1);
  return benefits;
}

const makeAdditionalBenefits = (policyCoverage: PolicyCoverge[], languageData: LanguageData) => {
  const benefits = removeDefaultBenefits(policyCoverage, languageData);
  const mappedBenefits = benefits?.filter(item => Number(item?.premiumInfo?.finalPremium) > 0).
    map(item => ({ 'coverageCode': item?.coverageCode }));
  return mappedBenefits;
}

// convert the array structure from payload request to additional benefits functionality updated
function additionalBenefits(policyCoverage:PolicyCoverge[], languageData: LanguageData) {
  const benefits = removeDefaultBenefits(policyCoverage, languageData);
  const mappedBenefits = benefits?.filter(item => Number(item?.premiumInfo?.finalPremium) > 0).
    map((item, index) => ({ 'code': item?.coverageCode, 'title': item.coverageName, 'price': item?.premiumInfo?.finalPremium, id: `${(index + 1)}_homebenefits`  }));
  return mappedBenefits;
}

const renewalPayloadRequest = (data: { [key: string]: string }, languageData: LanguageData) => {
  const policyCustomer = data?.policyCustomer[0];
  const policyRisk = data?.policyLob[0]?.policyRisk[0];
  const policyLob = data?.policyLob[0];
  const policyBasic = data?.policyBasic;
  const policyCustomerData = {
    ownerOrTenant: policyLob?.ownerOrTenant,
    effectiveDate: formatDate(policyBasic?.expiryDate),
    riskDescription: policyLob?.riskDescription,
    policyCustomer: {
      nationalId: policyCustomer?.nationalId,
      gender: policyCustomer?.gender,
      nationality: policyCustomer?.nationality,
      mobile: policyCustomer?.mobile,
      dateOfBirth: policyCustomer?.dateOfBirth
    },
    policyRisk: [{
      policyCoverage: [{
        coverageCode: languageData?.defaultCoverageCode
      }],
      cityDistrict: policyRisk?.cityDistrict,
      riskName: policyRisk?.riskName,
      yearOfConstruction: Number(policyRisk?.yearOfConstruction),
      country: policyRisk?.country,
      noOfFloors: policyRisk?.noOfFloors,
      buildingAge: policyRisk?.buildingAge,
      areaLocalityEn: policyRisk?.areaLocalityEn,
      streetNameEn: policyRisk?.streetNameEn,
      longitude: policyRisk?.longitude,
      latitude: policyRisk?.latitude,
      question1: policyRisk?.question1,
      question2: policyRisk?.question2,
      question3: policyRisk?.question3,
      question4: policyRisk?.question4,
      question5: policyRisk?.question5,
      question6: policyRisk?.question6,
      question7: policyRisk?.question7,
      question8: policyRisk?.question8,
      question9: policyRisk?.question9,
      question7Details: policyRisk?.question7Details,
      question6Details: policyRisk?.question6Details,
      question8Details: policyRisk?.question8Details,
      question9Details: policyRisk?.question9Details,
    }]
  }
  if (policyBasic?.schemeCode) {
    policyCustomerData['schemeCode'] = policyBasic.schemeCode;
  }
  return policyCustomerData;
}

const updateFormAddressSelection = (formAddressSelection: TyperFormAddressSelection, userInfo: UserInfo, showPropertyMap: PropertyMap, languageData: LanguageData) => {
  if (!userInfo) {
    return {};
  }
  const propertyId = formAddressSelection?.propertyNo > "0" && Number(formAddressSelection?.propertyNo) - 1 || "0";
  const address = userInfo?.addressData?.addresses[propertyId];

  return {
    policyCoverage: [{
      coverageCode: languageData?.defaultCoverageCode
    }],
    yearOfConstruction: Number(formAddressSelection?.propertyBuildYear),
    noOfFloors: Number(formAddressSelection?.propertyFloor),
    buildingAge: convertYear(formAddressSelection?.propertyBuildYear),
    cityDistrict: ucFirstAllWords(address.cityENG),
    areaLocalityEn: address?.shortAddress,
    streetNameEn: address?.streetENG,
    longitude: showPropertyMap?.longitude ? showPropertyMap?.longitude : address?.longitude,
    latitude: showPropertyMap?.latitude ? showPropertyMap?.longitude : address?.latitude,
    question9Details: languageData?.question9Details,
    question8Details: languageData?.question8Details,
    question7Details: languageData?.question7Details,
    question6Details: languageData?.question6Details,
  }
}

const updateCustomerAddressSelection = (userInfo: UserInfo) => {
  if (!userInfo) {
    return {};
  }


  return {
    nationalId: userInfo?.ownerId,
    gender: userInfo?.ownerDetail?.gender,
    nationality: userInfo?.ownerDetail?.nationality,
    dateOfBirth: apiFormatDate(userInfo?.ownerDetail?.ownerDobG),
    mobile: userInfo?.mobileNumber
  }
}

function usePropertyPayload() {
  const userAddressFormSelection = (payload, formAddressSelection, propsData, showPropertyMap, languageData, policyStartDate) => {
    return {
      ...payload,
      policyCustomer: {
        ...updateCustomerAddressSelection(propsData)
      },
      policyRisk: [{
        ...payload.policyRisk[0],
        ...updateFormAddressSelection(formAddressSelection, propsData, showPropertyMap, languageData),
      }],
      ownerOrTenant: (Number(formAddressSelection?.propertyType?.activeIndex) + 1),
      riskDescription: languageData?.insurance_covering_contents,
      effectiveDate: apiFormatDate(policyStartDate, '/'),
    }
  }

  const getRiskID = (premium: { [key: string]: string }, coverageType: string, defaultCoverageCode: string) => {
    const value = coverageType.replace(/\s+/g, '').toLowerCase()
    const purchasedCoverage = premium[value]?.purchasedCoverage?.filter((data: { coverageCode: string }) => data?.coverageCode === defaultCoverageCode)
    return purchasedCoverage[0]?.riskId;
  }

  const updateDeclarationItems = (payload, declartion, declare, riskID) => {
    const changedDeclarationItems: { [key: string]: number } = {};
    declare.forEach((item) => {
      if (!item?.value && declartion?.hasOwnProperty(item?.key)) {
        changedDeclarationItems[item?.key] = Number(declartion[item?.key]);
      }
    });
    return {
      ...payload,
      policyRisk: [{
        ...payload?.policyRisk[0],
        ...(Object.keys(changedDeclarationItems)?.length && changedDeclarationItems),
        ...{ riskId: riskID },
      }]
    }
  }

  return { init, getRiskID, userAddressFormSelection, updateDeclarationItems, renewalPayloadRequest, contentBenefitsDeclaration, additionalBenefits, makeAdditionalBenefits }

}

export default usePropertyPayload;

