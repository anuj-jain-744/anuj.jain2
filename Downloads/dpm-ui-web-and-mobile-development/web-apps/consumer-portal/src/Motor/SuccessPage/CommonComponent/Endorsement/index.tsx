import React from "react";
import "./style.scss";
import { LanguageData } from "types/languageData";
import { AddDriverProps } from "types/endorsement";
import { geteDriverRelation } from "utils/quoteAndBuy";
import driverIcon from "assets/QuoteAndBuy/driver.svg";
import { capitalizeNameFirstLetter, getAmountText, getLabelOfIqmaIdNationalId } from "@dpm/shared-module";

export interface EndorsementSuccessProps {
  endorsementData: {
    benefitsPremiumData: {
      benefitNameEn: string;
      effectiveDate: string;
      benefitPrice: string;
    }[];
    driversPremiumData?: AddDriverProps[];
  };
  languageData: LanguageData;
}

const EndorsementSuccess: React.FC<EndorsementSuccessProps> = ({
  endorsementData,
  languageData,
}) => {
  return (
    <div className="endorsement-card-section">
      <div className="body-content-for-endorsement-section">
        {endorsementData?.benefitsPremiumData?.map((item, index) => (
          <div className="top-table">
            <div className="box">
              <div key={index} className="box-content">
                <div className="package-content package-border">
                  <div className="package-heading walaa-regular-400">{languageData?.choose_extra_benefits_add}</div>
                  <div className="package-value walaa-medium-500">
                    {item?.benefitNameEn}
                  </div>
                </div>
                <div className="package-content-2 package-border">
                  <div className="package-heading walaa-regular-400">{languageData?.effective_date}</div>
                  <div className="package-value walaa-medium-500">
                    {item?.effectiveDate}
                  </div>
                </div>
                <div className="package-content-2">
                  <div className="package-heading">{languageData?.amount}</div>
                  <div className="package-value walaa-medium-500">
                    {getAmountText(item?.benefitPrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {endorsementData?.driversPremiumData?.map((item:AddDriverProps, index: number) => (
          <div className="top-table">
          <div className="box">
            <div key={index} className="box-content">
              <div>
                <img src={driverIcon} alt="driver icon" />
              </div>
              <div className="package-content package-content-40 package-border">
                <div className="package-heading walaa-regular-400">{languageData?.driver_name}</div>
                <div className="package-value walaa-medium-500">
                  {capitalizeNameFirstLetter(item?.driver?.driverName ?? "")}
                </div>
              </div>
              <div className="package-content-2 package-border">
                <div className="package-heading walaa-regular-400">{languageData ? getLabelOfIqmaIdNationalId(item?.driver?.driverID, languageData) : ""}</div>
                <div className="package-value walaa-medium-500">
                  {item?.driver?.driverID}
                </div>
              </div>
              <div className="package-content-2">
                <div className="package-heading">{languageData?.relationship}</div>
                <div className="package-value walaa-medium-500">
                  {geteDriverRelation(item?.driver?.relation ?? 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default EndorsementSuccess;
