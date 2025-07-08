import React , {useState} from "react";
import "./PolicyCard.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAmountWithIcon } from '@app-shell/utils/common';
import Travel_Logo from "assets/Dashboard/Travel_MyRequest.svg"
import Home from "assets/Dashboard/Home.svg"
import { Card } from "react-bootstrap";
import { displayHouseAddress } from "utils/quoteAndBuy";
import { useCommonContext } from "@dpm/shared-module";
import { commonKeywords } from "constant";
import { LanguageData } from "types/languageData";
import { TRAVEL_PLAN_TYPE, HOME } from "constant";
import ChevronUp from "assets/Dashboard/chevronUp.svg";
import ChevronDown from "assets/Dashboard/chevronDown.svg";
import Union from "assets/Dashboard/unionPolicyCard.svg";
interface PolicyCardProps {
  policyNumber?: string;
  startDate?: string;
  expiryDate?: string;
  policyNo?: string;
  coverageName?: string;
  policyPeriod?: string;
  travelTypeLabel?: string;
  travelType?: string;
  languageData?: LanguageData;
  prodcutCode?: string;
  address?:{streetName?:string, city?:string, country?:string, postCode?:string};
  policyHolder?:string;
  deductibles?:string;
  sumInsured?:string;
}

const PolicyCard: React.FC<PolicyCardProps> = ({
  policyNumber,
  startDate,
  expiryDate,
  policyNo,
  coverageName,
  policyPeriod,
  travelTypeLabel,
  travelType,
  languageData,
  prodcutCode,
  address,
  policyHolder,
  deductibles,
  sumInsured
}) => {
  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  const DateSection = (
    { label, dateStart, dateEnd  }:
    { label: string; dateStart: string; dateEnd: string }) => (
    <div className="date-section">
      <div>{label}</div>
      <div className="policy-date walaa-medium-500">
        {dateStart} - {dateEnd}
      </div>
    </div>
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    prodcutCode === HOME ? (<Card className="right-card home-container">
      <div className="home-header">
        <div className="home-header-content">
        <div className="home-content">
        <div className="home-policy-number-label">{policyNo}</div>
        <div className="walaa-medium-500 home-policy-number">
        <div>{policyNumber}</div>
                  <div className="accordion-icon" onClick={toggleAccordion}><img src={isOpen ? ChevronDown : ChevronUp}/></div>

                </div>
              </div>

            </div>

          <div className="home-logo">
            <img src={Home} alt="Home Logo" className="home-logo-img" />

          </div>
                <div className="policy-type plan-type walaa-medium-500">
                      <div className="item-type">
                      {`${coverageName} `}
                      </div>


                      </div>

                      <div className="policy-card-union">
      <img src={Union} />
    </div>
         </div>

              {!isOpen && <div className="policy-body-cont">

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
        {getAmountWithIcon(sumInsured)}
      </div>
    </div>
  </div>
  <div className="col col-period">
    <div className="d-flex flex-column">
      <div className="policy-content-label">
        {languageData?.policy_period}
      </div>
      <div className="policy-content-label-value">
      {startDate} - {expiryDate}
      </div>
    </div>
  </div>
</div>

</div>
              }



             </Card>) :
    (<Card className="right-card">
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <img src={Travel_Logo} alt="Flight Logo" className="logo-img" />
          </div>
          <div className="content">
            <div className="policy-title">{policyNo}</div>
            <div className="walaa-medium-500 policy-number">{policyNumber}</div>
          </div>
        </div>
        <div className="policy-type">
        <div className="cmp walaa-medium-500">{`${coverageName}-${TRAVEL_PLAN_TYPE.type_traveller} `}</div>
        </div>
      </div>

      <hr className="horizontal-line" />

      <div className="date">

        <DateSection
          label={policyPeriod ?? ""}
          dateStart={startDate ?? ""}
          dateEnd={expiryDate ?? ""}
        />
        <div className="date-section">
          <span>{travelTypeLabel}</span>
          <div className="walaa-medium-500">
            {travelType}
          </div>
        </div>
      </div>


    </Card>)
  );
};

export default PolicyCard;