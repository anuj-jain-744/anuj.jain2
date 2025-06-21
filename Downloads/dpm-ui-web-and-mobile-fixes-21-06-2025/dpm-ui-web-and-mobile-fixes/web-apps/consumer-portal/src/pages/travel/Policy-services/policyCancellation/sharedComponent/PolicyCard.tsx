import React from "react";
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

  return (
    prodcutCode === HOME ? (<Card className="right-card home-container">
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <img src={Home} alt="Flight Logo" className="logo-img" />
            
          </div>
          <div className="home-title">
            <div className="policy-type">
              <div className="cmp walaa-medium-500">{`${coverageName} `}</div>
            </div>
            <div className="content">
              <div className="walaa-medium-500 policy-number">{policyNumber}</div>
            </div>
          </div>
        </div>        
      </div>

      <hr className="horizontal-line" />

      <div className="content-container">
        <div className="user-details-section">
          <div className="label">{languageData?.policy_holder}</div>
          <div className="value">{policyHolder ?? "-"}</div>
        </div>
        <div className="date-section">
          <div className="section">
            <div className="label">{languageData?.start_date}</div>
            <div className="value">{startDate}</div>
          </div>
          <div className="section">
          <div className="label">{languageData?.expiry_date}</div>
          <div className="value">{expiryDate}</div>
          </div>
        </div>
        <div className="sum-insured">
          <div className="section">
            <div className="label">{languageData?.sum_insured}</div>
            <div className="value">{sumInsured ?? "-"}</div>
          </div>
          <div className="section">
          <div className="label">{languageData?.deductibles}</div>
          <div className="value"> {deductibles ? getAmountWithIcon(deductibles) : "-"}</div>
          </div>
        </div>
        <div className="address-section">
          <div className="label">{languageData?.property}</div>
          <div className="value">{displayHouseAddress(address, currentLanguage, ar)}</div>
        </div>
        
      </div>
    </Card>) :
    (<Card className="right-card">
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <img src={Travel_Logo} alt="Flight Logo" className="logo-img" />
          </div>
          <div className="content">
            <div>{policyNo}</div>
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