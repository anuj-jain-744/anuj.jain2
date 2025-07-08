import React, { FC, useMemo } from "react";
import "./index.scss";
import { LanguageData } from "types/languageData";
import OrderSummary from "./OrderSummary";
import PolicyInfo from "Home/Components/PolicyInfo";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import { PolicyEndorsementDetails } from "types/endorsement";

interface PolicyCardProps {
  languageData: LanguageData;
  policyDetails: PolicyEndorsementDetails;
}

const PolicyInfoRight: FC<PolicyCardProps> = ({ languageData, policyDetails }) => {
  const { viewPolicy, benefitsClaimed, orderSummary } = policyDetails;
  const policyInfo = useMemo(() => (<PolicyInfo languageData={languageData} viewPolicy={viewPolicy} />), [viewPolicy])

  return (
    <div className="select-policy-right-card">
      {policyInfo}
      {
        (benefitsClaimed.length && orderSummary) ?
          <OrderSummary viewPolicy={viewPolicy} orderSummary={orderSummary} languageData={languageData} />
          : ''
      }
      <DidYouKnowCard
        did_you_know_content={languageData?.did_you_know_content}
        did_you_know_text={languageData?.did_you_know}
      />
    </div>
  );
}

export default PolicyInfoRight;