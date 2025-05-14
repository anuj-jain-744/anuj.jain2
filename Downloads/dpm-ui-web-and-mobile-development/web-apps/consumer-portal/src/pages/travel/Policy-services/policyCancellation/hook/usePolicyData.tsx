import { capitalizeNameFirstLetter } from "@dpm/shared-module";
import { useMemo } from "react";
import { PolicyHolderDetails, PolicyCard, PolicyDetails } from "types/policyDetails";
import { PolicyDataProps } from "types/viewQuote";

const noValue = "Not available";

const usePolicyData = (data: PolicyDataProps | null) => {
  return useMemo(() => {
    if (!data) {
      return {
        policyDetails: null,
        policyHolderDetails: null,
        policyCard: null,
        policyRisk: null
      };
    }

    const customer = data?.policyCustomer[0];
    const policy = data?.policyBasic;
    const policyLob = data?.policyLob[0]?.policyRisk[0];

    const policyDetails: PolicyDetails = {
      policyNo: policy?.policyNumber ?? "",
      startDate: policy?.effectiveDate ?? "",
      expiryDate: policy?.expiryDate ?? "",
      travelType: data?.policyLob[0]?.familyIndividual ?? "",
      coverageName: data?.policyLob[0]?.typeOfCoverage ?? "",
      travelerName: policyLob?.travellerNameEnglish ?? "",
    };

    const policyHolderDetails: PolicyHolderDetails = {
      customerNameEnglish: capitalizeNameFirstLetter(customer?.customerNameEnglish ?? ""),
      customerNameArabic: customer?.customerNameArabic ?? "",
      dateOfBirth: customer?.dateOfBirth,
      idNumer: customer?.nationalId || noValue,
      gender: customer?.gender,
      licenseType: policyLob?.drivers ? policyLob?.drivers[0]?.licenseType : noValue,
      address: {
        streetName: customer?.primaryAddress?.streetName,
        city: customer?.primaryAddress?.city,
        country: customer?.primaryAddress?.country,
        postCode: customer?.primaryAddress?.postCode
      },
    };

    const policyCard: PolicyCard = {
      customerNameEnglish: customer?.customerNameEnglish ?? "",
      customerNameArabic: customer?.customerNameArabic ?? "",
      nationalId: customer?.nationalId || noValue,
      dateOfBirth: customer?.dateOfBirth,
      nationality: customer?.nationality || noValue,
      mobileNo: customer?.mobile || noValue,
      address: {
        streetName: customer?.primaryAddress?.streetName,
        city: customer?.primaryAddress?.city,
        country: customer?.primaryAddress?.country,
        postCode: customer?.primaryAddress?.postCode
      },
    };


    return {
      policyDetails,
      policyHolderDetails,
      policyCard,
      policyRisk: policyLob
    };
  }, [data]);
};

export default usePolicyData;