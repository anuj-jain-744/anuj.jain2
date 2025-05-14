import React, { useEffect, useState } from "react";
import { Accordion, Container } from "react-bootstrap";
import {
  PolicyHolderDetails,
  PolicyPremiumAndBenefits,
  VehicleDetails,
  HolderDetails,
  PolicyDetails,
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
import { TRAVEL, HOME, PRODUCTS_CODE } from "constant"
import "./index.scss";

interface PolicyAccordionLinksProps {
  details: {
    policyHolderDetails: PolicyHolderDetails | null;
    vehicleDetails: VehicleDetails[] | null;
    policyPremiumAndBenefits: PolicyPremiumAndBenefits | null;
    policyDetails?: PolicyDetails | null;
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
    policyDetails: null,
  },
  languageData: undefined,
}) => {
  const { policyHolderDetails, vehicleDetails, policyPremiumAndBenefits } = details;

  const holderDetails = getHolderDetails(policyHolderDetails, languageData);

  const address: string = formatAddress(policyHolderDetails?.address);
  const sumInsured: string = getFormattedPrice(policyPremiumAndBenefits?.sumInsured);
  const premiumAmount: string = getFormattedPrice(policyPremiumAndBenefits?.premiumAmount);

  const renderPolicyByCategory=(type: string | undefined)=>{
    
    const checkProd=type?PRODUCTS_CODE[type]:"02"
    switch (checkProd) {
      
      case "01":
        return(
          <>
          <DriverDetails languageData={languageData} holderDetails={holderDetails} address={address} navigateTo={navigateTo}/>
          <VehicleDetailsSection
            vehicleValue={vehicleDetails}
            languageData={languageData}
          />
         
        </>
        )
        case "03":
          break;
      default:
        break;
    }

  }
   
  return (
    <Container className="policyacc-mainContainerBox p-0">
      <Accordion className="policyacc-mainContainer walaa-regular-400">
        <div className="policyacc-container">
          <PolicyHolder languageData={languageData} holderDetails={holderDetails} address={address} />
          {renderPolicyByCategory(productcode)}
          <PolicyPremiumAndBenefitsSection sumInsured={sumInsured} premiumAmount={premiumAmount} languageData={languageData} />
          <PolicyAdditionalPackages navigateTo={navigateTo} selectedPolicyNumber={selectedPolicyNumber} languageData={languageData} />
          <TermsAndConditions
            languageData={languageData}
            productcode={productcode}
            coverageName={details.policyDetails?.coverageName}
          />
        </div>
      </Accordion>
    </Container>
  );
}

export default PolicyAccordionLinks;