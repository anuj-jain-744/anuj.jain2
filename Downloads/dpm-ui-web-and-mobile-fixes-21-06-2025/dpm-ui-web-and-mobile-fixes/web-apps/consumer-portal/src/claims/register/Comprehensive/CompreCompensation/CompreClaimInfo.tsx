import React from "react";
import iconCar from "../../../../assets/Claims/Car.svg";
import { Card } from "react-bootstrap";

function CompreClaimInfo() {
  return (
    <React.Fragment>
      <hr className="register-compensate-splitter my-0" />
      <Card.Body className="register-card-body register-compre-card-body">
        {/* 2nd row */}
        <div className="register-claim-info">
          <Card className="register-claim-inform-card register-comp-claim-inform-card-bg-blue">
            <Card.Body className="p-0">
              <div className="row">
                <div className="col-sm-12 col-md-4">
                  <div className="row">
                    <div className="col-sm-12 col-md-3">
                      <div className="info-box">
                        <img src={iconCar} alt="type icon" />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md">
                      <div className="register-claim-info-estimate">
                        <div className="register-claim-info-estimate-title walaa-regular-400">
                          Motor Claim No.
                        </div>
                        <div className="register-claim-info-estimate-value walaa-medium-500">
                          C-E00-23-310-004679-001
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Card.Body>
    </React.Fragment>
  );
}
export default CompreClaimInfo;
