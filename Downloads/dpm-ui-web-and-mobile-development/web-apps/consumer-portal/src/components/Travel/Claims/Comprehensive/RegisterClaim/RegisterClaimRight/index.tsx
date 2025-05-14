import { useEffect, useState } from "react";
import PolicyCard from "Motor/Policy-services/PoliciesCancellation/sharedComponent/PolicyCard"
import ClaimRegistrationDetails from "./ClaimRegistrationDetails";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";
import NoteRight from "./NoteRight"; 
import ErrorComponent from "components/ErrorComponent/Error";
import useLanguageData from "../../../../../../Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData";
import { getPlanName } from "utils/policyDetails";
import { PRODUCTCODE_TRAVEL, TRAVEL } from "constant";
import { useReviewPolicyTravel } from "pages/travel/Policy-services/policyCancellation/hook/useReviewPolicyTravel";
 
interface IRegisterClaimRight {
  policyNumber: string | undefined;
}

  
const RegisterClaimRight = ({
  policyNumber,
}: IRegisterClaimRight) => {
  
  const { languageData } = useLanguageData()
  const [policyDoc, setPolicyDoc] = useState({ data: null, error: null, loading: false });
  
  // TODO this click will be there on the click of slect policy need to include 
  const {
    makeApiCall,
    isLoading: isPolicyLoading,
    error: policyError,
    data,
  } = useReviewPolicyTravel({ PolicyNo: policyNumber! , Product: TRAVEL }); 
 
  const policyData = usePolicyData(data, PRODUCTCODE_TRAVEL); 
  
  useEffect(() => {
    if (policyNumber) {
      const fetchData = async () => {
        await makeApiCall();
      };
      fetchData();
    }
  }, [makeApiCall, policyNumber]);

  if (policyError ) {
    return <ErrorComponent />;
  }
 
  const policyDetails = policyData?.policyDetails ?? undefined;
  const policyholdename = policyData?.planDetails?.policyRisk[0]?.travellerNameEnglish 
    
// to get coverage type starts  
 // eslint-disable-next-line react-hooks/rules-of-hooks
 useEffect(() => {
    if (data && !policyDoc?.data) {
      setPolicyDoc((prev) => ({ ...prev, data: policyData, loading: false }));
    }
  }, [data, policyDoc?.data]); 
  

  const coverageName = getPlanName(policyData);
// to get coverage type starts

  
  return (
    <div className="right-card-container">  

          {policyNumber ? (
            <PolicyCard 
              policyNumber={policyNumber}
              coverageName={coverageName}
              startDate={policyDetails?.startDate}
              expiryDate={policyDetails?.expiryDate} 
              startDateTitle={languageData?.start_date}
              expiryDateTitle={languageData?.expiry_date}
              policyNo={languageData?.policy_no}
              idvTitle={languageData?.insured_declared_value_idv}
              nationalId={languageData?.national_id}
              policyHolder={languageData?.policy_holder}
              prodCode={policyDetails?.prodCode}
              // insurerName={policyDetails?.insurerName }
              insurerName={policyholdename}
              nationalID={policyDetails?.nationalID}
            />
        ) : (
            <></>
          )
          }  

      <ClaimRegistrationDetails />
      <NoteRight />
    </div>
  );
};

export default RegisterClaimRight;
