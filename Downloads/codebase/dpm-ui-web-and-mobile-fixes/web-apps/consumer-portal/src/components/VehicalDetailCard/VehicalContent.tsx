import React from "react";
import "./index.scss";
import { getModelIcon } from "utils/getModelIcon";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

export interface VehicleItem {
  label: string;
  value: string;
  isAmount?: boolean;
}

interface VehicalContentProps {
  vehicleData: VehicleItem[];
}

const VehicalContent: React.FC<VehicalContentProps> = ({vehicleData}) => {

  const { vehicleDetailsResponseData, makeModelResponse } = useQuoteAndBuyContext();

  return (
    <div className="vehi-top">
      <div className="vehi-logo">
        <img
          className="vehicle-icon"
          src={getModelIcon(vehicleDetailsResponseData?.vehicleMakeTextEn, vehicleDetailsResponseData?.vehicleMakeId, makeModelResponse || [])}
          alt="logo"
        />
      </div>

      {Array.isArray(vehicleData) && vehicleData.map((vehicleItem:VehicleItem, idx: number) => (
        <div key={idx} className="label-container">
          <span className="vehi-label">{vehicleItem.label}</span>
          <span className="vehi-value">{vehicleItem.value}</span>
        </div>
      ))}
    </div>
  );
};

export default VehicalContent;
