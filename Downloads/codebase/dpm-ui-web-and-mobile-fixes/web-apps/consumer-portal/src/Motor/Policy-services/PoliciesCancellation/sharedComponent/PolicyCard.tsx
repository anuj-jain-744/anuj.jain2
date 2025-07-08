import React, { useEffect, useState } from "react";
import "./PolicyCard.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import flight from "assets/Dashboard/Travel-icon.svg";
import Home from "assets/Dashboard/Home.svg"
import Ellipse from "assets/Dashboard/Ellipse_icon.svg";
import Motor from "assets/Dashboard/motorPolicyCard.svg";
import Union from "assets/Dashboard/unionPolicyCard.svg";
import ChevronUp from "assets/Dashboard/chevronUp.svg";
import ChevronDown from "assets/Dashboard/chevronDown.svg";
import { Card } from "react-bootstrap";
import { TRAVEL, HOME, MOTOR, MOTOR_COMP } from "constant";
import { formatDate } from "utils/formatDate";
import { getAmountWithIcon } from "@app-shell/utils/common";

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
  plateNumber?: string;
  vehicleMakeModel?: string;
  repairType?: string;
}
type ProductClaimMap<T extends string> = {
  [key in T]: {
    imageSrc: string;
    policyNo: string;
    policyNumber:string;
    coverageName:string;
  };
};

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
  plateNumber,
  vehicleMakeModel,
  repairType
}) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

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
  const productObj:ProductClaimMap<string> = {
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
      imageSrc: Motor ?? '',
      policyNo: policyNo ?? '',
      policyNumber:policyNumber ?? '',
      coverageName:coverageName ?? ''
    },
    RMCOM: {
      imageSrc: Motor ?? '',
      policyNo: policyNo ?? '',
      policyNumber:policyNumber ?? '',
      coverageName:coverageName ?? '',
    }
  };

  const DateSection = ({ label, startDate, endDate }: { label: string; startDate: string; endDate: string }) => (
    <div className="date-section">
      <div className="policy-date-label">{label}</div>
      <div className="policy-date walaa-medium-500">
        {startDate && formatDate(startDate)}
        {startDate && endDate && " - "}
        {endDate && formatDate(endDate)}
      </div>
    </div>
  );

  return (
    <div className="policy-card-containers">
    <Card className="right-card">
      {(prodCode === HOME) ? (
        <div className="header">
          <div className="header-content">
            <div className="logo">
              <img src={productObj[prodCode]?.imageSrc} alt="flight Logo" className="logo-img" />
            </div>
            <div className="content">
              <div className="policy-title">{policyNo}</div>
              <div className="walaa-medium-500 policy-number">{productObj[prodCode]?.policyNumber}</div>
              <div className="policy-type travel">
                <div className="cmp walaa-medium-500">{productObj[prodCode]?.coverageName}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        prodCode && (
          <div className="header">
            <div className="header-content">
              <div className="content">
                <div className="policy-number-label">{policyNo}</div>
                <div className="walaa-medium-500 policy-number">
                  <div>{productObj[prodCode]?.policyNumber}</div>
                  <div className="accordion-icon" onClick={toggleAccordion}><img src={isOpen ? ChevronDown : ChevronUp}/></div>

                </div>
              </div>

            </div>

            <div className="logo">
              <img
                src={productObj[prodCode]?.imageSrc}
                alt="Car Logo"
                className="logo-img"
              />
            </div>

            <div className="policy-type plan-type walaa-medium-500">
                <div className="item-type">
                  {productObj[prodCode]?.coverageName}

                {prodCode === MOTOR_COMP &&(<>

                  <img src={Ellipse} />

                  {repairType}

                </>)}
                </div>
              </div>

          </div>
        )
      )}

      {!isOpen && (<div className="policy-card-body-section">
        <div className="policyDocucard">
            <div className="car-model-container">
              <div className="model">{vehicleMakeModel}</div>
              <div className="plate walaa-medium-500">{plateNumber}</div>
            </div>
            <DateSection
              label={"Policy Period" ?? ""}
              startDate={startDate ?? ""}
              endDate={expiryDate ?? ""}
            />
        </div>

        {prodCode === TRAVEL || prodCode === HOME || prodCode === MOTOR ? (
          <></>
        ) : (
          <div className="idv">
            <div className="idv-content">{idvTitle}</div>
            <div className="idv-value walaa-medium-500">
              {getAmountWithIcon(idvValue)}
            </div>
          </div>
        )}
        {prodCode === HOME && (
          <div className="idv">
            <div className="idv-content">{addressTitle}</div>
            <div className="idv-value walaa-medium-500">{address}</div>
          </div>
        )}
      </div>)}
    </Card>
    <div className="policy-card-union">
      <img src={Union} />
    </div>
    </div>
  );
};

export default PolicyCard;