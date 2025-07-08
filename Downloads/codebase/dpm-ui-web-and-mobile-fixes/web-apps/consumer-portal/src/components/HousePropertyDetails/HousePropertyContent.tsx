import React from "react";
import "./index.scss";
import { useCommonContext } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import Home from "assets/Home/home_review.png";
import { commonKeywords } from "constant";
import { displayHouseAddress } from "utils/quoteAndBuy";

export interface HousePropertyContentItem {
  label: string;
  value: string;
}

interface HousePropertyProps {
  housePropertyData: HousePropertyContentItem[];
  housePropertyAddress: any;
  languageData: LanguageData;
  propertyNo?: number;
}

const HousePropertyContent: React.FC<HousePropertyProps> = ({ housePropertyData, propertyNo, housePropertyAddress, languageData }) => {
  const { currentLanguage } = useCommonContext();
  const { ar } = commonKeywords;
  const property = Number(propertyNo) + 1;
  return (
    <><div className="vehi-top ">
      <div className="vehi-logo">
        <img src={Home} alt="" />
      </div>
      <div>
        <div>{languageData?.property} {property}</div>
        {housePropertyAddress && <div className="house-address">
          {displayHouseAddress(housePropertyAddress, currentLanguage, ar)}
        </div>}
      </div>
    </div>
      <div className="vehi-top">
        {Array.isArray(housePropertyData) && housePropertyData.map((housePropertyItem: HousePropertyContentItem, idx: number) => (
          <div key={idx} className="label-container">
            <span className="vehi-label">{housePropertyItem.label}</span>
            <span className="vehi-value">{housePropertyItem.value}</span>
          </div>
        ))}
      </div></>
  );
};

export default HousePropertyContent;
