import { Card } from "react-bootstrap";
import Nissan from "assets/Endorsement/png/Nissan.png";
import { DataContext } from "../../../../../../DataContext";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";

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
}
const VehicleSequenceNo = ({
  claimsInfo,
  validationData,
  claimCheckData,
}: IVehicleSequenceNo) => {
  //cms content
  const Data = useContext(DataContext);
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);
  return (
    <Card className="right-card">
      <div className="header align-items-start">
        <div className="header-content">
          <div className="logo">
            <img src={Nissan} alt="veh_seq" />
          </div>
          <div className="content">
            <div>{Data?.vehicle_sequence}</div>
            <div className="walaa-medium-500 policy-number">
              {isAuthenticated ? claimCheckData?.sequenceNo : validationData?.sequenceNo}
            </div>
          </div>
        </div>
      </div>

      <hr className="horizontal-line" />
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
