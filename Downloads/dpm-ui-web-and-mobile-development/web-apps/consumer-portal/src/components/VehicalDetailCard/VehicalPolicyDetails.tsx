import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

interface VehicalPolicyDetailsProps {
  policyDetail: VehicleItem[];
}

interface VehicleItem {
  label?: string;
  value?: string;
}


const VehicalPolicyDetails: React.FC<VehicalPolicyDetailsProps> = ({ policyDetail }) => {

  return (
    <div className="vehi-policy-details">
      {policyDetail.map((vehicleItem, index) => (
        <div
          key={vehicleItem.label}
          className={`poli-detail-container ${index === 2 ? "col-4" : "col"}`}
        >
          <span className="poli-label">{vehicleItem.label}</span>
          <span className="poli-value">{vehicleItem.value}</span>
        </div>
      ))}
    </div>
  );
};

export default VehicalPolicyDetails;
