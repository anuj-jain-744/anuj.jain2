import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { DataContext } from "../../../../DataContext";

function CompreSuccess() {
  //cms content
  const Data = useContext(DataContext);
  return (
    <Card.Body className="register-card-body register-compre-card-body p-0">
      <div className="compre-compensation">
        <div className="register-claim-info">
          <Card className="register-claim-inform-card-compe register-row-spacing-top">
            <Card.Body className="p-0">
              <div className="row">
                <div className="col-sm-12 col-md-4">
                  <div className="row">
                    <div className="col-sm-12 col-md">
                      <div
                        className="register-claim-info-estimate border border-top-0
                border-bottom-0
                 border-start-0 border-color-cust"
                      >
                        <div className="register-claim-info-estimate-title walaa-regular-400">
                          {Data?.police_case_reference}
                        </div>
                        <div className="register-claim-info-estimate-value walaa-medium-500">
                          {/* {data?.data?.CaseReportId} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-sm-12 col-md-4 register-claim-info-estimate border border-top-0
                border-bottom-0
                 border-start-0 border-color-cust"
                >
                  <div className="register-claim-info-estimate-title walaa-regular-400">
                    {Data?.owner_id}
                  </div>
                  <div className="register-claim-info-estimate-value walaa-medium-500">
                    {/* {data?.data?.OwnerId} */}
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 register-claim-info-estimate">
                  <div className="register-claim-info-estimate-title walaa-regular-400">
                    {Data?.vehicle_sequence}
                  </div>
                  <div className="register-claim-info-estimate-value walaa-medium-500">
                    {/* {data?.data?.sequenceNo} */}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Card.Body>
  );
}
export default CompreSuccess;
