import React from "react";
import "./index.scss";
import Nissan from "assets/Endorsement/Nissan.svg";

export interface VehicleItem {
  label: string;
  value: string;
}

interface VehicalContentProps {
  vehicleData: VehicleItem[];
}

const VehicalContent: React.FC<VehicalContentProps> = ({vehicleData}) => {
  return (
    <div className="vehi-top">
      <div className="vehi-logo">
        <img src={Nissan} alt="" />
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
