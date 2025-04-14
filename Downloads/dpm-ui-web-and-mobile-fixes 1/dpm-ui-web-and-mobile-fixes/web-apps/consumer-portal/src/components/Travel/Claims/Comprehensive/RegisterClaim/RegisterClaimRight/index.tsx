// import VehicleSequenceNo from "./VehicleSequenceNo";
import PolicyCard from "Motor/Policy-services/PolicyCancellation/sharedComponent/PolicyCard";
import ClaimRegistrationDetails from "./ClaimRegistrationDetails";
import { useReviewPolicy } from "Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import NoteRight from "./NoteRight";
import { useEffect, useState } from "react";
import ErrorComponent from "components/ErrorComponent/Error";
import useLanguageData from "../../../../../../Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData";

 
interface IRegisterClaimRight {
  claimsInfo: any;
  validationData: any;
}

  
const RegisterClaimRight = ({
  claimsInfo,
  validationData,
}: IRegisterClaimRight) => {

  // const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<string | undefined>(policyNumber);
  const [selectedPolicyNumber, setSelectedPolicyNumber] = useState<string | undefined>("P-OS01-25-605-000064");
  const { languageData } = useLanguageData()

  useEffect(() => { 
    localStorage.removeItem("selectedPolicyNumber"); 
    const storedPolicyNumber = localStorage.getItem("selectedPolicyNumber");
    if (storedPolicyNumber) {
      setSelectedPolicyNumber(storedPolicyNumber);
    } 
    const handleBeforeUnload = () => {
      localStorage.removeItem("selectedPolicyNumber");
    }; 
    window.addEventListener("beforeunload", handleBeforeUnload); 
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // TODO this click will be there on the click of slect policy need to include

  // const handlePolicySelect = (policyNumber: string) => {
  //   setSelectedPolicyNumber(policyNumber);
  //   localStorage.setItem("selectedPolicyNumber", policyNumber);
  // };

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

  if (policyError ) {
    return <ErrorComponent />;
  }

  const policyDetails = policyData?.policyDetails ?? undefined;
 
  return (
    <div className="right-card-container">
      
      {/* TODO : need to be remove after complete implimentation  */}

      {/* <VehicleSequenceNo
        claimsInfo={claimsInfo}
        validationData={validationData}
      /> */}

          {selectedPolicyNumber ? (
            <PolicyCard 
              policyNumber={selectedPolicyNumber}
              coverageName={"Comprehensive"}
              startDate={policyDetails?.startDate}
              expiryDate={policyDetails?.expiryDate} 
              startDateTitle={languageData?.start_date}
              expiryDateTitle={languageData?.expiry_date}
              policyNo={languageData?.policy_no}
              idvTitle={languageData?.insured_declared_value_idv}
              nationalId={languageData?.national_id}
              policyHolder={languageData?.policy_holder}
              prodCode={policyDetails?.prodCode}
              insurerName={policyDetails?.insurerName}
              nationalID={policyDetails?.nationalID} 
            />
        ) : (
            <p> did you know </p>
          )
          }  

      <ClaimRegistrationDetails />
      <NoteRight />
    </div>
  );
};

export default RegisterClaimRight;
