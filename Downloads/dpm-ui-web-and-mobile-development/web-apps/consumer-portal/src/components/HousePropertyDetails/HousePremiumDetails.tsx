import React from "react";
import { getCurrencySymbol } from "@app-shell/utils/common";
import "./index.scss";

interface HousePremiumDetailsProps {
  houseDetail: HouseItem[];
}

interface HouseItem {
  label?: string;
  value?: string;
}


const HousePremiumDetails: React.FC<HousePremiumDetailsProps> = ({ houseDetail }) => {

  return (
    <div className="vehi-policy-details">
      {houseDetail.map((houseItem:HouseItem, idx:number) => (
        <div key={idx} className="poli-detail-container home">
          <span className="poli-label">{houseItem.label}</span>
          <span className="poli-value">{getCurrencySymbol(houseItem.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default HousePremiumDetails;
