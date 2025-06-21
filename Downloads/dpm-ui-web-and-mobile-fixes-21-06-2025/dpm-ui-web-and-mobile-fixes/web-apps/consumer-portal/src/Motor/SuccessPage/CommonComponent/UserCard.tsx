import React from "react";
import { LanguageData } from "types/languageData";
import { getGenderProfileIcon, truncateName } from "utils/quoteAndBuy";
import { SuccessPagePolicyData } from "types/quoteAndBuy";
import { getLabelOfIqmaIdNationalId } from "@dpm/shared-module";

interface UserCardProps {
    policyData: SuccessPagePolicyData | undefined;
    languageData: LanguageData;
    }

    interface UserInfoProps { 
        label: string;
        value: string;
        className: string;
    }  

const UserCard:React.FC<UserCardProps> = ({ policyData, languageData }) => (
    <div className="policy-card">
      <div className="user-detail">
        <div>
          <img width={"40px"} height={"40px"} src={getGenderProfileIcon(policyData?.gender)} alt="user icon" />
        </div>
        <div className="policy-section">
          <div className="english-name walaa-medium-500" title={policyData?.customerNameEnglish}>
            {truncateName(policyData?.customerNameEnglish, 30)}
          </div>
          <div className="urdu-name walaa-medium-500">
            {policyData?.customerNameArabic}
          </div>
        </div>
      </div>
      <UserInfo 
        label={languageData && policyData?.nationalityId ? getLabelOfIqmaIdNationalId(policyData?.nationalityId, {national_id: languageData?.national_id, iqama_no: languageData?.iqama_no, field_corporate_id: languageData?.field_corporate_id}): ""}
        value={policyData?.nationalityId ?? ""}
        className="iqama-container"
      />
      <UserInfo 
        label={languageData?.mobile_number}
        value={policyData?.mobileNo ?? ""}
        className="mobile-number-container"
      />
    </div>
  );

  // UserInfo.tsx
const UserInfo:React.FC<UserInfoProps> = ({ label, value, className }) => (
    <div className={className}>
      <div className="walaa-regular-400">{label}</div>
      <div className="walaa-medium-500">{value}</div>
    </div>
  );

  export default UserCard;