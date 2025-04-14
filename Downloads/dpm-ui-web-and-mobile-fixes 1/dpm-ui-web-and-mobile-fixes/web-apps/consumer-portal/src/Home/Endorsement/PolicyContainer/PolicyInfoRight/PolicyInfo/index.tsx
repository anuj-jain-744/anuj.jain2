import React, { FC } from "react";
import Home from "assets/Home/home-icon.svg";
import { useCommonContext } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import { formatDate } from "utils/formatDate";
import { displayHouseAddress } from "utils/quoteAndBuy";
import { commonKeywords, HOME_COVERAGE_PLANS_TYPES } from "constant";
import { ViewPolicy } from "types/endorsement";

interface PolicyCardProps {
  languageData: LanguageData | null;
  viewPolicy: ViewPolicy;
}

const PolicyInfo: FC<PolicyCardProps> = ({ languageData, viewPolicy }) => {
  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  const policyRisk = viewPolicy?.policyLob[0];
  const policyBasic = viewPolicy?.policyBasic;
  const name = viewPolicy?.policyCustomer[0];
  const address = viewPolicy?.policyCustomer[0]?.primaryAddress;
  const coverageValue = policyRisk?.planCode?.replace(/\s+/g, '').toLowerCase() || null;
  const houseDetail = (languageData && languageData[HOME_COVERAGE_PLANS_TYPES[coverageValue]][0]) || null;
  const houseDetailValue = (houseDetail && coverageValue) ? houseDetail[coverageValue] : null;
  return (
    <div className="policy-claim-info">
      <div className="policy-header">
        <div>
          <img src={Home} alt="" />
        </div>
        <div className="policy-header-right">
          <div className="policy-header-planname">{policyRisk?.planCode}</div>
          <div className="policy-header-number">{policyBasic?.policyNumber}</div>
        </div>
      </div>
      <hr className="horizontal-line" />
      <div className="row pt-3">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="policy-content-label">
              {languageData?.policy_holder}
            </div>
            <div className="policy-content-label-value">
              {ar === 'ar' ? name?.customerNameArabic : name?.customerNameEnglish}
            </div>
          </div>
        </div>
      </div>
      <div className="row pt-3">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="policy-content-label">
              {languageData?.start_date}
            </div>
            <div className="policy-content-label-value">
              {formatDate(policyBasic?.quoteDate)}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column">
            <div className="policy-content-label">
              {languageData?.expiry_date}
            </div>
            <div className="policy-content-label-value">
              {formatDate(policyBasic?.expiryDate)}
            </div>
          </div>
        </div>
      </div>
      <div className="row pt-3">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="policy-content-label">
              {languageData?.sum_insured}
            </div>
            <div className="policy-content-label-value">
              {houseDetailValue ? houseDetailValue[0] : ""}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column">
            <div className="policy-content-label">
              {languageData?.deductible}
            </div>
            <div className="policy-content-label-value">
              {houseDetailValue ? houseDetailValue[1] : ""}
            </div>
          </div>
        </div>
      </div>
      <div className="row pt-3">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="policy-content-label">
              {languageData?.property}
            </div>
            <div className="policy-content-label-value">
              {displayHouseAddress(address, currentLanguage, ar)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyInfo;