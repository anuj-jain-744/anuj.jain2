import React from 'react';
import { CURRENCY } from '../../../constant';
import { LanguageData } from 'types/languageData';
import { PolicyDataProps } from "types/viewQuote";
import PolicyItem from './PolicyItem';
import PolicyStatus from './PolicyStatus';
import { SuccessPagePolicyData } from 'types/quoteAndBuy';
import { getAmountText } from '@dpm/shared-module';
import { getPlanName } from "utils/policyDetails";

interface PolicyDetailsProps {
    languageData: LanguageData;
    policyNum: string | undefined   ;
    policyData: SuccessPagePolicyData | undefined;
    policyPeriod: string;
    planDetails: PolicyDataProps | null;
  }

const PolicyDetails: React.FC<PolicyDetailsProps>  = ({ languageData, policyNum, policyData, policyPeriod, planDetails }) => (
    <div className="policy-details-container">
      <div className="policy-section">
        <PolicyItem 
          label={languageData?.policy_no} 
          value={policyNum} 
        />
        <PolicyItem 
          label={languageData?.premium_amount} 
          value={`${CURRENCY} ${getAmountText(policyData?.premiumAmount)}`}
          isPremium 
        />
      </div>
      <div className="policy-section">
        <PolicyItem 
          label={languageData?.policy_period} 
          value={policyPeriod} 
        />
        <PolicyItem 
          label={languageData?.coverage_plan} 
          value={getPlanName(planDetails)} 
        />
      </div>
      <PolicyStatus confirmed={languageData?.confirmed} />
    </div>
  );

  export default PolicyDetails;