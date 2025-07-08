import { Card } from "react-bootstrap";
import Motor from "assets/Claims/svg/icons/Car.svg";
import { DataContext } from "../../../../../../DataContext";
import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { OthersClaimInfo } from "@corporate-portal/components/GetQuoteWidget/getQuoteInterface";
import "./index.scss";


interface ClaimCheckResponse {
  caseReportId: string;
  city: string;
  claimRequestType: string;
  email: string;
  estimatedAmount: number;
  feedback: string;
  liability: string;
  mobileNo: number;
  ownerId: number;
  ownerName: string;
  referenceNo: string;
  sequenceNo: string;
  status: string;
  vehicleOwnerDob: Date;
  vehicleOwnerDobArabicH: Date;
}

interface IVehicleSequenceNo {
  claimsInfo: any;
  validationData: any;
  claimCheckData: ClaimCheckResponse;
  othersClaimInfo?: OthersClaimInfo;
}
const VehicleSequenceNo = ({
  claimsInfo,
  validationData,
  claimCheckData,
  othersClaimInfo,
}: IVehicleSequenceNo) => {
  //cms content
  const Data = useContext(DataContext);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );

  const checkValidationDataClaimCheck = useMemo(() => {
    if (validationData?.sequenceNo || claimCheckData?.sequenceNo) return "";
    if (othersClaimInfo?.isSequenceNo) return othersClaimInfo?.SequenceNo;
    return "";
  }, [
    validationData?.sequenceNo,
    claimCheckData?.sequenceNo,
    othersClaimInfo?.SequenceNo,
    othersClaimInfo?.isSequenceNo,
  ]);

  return (
    <Card className="new-right-card" data-testid="vehicle-sequence-no">
      {(othersClaimInfo?.isSequenceNo &&
        othersClaimInfo?.SequenceNo &&
        othersClaimInfo?.SequenceNo?.length > 0) ||
      claimCheckData?.sequenceNo ||
      validationData?.sequenceNo ? (
        <React.Fragment>
          <div className="header align-items-start">
            <div className="header-content">
              <div className="content">
                <div className="policy-title">{Data?.vehicle_sequence}</div>
                <div className="walaa-medium-500 policy-number">
                  {isAuthenticated
                    ? claimCheckData?.sequenceNo
                    : validationData?.sequenceNo}
                  {checkValidationDataClaimCheck}
                </div>
              </div>
              <div className="new-logo">
                <img src={Motor} alt="veh_seq" />
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment></React.Fragment>
      )}
      <div className="header flex-row">
        <div className="header-content">
          <div className="content">
            <div className="policy-title">{Data?.case_reference_no}</div>
            <div className="walaa-medium-500 policy-number">
              {" "}
              {claimsInfo?.refNo}
            </div>
          </div>
        </div>
        <div className="header-content">
          <div className="content">
            <div className="policy-title">{Data?.owner_id_label}</div>
            <div className="walaa-medium-500 policy-number">
              {" "}
              {claimsInfo?.ownerId}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VehicleSequenceNo;
