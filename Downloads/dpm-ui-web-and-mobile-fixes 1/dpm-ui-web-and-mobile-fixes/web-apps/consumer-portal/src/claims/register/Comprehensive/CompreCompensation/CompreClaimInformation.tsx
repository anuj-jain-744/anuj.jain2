import { useContext } from "react";
import { Card } from "react-bootstrap";
import { DataContext } from "../../../../DataContext";
import React from "react";

function CompreClaimInformation(data: any) {
  //cms content
  const Data = useContext(DataContext);
  return (
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
                      {data?.validationData?.caseReportId
                        ? data?.validationData?.caseReportId
                        : data?.claimsInfo?.refNo}
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
                {Data?.owner_id_label}
              </div>
              <div className="register-claim-info-estimate-value walaa-medium-500">
                {data?.validationData?.ownerId
                  ? data?.validationData?.ownerId
                  : data?.claimsInfo?.ownerId}
              </div>
            </div>
            <div className="col-sm-12 col-md-4 register-claim-info-estimate">
              <div className="register-claim-info-estimate-title walaa-regular-400">
                {Data?.vehicle_sequence}
              </div>
              <div className="register-claim-info-estimate-value walaa-medium-500">
                {data?.validationData?.sequenceNo}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
export default CompreClaimInformation;
