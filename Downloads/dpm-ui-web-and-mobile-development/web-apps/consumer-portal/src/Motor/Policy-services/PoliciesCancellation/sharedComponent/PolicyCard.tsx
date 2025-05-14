import React, { useEffect } from "react";
import "./PolicyCard.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Car from "assets/Claims/Car.svg";
import flight from "assets/Dashboard/Travel-icon.svg";
import Home from "assets/Dashboard/Home.svg"
import { Card } from "react-bootstrap";
import { TRAVEL, MOTOR, HOME , TRAVEL_PLAN_TYPE} from "constant";
import { formatDate } from "utils/formatDate";

interface PolicyCardProps {
  policyNumber?: string;
  startDate?: string;
  expiryDate?: string;
  idvValue?: number | string;
  policyNo?: string;
  coverageName?: string;
  startDateTitle?: string;
  expiryDateTitle?: string;
  idvTitle?: string;
  prodCode?: string;
  insurerName?: (val: string) => void;
  nationalId?: string;
  setProductName?: (val: string) => void;
  policyHolder?: string; 
  nationalID?: string;
  addressTitle?:string
  address?:string;
}
type ProductClaimMap<T extends string> = {
  [key in T]: {
    imageSrc: string;
    policyNo: string;
    policyNumber:string;
    coverageName:string;
  };
};
type ProductType = string;
const PolicyCard: React.FC<PolicyCardProps> = ({
  policyNumber,
  startDate,
  expiryDate,
  idvValue,
  policyNo,
  coverageName,
  startDateTitle,
  expiryDateTitle,
  idvTitle,
  prodCode,
  setProductName,
  insurerName,
  nationalId,
  policyHolder,
  nationalID,
  addressTitle,
  address,
}) => {


  useEffect(() => {
    switch (prodCode) {
      case "TRVL":
        setProductName && setProductName("Travel");
        break;
      case "Home":
        setProductName && setProductName("Home");
        break;
      default:
        setProductName && setProductName(prodCode || "");
        break;
    }
  }, [prodCode, setProductName]);
  const productObj:ProductClaimMap<ProductType> = {
    TRVL: {
      imageSrc: flight ?? '',
      policyNo: policyNo ?? '',
      policyNumber:policyNumber ?? '',
      coverageName:coverageName ?? ''
    },
    HOME: {
      imageSrc: Home ?? '',
      policyNo: policyNo ?? '',
      policyNumber:policyNumber ?? '',
      coverageName:coverageName ?? ''
    },
    RMTPL: {
      imageSrc: Car ?? '',
      policyNo: policyNo ?? '',
      policyNumber:policyNumber ?? '',
      coverageName:coverageName ?? ''
    },
    RMCOM: {
      imageSrc: Car ?? '',
      policyNo: policyNo ?? '',
      policyNumber:policyNumber ?? '',
      coverageName:coverageName ?? '',
    }
  };
// truncateName for sinsurance name starts 
  const truncateName = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  };
// truncateName for sinsurance name ends 

  const DateSection = ({ label, date }: { label: string; date: string }) => (
    <div className="date-section">
      <div>{label}</div>
      <div className="policy-date walaa-medium-500">
        {formatDate(date)}
      </div>
    </div>
  );

  return (
    <Card className="right-card">
      {(prodCode === HOME) ? (
        <div className="header">
          <div className="header-content">
            <div className="logo">
              <img src={productObj[prodCode]?.imageSrc} alt="flight Logo" className="logo-img" />
            </div>
            <div className="content">
              <div>{policyNo}</div>
              <div className="walaa-medium-500 policy-number">{productObj[prodCode]?.policyNumber}</div>
              <div className="policy-type travel">
                <div className="cmp walaa-medium-500">{productObj[prodCode]?.coverageName}</div>
              </div> 
            </div>
          </div>
        </div>
      ) : prodCode && (
        <div className="header">
          <div className="header-content">
            <div className="logo">
              <img src={productObj[prodCode]?.imageSrc} alt="Car Logo" className="logo-img" />
            </div>
            <div className="content">
              <div>{policyNo}</div>
              <div className="walaa-medium-500 policy-number">{productObj[prodCode]?.policyNumber}</div>
            </div>
          </div>
          <div className="policy-type">
            <div className="cmp walaa-medium-500">{productObj[prodCode]?.coverageName}</div>
          </div>
        </div>
      )}


      <hr className="horizontal-line" />
      
      {prodCode === "TRVL" && (
        <div className="date policyDocucard">
          <div className="nationaid">
            <DateSection label={startDateTitle ?? ""} date={startDate ?? ""} />
          </div> 
          <div className="policyholder">
            <DateSection label={expiryDateTitle ?? ""} date={expiryDate ?? ""} />
          </div>
        </div>
      )}
      
      {(prodCode === 'TRVL' || prodCode === HOME) ? (
      <></>
      ) : (
        <div className="idv">
          <div className="idv-content">{idvTitle}</div>
          <div className="idv-value walaa-medium-500">{idvValue}</div>
        </div>
      )}
      {prodCode === HOME && (
        <div className="idv">
         <div className="idv-content">{addressTitle}</div>
         <div className="idv-value walaa-medium-500">{address}</div>
       </div>
      )}
      
    </Card>
  );
};

export default PolicyCard;