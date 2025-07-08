import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { DataContext } from "../../../DataContext";
import iconCar from "../../../assets/Claims/Car.svg";
// import iconCar from '../../../assets/Claims/Car.svg';

function ClaimInformation(data: any) {
  //cms content
  const Data = useContext(DataContext);
  return (
    <div className="register-claim-info">
      <Card className="register-claim-inform-card register-row-spacing-top">
        <Card.Body className="p-0">
          <div className="row">
            <div className="col-sm-12 col-md-4 register-row-spacing-bottom-sm">
              <div className="row">
                <div className="col-sm-12 col-md-3 register-row-spacing-bottom-sm">
                  <div className="info-box">
                    <img src={iconCar} alt="type icon" />
                  </div>
                </div>
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
                      {data?.validationData?.caseReportId}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-sm-12 col-md-4 register-claim-info-estimate border border-top-0
                border-bottom-0
                 border-start-0 border-color-cust register-row-spacing-bottom-sm"
            >
              <div className="register-claim-info-estimate-title walaa-regular-400">
                {Data?.owner_id_label}
              </div>
              <div className="register-claim-info-estimate-value walaa-medium-500">
                {data?.validationData?.ownerId}
              </div>
            </div>
            <div className="col-sm-12 col-md-4 register-claim-info-estimate register-row-spacing-bottom-sm">
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
export default ClaimInformation;
