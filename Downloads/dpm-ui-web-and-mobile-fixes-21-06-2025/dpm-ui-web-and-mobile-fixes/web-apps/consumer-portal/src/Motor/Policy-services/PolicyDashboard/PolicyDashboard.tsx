import React, { useEffect, useState } from "react";
import PolicyAccordianLinks from "./PolicyAccordianLinks";
import PolicyDetails from "./PolicyDetails";
import "./PolicyDashboard.scss";
import usePolicyData from "./hooks/usePolicyData";
import PolicyCard from "./PolicyCard";
import DefaultSpinner from "components/Spinner";
import ErrorPage from "components/ErrorComponent/Error";
import useLanguageData from "../AccessPolicyDocuments/hooks/useLanguageData";
import { useReviewPolicy } from "./hooks/useReviewPolicy";
import { useLocation } from "react-router-dom";

interface Props {
  navigateTo?: (url: string) => void;
  policyInfo: {policyNo: string,endorsementNo: string, productCode: string};
}

const PolicyDashboard: React.FC<Props> = ({ navigateTo, policyInfo  }) => {
  const {policyNo, productCode} = policyInfo;
  const { languageData, isLoading: isLanguageLoading, error: languageError } = useLanguageData();
  const [error, setError] = useState<boolean>(false);
  const location= useLocation()

  const { makeApiCall, data, isLoading, error: policyError  } = useReviewPolicy({
    PolicyNo: policyNo!,
    Product: productCode,
  });

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        await makeApiCall();
      } catch (error) {
        setError(true);
      }
    };
    
    if (policyNo) {
      fetchPolicyData();
    }
  }, [location]);

  const policyData = usePolicyData(data);

 const productcode = policyData?.policyDetails?.prodCode;
 
 
  
  const {
    policyHolderDetails,
    vehicleDetails,
    policyPremiumAndBenefits,
    policyCard,
    policyDetails,
    driverList,
    benefitsList
  } = policyData ?? {
    policyHolderDetails: null,
    vehicleDetails: null,
    policyPremiumAndBenefits: null,
    policyCard: null,
    policyDetails: null,
    driverList: [],
    benefitsList: []
  };

  if (isLoading || isLanguageLoading) {
    return <DefaultSpinner />;
  }

  if (error || policyError || !languageData || languageError) {
    return <ErrorPage />;
  }

  return (
    <div className="policy-container">
      <div className="policy-left-panel">
        <PolicyDetails
          languageData={languageData}
          policyDetails={policyDetails}
          policyData={policyData}
          navigateTo={navigateTo}
          policyInfo={policyInfo}
          policyLob={data?.policyLob}
        />
        <PolicyAccordianLinks
          details={{
            policyHolderDetails,
            vehicleDetails,
            policyPremiumAndBenefits,
            policyDetails,
            driverList,
            benefitsList
          }}
          navigateTo={navigateTo}
          languageData={languageData}
          productcode={productcode}
          policyInfo={policyInfo}
        />
      </div>
      <div className="policy-right-panel">
        <PolicyCard 
          languageData={languageData} 
          policyCardValue={policyCard} 
        />
      </div>
    </div>
  );
};

export default PolicyDashboard;