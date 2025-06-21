import React from 'react';
import { LanguageData } from 'types/languageData';
import { PolicyDataProps } from "types/viewQuote";
import PolicyItem from './PolicyItem';
import PolicyStatus from './PolicyStatus';
import { SuccessPagePolicyData } from 'types/quoteAndBuy';
import { getPlanName } from "utils/policyDetails";
import { getAmountWithIcon } from "@app-shell/utils/common";
import {
  AddBenefitprops,
  PremiumBreakdownProps
} from "types/AddBenefit";
import { PRODUCTCODE_MOTOR } from 'constant';

interface EndorsementRedisDataProps {
  driversPremiumData: {
    driver: {
      driverID: string | undefined;
      driverName: string | undefined;
      driverNameArabic: string | undefined;
      relation: number | undefined;
      gender: string | undefined;
    };
    taxableAmount: number;
  }[];
  policyNo: string | undefined;
  vehicleSequenceNo: number | undefined;
  vehicleMakeText: string | undefined;
  vehicleModelText: string | undefined;
  sponsorName: string | undefined;
  plateNo: string | undefined;
  productType: string | undefined;
  benefitsPremiumData: AddBenefitprops[];
  totalAmount: PremiumBreakdownProps | {};
  nationalId: string | null;
}

interface PolicyDetailsProps {
  languageData: LanguageData;
  policyNum: string | undefined;
  policyData: SuccessPagePolicyData | undefined;
  policyPeriod: string;
  isEndosementPolicy: boolean;
  planDetails: PolicyDataProps | null;
  endorsementRedisData?: EndorsementRedisDataProps;
  imgSrc?: string;
}

const PolicyDetails: React.FC<PolicyDetailsProps> = ({ languageData, policyNum, policyData, planDetails, policyPeriod, isEndosementPolicy, endorsementRedisData = {}, imgSrc = "" }) => (
  <div className="policy-details-container">
    <div className="policy-section">
      {!isEndosementPolicy ? <PolicyItem
        label={languageData?.policy_no}
        value={policyNum}
      /> : (
        endorsementRedisData?.productType === PRODUCTCODE_MOTOR ? <PolicyItem
          label={endorsementRedisData?.vehicleMakeText + " " + endorsementRedisData?.vehicleModelText}
          value={endorsementRedisData?.plateNo}
          isEndosementPolicy={isEndosementPolicy}
          imgSrc={imgSrc}
        /> : <PolicyItem
          label={languageData?.policy_no}
          value={policyNum}
        />
      )}
      {!isEndosementPolicy ? <PolicyItem
        label={languageData?.premium_amount}
        value={getAmountWithIcon(policyData?.premiumAmount)}
        isPremium
      /> :
        (endorsementRedisData?.productType === PRODUCTCODE_MOTOR ? <PolicyItem
          label={languageData?.policy_holder_name}
          value={endorsementRedisData?.sponsorName}
          /> :<div className='policy-header-planname'>{endorsementRedisData?.coverageName}</div>)
        }
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