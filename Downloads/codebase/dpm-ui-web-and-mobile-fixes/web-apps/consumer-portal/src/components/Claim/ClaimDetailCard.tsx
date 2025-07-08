import React from "react";
import "./style.scss";
interface ClaimDetailCardProps {
    trackNewData?: {
      vehicleMake?: string;
      plateNo?: string;
      caseReferenceNo?: string;
      ownerID?: string;
    };
    trackClaimInfo?: {
      not_applicable?: string;
      Logo?: string;
      case_reference_no?: string;
      owner_id_label?: string;
    };
  }
const ClaimDetailCard: React.FC<ClaimDetailCardProps> = ({ trackNewData, trackClaimInfo }) => {
    const formattedPlateNo = trackNewData?.plateNo
    ? trackNewData.plateNo.split(" ").join("-")
    : trackClaimInfo?.not_applicable;
  return (
    <div className="claim-vehicle-info">
      <div className="d-flex align-items-center vehical-warp">
        <div className="px-0 d-flex flex-column">
          <div className="vehical-card-make walaa-regular-400">
          {trackNewData?.vehicleMake ?? trackClaimInfo?.not_applicable}
          </div>

          <div className="vehical-card-model walaa-regular-600"  data-testid="plate-number">
            {formattedPlateNo}</div>
        </div>
        <div className="claim-logo-container">
          <img src={trackClaimInfo?.Logo} alt="logo" />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="vehical-card-make walaa-regular-400">
            {trackClaimInfo?.case_reference_no}
            </div>

            <div className="vehical-card-model walaa-medium-500">
              {trackNewData?.caseReferenceNo ??  trackClaimInfo?.not_applicable}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column">
            <div className="vehical-card-make walaa-regular-400">{trackClaimInfo?.owner_id_label}</div>
            <div className="vehical-card-model walaa-medium-500">
            {trackNewData?. ownerID ?? trackClaimInfo?.not_applicable}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailCard;
