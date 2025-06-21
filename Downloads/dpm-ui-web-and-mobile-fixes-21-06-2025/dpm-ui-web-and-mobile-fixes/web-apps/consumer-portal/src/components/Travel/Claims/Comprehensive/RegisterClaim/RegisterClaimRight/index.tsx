import PolicyCard from "Motor/Policy-services/PoliciesCancellation/sharedComponent/PolicyCard"
import ClaimRegistrationDetails from "./ClaimRegistrationDetails";
import NoteRight from "./NoteRight"; 
import useLanguageData from "../../../../../../Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData";
import { getPlanName } from "utils/policyDetails";
import { PolicyDataProps } from "types/viewQuote";

interface PropTypes {
  policyNumber: string;
  langData: Record<string, string>;
  policyData: PolicyDataProps;
}
  
const RegisterClaimRight = ({
  policyNumber,
  langData,
  policyData,
}: PropTypes) => {
  
  const { languageData } = useLanguageData()
  const policyDetails = policyData?.policyDetails ?? undefined;
  const policyholdename = policyData?.policyDetails?.insurerName 
  const coverageName = getPlanName(policyData);

  return (
    <div className="right-card-container">  

          {policyNumber && policyDetails?.startDate ? (
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
      <NoteRight langData={langData} />
    </div>
  );
};

export default RegisterClaimRight;
