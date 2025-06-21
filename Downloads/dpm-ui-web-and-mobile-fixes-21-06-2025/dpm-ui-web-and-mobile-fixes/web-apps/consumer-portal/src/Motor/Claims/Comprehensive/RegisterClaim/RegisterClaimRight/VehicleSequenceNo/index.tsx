import { Card } from "react-bootstrap";
import Motor from "assets/Claims/svg/icons/Car.svg";
import { DataContext } from "../../../../../../DataContext";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { OthersClaimInfo } from "@corporate-portal/components/GetQuoteWidget/getQuoteInterface";

interface ClaimCheckResponse {
  caseReportId : string;
  city : string;
  claimRequestType : string;
  email : string;
  estimatedAmount : number;
  feedback : string;
  liability : string;
  mobileNo : number;
  ownerId : number;
  ownerName : string;
  referenceNo : string;
  sequenceNo : string;
  status : string;
  vehicleOwnerDob : Date;
  vehicleOwnerDobArabicH : Date;
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
  othersClaimInfo
}: IVehicleSequenceNo) => {
  //cms content
  const Data = useContext(DataContext);
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);
  return (
    <Card className="right-card" data-testid="vehicle-sequence-no">
      {(othersClaimInfo?.isSequenceNo && (othersClaimInfo?.SequenceNo && othersClaimInfo?.SequenceNo?.length > 0) || claimCheckData?.sequenceNo || validationData?.sequenceNo) 
      ? <React.Fragment><div className="header align-items-start">
        <div className="header-content">
          <div className="logo">
            <img src={Motor} alt="veh_seq" />
          </div>
          <div className="content">
            <div>{Data?.vehicle_sequence}</div>
            <div className="walaa-medium-500 policy-number">
              {isAuthenticated ? claimCheckData?.sequenceNo : validationData?.sequenceNo}
              {validationData?.sequenceNo || claimCheckData?.sequenceNo ? "" : othersClaimInfo?.isSequenceNo ? othersClaimInfo?.SequenceNo : ""}
            </div>
          </div>
        </div>
      </div>

      <hr className="horizontal-line" /> </React.Fragment> : <React.Fragment></React.Fragment>}
      <div className="header flex-row">
        <div className="header-content">
          <div className="content">
            <div>{Data?.case_reference_no}</div>
            <div className="walaa-medium-500 policy-number"> {claimsInfo?.refNo}</div>
          </div>
        </div>
        <div className="header-content">
          <div className="content">
            <div>{Data?.owner_id_label}</div>
            <div className="walaa-medium-500 policy-number"> {claimsInfo?.ownerId}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VehicleSequenceNo;
