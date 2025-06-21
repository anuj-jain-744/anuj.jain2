import React from "react";
import { formatDate } from 'utils/formatDate';
import "./style.scss";
import { LanguageData } from "types/languageData";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";

interface IRenewalPolicy {
  languageData: LanguageData;
  isReviewPage?: boolean;
}

const RenewalPolicy: React.FC<IRenewalPolicy> = ({ languageData, isReviewPage = false }) => {
  const {
    homePolicyRenewal
  } = usePHQuoteBuyContext();

  const coverageValue = homePolicyRenewal.coverageType.replace(/\s+/g, '').toLowerCase() || null;

  const houseDetail = languageData[homePolicyRenewal.coveragePlan][0] || null;
  const houseDetailValue = houseDetail ? houseDetail[coverageValue] : null;
  return (
    <div className="renewal-policy-wrapper">
      <div className="policy-number-details">
        <div>
          <div className="policy-number-label">{languageData?.existing_policy_no}</div>
          <div className="policy-number-data">{homePolicyRenewal?.policyNumber}</div>
        </div>
        <div className="policy-number-expired-status">
          <span>{languageData?.policy_expiring_on} {formatDate(homePolicyRenewal?.expiryDate)}</span>
        </div>
      </div>
      {!isReviewPage && <div className="policy-number-benefits">
        <div className="left-box">
          <div className="label">{houseDetail?.benefits[0]}</div>
          <div className="heading">{houseDetailValue ? houseDetailValue[0] : ""}</div>
        </div>
        <div className="right-box">
          <div className="label">{houseDetail?.benefits[1]}</div>
          <div className="content">{houseDetailValue ? houseDetailValue[1] : ""}</div>
        </div>
      </div>}
    </div>
  );
};

export default RenewalPolicy;