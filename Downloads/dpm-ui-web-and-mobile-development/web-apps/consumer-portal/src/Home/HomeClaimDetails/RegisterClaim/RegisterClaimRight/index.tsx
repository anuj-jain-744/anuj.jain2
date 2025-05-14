import React, { FC, useMemo } from "react";
import "./index.scss";
import { LanguageData } from "types/languageData";
import PolicyInfo from "Home/Components/PolicyInfo";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";
import { ViewPolicy } from "types/endorsement";

interface PolicyCardProps {
  languageData: LanguageData;
  viewPolicy: ViewPolicy;
}

const RegisterClaimRight: FC<PolicyCardProps> = ({ languageData, viewPolicy }) => {
  const policyInfo = useMemo(() => (<PolicyInfo languageData={languageData} viewPolicy={viewPolicy} />), [viewPolicy])

  return (
    <div className="select-policy-right-card">
      {policyInfo}
      <DidYouKnowCard
        did_you_know_content={languageData?.please_note_content}
        did_you_know_text={languageData?.please_note}
      />
    </div>
  );
}

export default RegisterClaimRight;