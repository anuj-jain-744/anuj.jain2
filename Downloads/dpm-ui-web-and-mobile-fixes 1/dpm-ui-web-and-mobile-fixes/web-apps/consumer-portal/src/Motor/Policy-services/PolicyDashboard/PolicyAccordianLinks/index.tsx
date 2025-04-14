import React, { useEffect, useState } from "react";
import { Accordion, Container } from "react-bootstrap";
import {
  PolicyHolderDetails,
  PolicyPremiumAndBenefits,
  VehicleDetails,
  HolderDetails,
} from "types/policyDetails";
import { LanguageData } from "types/languageData";
import {
  getVehicleLicense,
  formatAddress,
  getGender,
  getFormattedPrice,
} from "utils/policyDetails";
import { getAge } from "utils/getAge";
import VehicleDetailsSection from "./VehicleDetailsSection";
import PolicyPremiumAndBenefitsSection from "./PolicyPremiumAndBenefitsSection";
import TermsAndConditions from "./TermsAndConditions";
import PolicyAdditionalPackages from "./PolicyAdditionalPackages";
import PolicyHolder from "./PolicyHolder";
import DriverDetails from "./DriverDetails"; 
import { capitalizeNameFirstLetter } from "@dpm/shared-module";
import "./index.scss";

interface PolicyAccordionLinksProps {
  details: {
    policyHolderDetails: PolicyHolderDetails | null;
    vehicleDetails: VehicleDetails[] | null;
    policyPremiumAndBenefits: PolicyPremiumAndBenefits | null;
  };
  navigateTo?: (url: string) => void;
  selectedPolicyNumber?: string;
  languageData?: LanguageData;
  productcode?: string;
}

const getHolderDetails = (policyHolderDetails: PolicyHolderDetails | null, languageData: LanguageData | undefined): HolderDetails => ({
  [languageData?.insurance_name ?? ""]: policyHolderDetails?.customerNameEnglish
    ? capitalizeNameFirstLetter(policyHolderDetails.customerNameEnglish)
    : "",
  [languageData?.id_number ?? ""]: policyHolderDetails?.idNumer,
  [languageData?.gender ?? ""]: getGender(policyHolderDetails?.gender),
  [languageData?.age ?? ""]: policyHolderDetails?.dateOfBirth && getAge(policyHolderDetails?.dateOfBirth),
  [languageData?.license_type ?? ""]: getVehicleLicense(policyHolderDetails?.licenseType),
});



const PolicyAccordionLinks: React.FC<PolicyAccordionLinksProps> = ({ 
  details, 
  languageData, 
  navigateTo, 
  selectedPolicyNumber,
  productcode } = {
  details: {
    policyHolderDetails: null,
    vehicleDetails: null,
    policyPremiumAndBenefits: null,
  },
  languageData: undefined,
}) => {
  const { policyHolderDetails, vehicleDetails, policyPremiumAndBenefits } = details;

  const holderDetails = getHolderDetails(policyHolderDetails, languageData);

  const address: string = formatAddress(policyHolderDetails?.address);
  const sumInsured: string = getFormattedPrice(policyPremiumAndBenefits?.sumInsured);
  const premiumAmount: string = getFormattedPrice(policyPremiumAndBenefits?.premiumAmount);
 
   
  return (
    <Container className="policyacc-mainContainerBox p-0">
      <Accordion className="policyacc-mainContainer walaa-regular-400">
        <div className="policyacc-container">
          <PolicyHolder languageData={languageData} holderDetails={holderDetails} address={address} />
          
          {productcode !== 'TRVL' && (
              <>
                <DriverDetails languageData={languageData} holderDetails={holderDetails} address={address} />
                <VehicleDetailsSection
                  vehicleValue={vehicleDetails}
                  languageData={languageData}
                />
                <PolicyPremiumAndBenefitsSection sumInsured={sumInsured} premiumAmount={premiumAmount} languageData={languageData} />
              </>
            )}

          <PolicyAdditionalPackages navigateTo={navigateTo} selectedPolicyNumber={selectedPolicyNumber} languageData={languageData} />
          <TermsAndConditions languageData={languageData} />
        </div>
      </Accordion>
    </Container>
  );
}

export default PolicyAccordionLinks;