import { useContext, useState } from "react";
import { Card, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { DataContext } from "../../../../DataContext";
import React from "react";

type EstimateType = {
  changeHandler: (e: React.FormEvent<HTMLDivElement>) => void;
  validationData: any;
};

function CompreEstimation({ changeHandler, validationData }: EstimateType) {
  const [selected, setSelected] = useState(1);

  //cms content
  const Data = useContext(DataContext);
  return (
    <div className="register-claim-info" onChange={changeHandler}>
      <Card className="register-claim-inform-card card-background-2">
        <Card.Body className="p-0">
          <div className="row">
            <div className="col-sm-6 col-md-4">
              <div
                className="register-claim-info-estimate border border-top-0
                border-bottom-0
                 border-start-0 border-color-cust"
              >
                <div className="register-claim-info-estimate-title walaa-regular-400 color-2">
                  {Data?.estimated_amount}
                </div>
                <div className="register-claim-info-estimate-value walaa-medium-500 color-2">
                  {validationData?.estimatedAmount
                    ? validationData?.estimatedAmount
                    : "SAR 1500"}
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="register-compensate-estimate">
                <div className="register-claim-info-estimate-title walaa-regular-400 color-2">
                  {Data?.walaa_liability}
                </div>
                <div className="register-claim-info-estimate-value walaa-medium-500">
                  {validationData?.liability}
                  {/* 75% */}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
              <div className="register-compensate-estimate">
                <div className="register-claim-info-estimate-title walaa-regular-400 color-2">
                  {Data?.is_walaa_liability_correct}
                </div>
                <div className="register-claim-info-estimate-value walaa-medium-500">
                  <ToggleButtonGroup
                    type="radio"
                    name="options"
                    defaultValue={selected}
                    className="radio-button-group-cust"
                  >
                    <ToggleButton
                      id="tbg-radio-1"
                      value={1}
                      onClick={() => setSelected(1)}
                      className={selected === 1 ? "selected" : "not-selected"}
                    >
                      {Data?.yes}
                    </ToggleButton>
                    <ToggleButton
                      id="tbg-radio-2"
                      value={2}
                      onClick={() => setSelected(2)}
                      className={
                        selected === 2 ? "selected selected-2" : "not-selected"
                      }
                    >
                      &nbsp;{Data?.no}&nbsp;
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CompreEstimation;
