import { FC } from "react";
import Home from "assets/Home/home-icon.svg";
import { useCommonContext } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import { formatDate } from "utils/formatDate";
import { displayHouseAddress } from "utils/quoteAndBuy";
import { commonKeywords } from "constant";
import { ViewPolicy } from "types/endorsement";
import { getSumInsuredDeductible } from "utils/policyDetails"
import { getAmountWithIcon } from "@app-shell/utils/common";

interface PolicyCardProps {
  languageData: LanguageData | null;
  viewPolicy: ViewPolicy;
}

const PolicyInfo: FC<PolicyCardProps> = ({ languageData, viewPolicy }) => {
  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  const policyLob = viewPolicy?.policyLob[0];
  const policyRisk = policyLob?.policyRisk;
  const policyBasic = viewPolicy?.policyBasic;
  const name = viewPolicy?.policyCustomer[0];
  const address = policyRisk[0];

  const sumInsuredDeductible = getSumInsuredDeductible(policyRisk);

  return (
    <div className="policy-claim-info">
      <div className="policy-header">
        <div className="policy-inner-container">
          <div className="policy-logo">
            <img src={Home} alt="" />
          </div>
          <div className="policy-header-right">
            <div className="policy-label">{languageData?.policy_no}</div>
            <div className="policy-header-number">{policyBasic?.policyNumber}</div>
          </div>
        </div>
        <div className="policy-header-planname">
          <div className="policy-palnname">{policyLob?.planCode}</div>
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
              {ar === currentLanguage ? name?.customerNameArabic : name?.customerNameEnglish}
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
              {formatDate(policyBasic?.effectiveDate)}
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
              {getAmountWithIcon(sumInsuredDeductible?.sumInsured)}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column">
            <div className="policy-content-label">
              {languageData?.deductible}
            </div>
            <div className="policy-content-label-value">
              {getAmountWithIcon(sumInsuredDeductible?.minDeductible)}
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