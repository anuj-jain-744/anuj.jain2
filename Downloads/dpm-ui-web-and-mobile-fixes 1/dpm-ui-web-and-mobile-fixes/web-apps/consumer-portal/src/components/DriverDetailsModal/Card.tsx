import React from "react";
import style from "./DriverDetailsModal.module.scss";
import verticleLine from "assets/QuoteAndBuy/verticleLine.svg";
import driver from "assets/QuoteAndBuy/driver.svg";
import { LanguageData } from "types/languageData";
import { getGender } from "utils/policyDetails";
import { getCodeDesc } from "utils/MasterData";

interface DriverDetailsModalProps { 
  languageData: LanguageData | undefined | null;
  driverData?: any | undefined | null;
  driverRelation?: any | undefined | null;
}



const Card: React.FC<DriverDetailsModalProps> = ({languageData, driverData, driverRelation}) => {
  return (
    <div className={style.card}>
      <div className={style.cardContainer}>
        <div className={style.cardTitle}>
          <div className={style.cardHeading}>
            <div className={style.cardIcon}>
              <img src={driver} alt={'driver icon'} />
            </div>
          </div>
        </div>
        <div className={style.cardContent}>
          <div className={style.cardContentTitle}>{driverData?.driverName}</div>
          <div className={style.cardContentValue}>{driverData?.driverNameArabic}</div>
        </div>
      </div>
      <div className={style.content}>
        <div className={style.contentHolder}>
          <div className={style.contentValue}>
            <div className={style.contentValueInput}>{languageData?.iqama_no}.</div>
            <div className={style.contentValueInputValue}>{driverData?.driverID}</div>
          </div>
        </div>
        <img src={verticleLine} alt="verticle line" />
        <div className={style.contentHolder}>
          <div className={style.contentValue}>
            <div className={style.contentValueInput}>{languageData?.dob}</div>
            <div className={style.contentValueInputValue}>{driverData?.dateofBirth}</div>
          </div>
        </div>
        <img src={verticleLine} alt="verticle line" />
        <div className={style.contentHolder}>
          <div className={style.contentValue}>
            <div className={style.contentValueInput}>{languageData?.gender}</div>
            <div className={style.contentValueInputValue}>{getGender(driverData?.gender)}</div>
          </div>
        </div>
        <img src={verticleLine} alt="verticle line" />
        <div className={style.contentHolder}>
          <div className={style.contentValue}>
            <div className={style.contentValueInput}>{languageData?.driver_relation}</div>
            <div className={style.contentValueInputValue}>{getCodeDesc(driverRelation, driverData?.relation)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
 

export default Card;
