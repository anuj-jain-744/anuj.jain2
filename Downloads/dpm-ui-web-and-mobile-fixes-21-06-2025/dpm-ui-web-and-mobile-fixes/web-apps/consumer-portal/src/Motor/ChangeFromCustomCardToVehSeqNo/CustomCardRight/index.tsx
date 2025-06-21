import PolicyCard from "Motor/Policy-services/PoliciesCancellation/sharedComponent/PolicyCard";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import { LanguageData } from "types/languageData";
import { getPriceFormat } from "utils/getPriceFormat";
import "../ChangeFromCustomCardToVehSeqNo.scss";
import { PolicyDetails } from "types/policyDetails";

interface ICustomCardRight {
  policyDetails: PolicyDetails;
  languageData?: LanguageData;
}

const CustomCardRight = ({ policyDetails, languageData }: ICustomCardRight) => {

  return (
    <div className="right-card-policy">
      <PolicyCard
        policyNumber={policyDetails?.policyNo}
        startDate={policyDetails?.startDate}
        expiryDate={policyDetails?.expiryDate}
        idvValue={
          policyDetails?.idv
            ? `${languageData?.sar} ${getPriceFormat(
                parseInt(policyDetails?.idv)
              )}`
            : `${languageData?.not_available}`
        }
        coverageName={policyDetails?.coverageName}
        startDateTitle={languageData?.start_date}
        expiryDateTitle={languageData?.expiry_date}
        policyNo={languageData?.policy_no}
        idvTitle={languageData?.sum_insured}
        prodCode={policyDetails?.prodCode}
      />
      <DidYouKnowCard
        did_you_know_content={languageData?.did_you_know_content ?? ""}
        did_you_know_text={languageData?.did_you_know_text ?? ""}
      />
    </div>
  );
};

export default CustomCardRight;
