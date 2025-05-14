import React, { useContext } from "react";
import { DataContext } from "../../../../DataContext";
import ThemeRadioCheckbox from "../../../components/ThemeRadioCheckbox";

function CompensationType() {
    
  //cms content
  const Data = useContext(DataContext);
  return (
    <React.Fragment>
      <div className="row register-row-spacing-top">
        <div className="col register-compensate-title walaa-medium-500">Select Compensate Type</div>
      </div>
      <div className="row register-row-spacing-top mx-1">
        <div className="col-md-5 register-compensate-radio-border">
          <ThemeRadioCheckbox
            label={Data?.bank_transfer}
            type="radio"
            // defaultChecked={isBank ? true : false}
            defaultChecked={ true }
            classes="register-compensate-radio radio-check-cust walaa-regular-400"
            // onChangehandler={updatedValue}
          />
        </div>
        <div className="col-md-1">&nbsp;</div>
        <div className="col-md-5 register-compensate-radio-border">
          <ThemeRadioCheckbox
            label={Data?.damage_repair}
            type="radio"
            // defaultChecked={isDamage ? true : false}
            defaultChecked={false}
            classes="register-compensate-radio radio-check-cust walaa-regular-400"
            // onChangehandler={updatedValue}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default CompensationType;
