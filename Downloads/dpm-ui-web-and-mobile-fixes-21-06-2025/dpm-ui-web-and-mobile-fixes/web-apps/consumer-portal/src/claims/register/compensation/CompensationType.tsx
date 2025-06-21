import React, { useContext } from "react";
import ThemeRadioCheckbox from "../../components/ThemeRadioCheckbox";
import { DataContext } from "../../../DataContext";

type CompensatetypeType = {
  onChangehandler: (e: React.FormEvent<HTMLDivElement>) => void;
};

function CompensationType({
  onChangehandler,
}: CompensatetypeType) {
  //cms content
  const Data = useContext(DataContext);
  return (
    <React.Fragment>
      <div className="row register-row-spacing-top">
        <div className="col register-compensate-title walaa-medium-500">{Data?.compensation_type}</div>
      </div>
      <div className="row register-row-spacing-top mx-1">
        <div className="col-md-5 register-compensate-radio-border">
          <ThemeRadioCheckbox
            label={Data?.bank_transfer}
            type="radio"
            defaultChecked={true}
            classes="register-compensate-radio radio-check-cust walaa-regular-400"
            onChangehandler={onChangehandler}
          />
        </div>
        <div className="col-md-1">&nbsp;</div>
        <div className="col-md-5 register-compensate-radio-border">
          <ThemeRadioCheckbox
            label={Data?.damage_repair}
            type="radio"
            defaultChecked={false}
            classes="register-compensate-radio radio-check-cust walaa-regular-400"
            onChangehandler={onChangehandler}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default CompensationType;
