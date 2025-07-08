import PolicyCard from "Motor/Policy-services/PoliciesCancellation/sharedComponent/PolicyCard";
import ClaimRegistrationDetails from "./ClaimRegistrationDetails";
import NoteRight from "./NoteRight";
import { getPlanName } from "utils/policyDetails";
import { PolicyDataProps } from "types/viewQuote";
import { LanguageData } from "types/languageData";

interface PropTypes {
  policyNumber: string;
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
  policyData: PolicyDataProps;
}

const RegisterClaimRight = ({
  policyNumber,
  langData,
  policyData,
}: PropTypes) => {
  const policyDetails = policyData?.policyDetails ?? undefined;
  const policyholdename = policyData?.policyDetails?.insurerName;
  const coverageName = getPlanName(policyData);

  return (
    <div className="right-card-container">
      {policyNumber && policyDetails?.startDate && (
        <PolicyCard
          policyNumber={policyNumber}
          coverageName={coverageName}
          startDate={policyDetails?.startDate}
          expiryDate={policyDetails?.expiryDate}
          startDateTitle={langData.consumer?.start_date}
          expiryDateTitle={langData.consumer?.expiry_date}
          policyNo={langData.consumer?.policy_no}
          idvTitle={langData.consumer?.insured_declared_value_idv}
          nationalId={langData.consumer?.national_id}
          policyHolder={langData.consumer?.policy_holder}
          prodCode={policyDetails?.prodCode}
          insurerName={policyholdename}
          nationalID={policyDetails?.nationalID}
        />
      )}
      <ClaimRegistrationDetails langData={langData} />
      <NoteRight langData={langData?.consumer} />
    </div>
  );
};

export default RegisterClaimRight;
