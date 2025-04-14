import React from "react";
import AdditionalVehicle from "./AdditionalVehicle";

function AddVehicle(props) {
  return (
    <div className="register-new-claim">
      <AdditionalVehicle {...props} />
    </div>
  );
}

export default AddVehicle;
