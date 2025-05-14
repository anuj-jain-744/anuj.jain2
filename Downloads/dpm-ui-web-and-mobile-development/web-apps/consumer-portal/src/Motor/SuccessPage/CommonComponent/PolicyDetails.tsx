import React from 'react';
import { CURRENCY } from '../../../constant';
import { LanguageData } from 'types/languageData';
import { PolicyDataProps } from "types/viewQuote";
import PolicyItem from './PolicyItem';
import PolicyStatus from './PolicyStatus';
import { SuccessPagePolicyData } from 'types/quoteAndBuy';
import { getAmountText } from '@dpm/shared-module';
import { getPlanName } from "utils/policyDetails";
import { getAmountWithIcon } from "@app-shell/utils/common";
interface PolicyDetailsProps {
  languageData: LanguageData;
  policyNum: string | undefined;
  policyData: SuccessPagePolicyData | undefined;
  policyPeriod: string;
  isEndosementPolicy: boolean;
  planDetails: PolicyDataProps | null;
}

const PolicyDetails: React.FC<PolicyDetailsProps> = ({ languageData, policyNum, policyData, planDetails, policyPeriod, isEndosementPolicy }) => (
  <div className="policy-details-container">
    <div className="policy-section">
      <PolicyItem
        label={languageData?.policy_no}
        value={policyNum}
      />
      {!isEndosementPolicy ? <PolicyItem
        label={languageData?.premium_amount}
        value={getAmountWithIcon(policyData?.premiumAmount)}
        isPremium
      /> : <div className='policy-header-planname'>{getPlanName(planDetails)}</div>}
    </div>
    {!isEndosementPolicy &&
      <div className="policy-section">
        <PolicyItem
          label={languageData?.policy_period}
          value={policyPeriod}
        />
        <PolicyItem
          label={languageData?.coverage_plan}
          value={getPlanName(planDetails, true)}
        />
      </div>
    }
    {!isEndosementPolicy && <PolicyStatus confirmed={languageData?.confirmed} />}
  </div>
);

export default PolicyDetails;