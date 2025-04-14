import React, { useEffect, useState } from "react";
import style from "./PolicyContent.module.scss";
import PolicyRelatedDocuments from "./PolicyRelatedDocuments";
import PolicyCard from "../../../../Motor/Policy-services/PolicyCancellation/sharedComponent/PolicyCard"; 
import { LanguageData } from "types/languageData";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import { useReviewPolicy } from "Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import ErrorComponent from "components/ErrorComponent/Error";
import { BackFooter } from "components/index";
import { getPriceFormat } from "utils/getPriceFormat";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
 

interface PolicyContentProps {
  languageData?: LanguageData;
  isLanguageLoading?: boolean;
  languageError?: string | null;
  policyNumber?: string;
  navigateTo?: (url: string) => void;
}

const PolicyContent: React.FC<PolicyContentProps> = ({
  languageData,
  isLanguageLoading,
  languageError,
  policyNumber,
  navigateTo,
}) => {
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<string | undefined>(policyNumber);
   

  const {productName , setProductName} = useQuoteAndBuyContext(); 
  

  useEffect(() => {
    sessionStorage.removeItem("selectedPolicyNumber");

    const storedPolicyNumber = sessionStorage.getItem("selectedPolicyNumber");
    if (storedPolicyNumber) {
      setSelectedPolicyNumber(storedPolicyNumber);
    }

    const handleBeforeUnload = () => {
      sessionStorage.removeItem("selectedPolicyNumber");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handlePolicySelect = (policyNumber: string) => {
    setSelectedPolicyNumber(policyNumber);
    sessionStorage.setItem("selectedPolicyNumber", policyNumber);
  };

  const {
    makeApiCall,
    isLoading: isPolicyLoading,
    error: policyError,
    data,
  } = useReviewPolicy({ PolicyNo: selectedPolicyNumber! });
  const policyData = usePolicyData(data);

  useEffect(() => {
    if (selectedPolicyNumber) {
      const fetchData = async () => {
        await makeApiCall();
      };
      fetchData();
    }
  }, [makeApiCall, selectedPolicyNumber]);

  if (policyError || languageError) {
    return <ErrorComponent />;
  }

  const policyDetails = policyData?.policyDetails ?? undefined;
  const notAvailable = "Not available";
  
  return (
    <>
    <div className={style.wrapper}>
    <div className={style.policyContainer}>
        <div className={style.policyLeftPanel}>
          {/* <SelectPolicy
            onPolicySelect={handlePolicySelect}
            selectedPolicyNumber={selectedPolicyNumber}
          /> */}
          {languageData && selectedPolicyNumber && (
            <PolicyRelatedDocuments policyNumber={selectedPolicyNumber} languageData={languageData} />
          )}
        </div>
        <div className={style.policyRightPanel}>
          {selectedPolicyNumber ? ( 
           
            <PolicyCard
              policyNumber={selectedPolicyNumber}
              coverageName={"Comprehensive"}
              startDate={policyDetails?.startDate}
              expiryDate={policyDetails?.expiryDate}
              idvValue={policyDetails?.idv ? `SAR ${getPriceFormat(parseInt(policyDetails?.idv!))}` : notAvailable}
              startDateTitle={languageData?.start_date}
              expiryDateTitle={languageData?.expiry_date}
              policyNo={languageData?.policy_no}
              idvTitle={languageData?.insured_declared_value_idv}
              nationalId={languageData?.national_id}
              policyHolder={languageData?.policy_holder}
              prodCode={policyDetails?.prodCode}
              insurerName={policyDetails?.insurerName}
              nationalID={policyDetails?.nationalID} 
            setProductName={setProductName}
            />
            
          ) : (
            <DidYouKnowCard did_you_know_content={languageData?.did_you_know_content} 
            did_you_know_text={languageData?.did_you_know_text}  />
          )}
        </div>
      </div>
    </div>
      <BackFooter
        selectedPolicyNumber={selectedPolicyNumber}
        setSelectedPolicyNumber={setSelectedPolicyNumber}
        navigateTo={navigateTo}
      />
    </>
  )
};

export default PolicyContent;
