import { FC, useState } from "react";
import Home from "assets/Home/home-icon.svg";
import { useCommonContext } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import { formatDate } from "utils/formatDate";
import { displayHouseAddress } from "utils/quoteAndBuy";
import { commonKeywords } from "constant";
import { ViewPolicy } from "types/endorsement";
import { getSumInsuredDeductible } from "utils/policyDetails"
import { getAmountWithIcon } from "@app-shell/utils/common";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  const address = policyRisk[0];

  const sumInsuredDeductible = getSumInsuredDeductible(policyRisk);

  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="policy-claim-info">
      <div className="policy-header">
        <div className="policy-inner-container"> 
          <div className="policy-header-right">
            <div className="policy-label">{languageData?.policy_no}</div>
            <div className="policy-header-number"
             onClick={toggleAccordion}>{policyBasic?.policyNumber}
              {isOpen ? (
                <ExpandLessIcon style={{ marginLeft: "8px" }} />
                ) : (
                <ExpandMoreIcon style={{ marginLeft: "8px" }} />
                )
              }
             </div>
          </div>
          <div className="policy-logo">
            <img src={Home} alt="" />
          </div>
        </div>
        <div className="policy-header-planname">
          <div className="policy-palnname">{policyLob?.planCode}</div>
        </div>
      </div> 

  {isOpen && (
    <div className="policy-body-cont"> 

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

          <div className="row pt-3">
            <div className="col-5">
              <div className="d-flex flex-column">
                <div className="policy-content-label">
                  {languageData?.sum_insured}
                </div>
                <div className="policy-content-label-value">
                  {getAmountWithIcon(sumInsuredDeductible?.sumInsured)}
                </div>
              </div>
            </div>
            <div className="col col-period">
              <div className="d-flex flex-column">
                <div className="policy-content-label">
                  {languageData?.policy_period}
                </div>
                <div className="policy-content-label-value">
                {formatDate(policyBasic?.effectiveDate)} - {formatDate(policyBasic?.expiryDate)}
                </div>
              </div>
            </div>
          </div>

    </div>
  )}
  
    </div>
  );
};

export default PolicyInfo;