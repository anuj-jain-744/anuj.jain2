import React, { useMemo } from "react";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import Logo from "assets/QuoteAndBuy/Logo.svg";
import HomeLogo from "assets/Home/home-logo.svg";
import TravelIcon from "assets/Dashboard/Travel-icon.svg";
import "./style.scss";

interface ClaimVehicleInfoProps {
  trackClaimInfo?: { [key: string]: string };
}

const ClaimVehicleInfo: React.FC<ClaimVehicleInfoProps> = () => {
  const { trackClaimInfo } = useClaimContext();
  const { trackNewData } = useClaimContext();
  const { productName } = useClaimContext();

  const data = useMemo(() => {
    let imageSrc = Logo;
    let caseNumber = "";
    if (productName === trackClaimInfo?.motor) {
      imageSrc = Logo;
      caseNumber = trackClaimInfo?.case_reference_no;
    } else if (productName === trackClaimInfo?.home) {
      imageSrc = HomeLogo;
      caseNumber = trackClaimInfo?.claimant_id;
    } else if (productName === trackClaimInfo?.travel) {
      imageSrc = TravelIcon;
      caseNumber = trackClaimInfo?.case_reference_no;
    }
    return {
      imageSrc,
      caseNumberLabel: caseNumber ?? trackClaimInfo?.not_applicable,
    };
  }, []);

  return (
    <div className="claim-vehicleinfo">
      <div className="d-flex align-items-center vehicle-name-wrap">
        <div className="logo-container">
          <img src={data.imageSrc} alt="logo" />
        </div>
        <div className="px-2 d-flex flex-column">
          {productName === trackClaimInfo?.motor ? (
            <>
              <div className="vehicle-title walaa-regular-400">
                {trackNewData?.vehicleMake ?? trackClaimInfo?.not_applicable}
              </div>
              <div className="vehicle-content walaa-medium-500">
                {trackNewData?.plateNo.split(" ").join("-") ??
                  trackClaimInfo?.not_applicable}
              </div>
            </>
          ) : (
            <>
              <div className="vehicle-title walaa-regular-400">
                {trackClaimInfo?.policy_No_Label}
              </div>
              <div className="vehicle-content walaa-medium-500">
                {trackNewData?.policyNo ?? trackClaimInfo?.not_applicable}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="vehicle-infor-title walaa-regular-400">
              {data.caseNumberLabel}
            </div>

            <div className="vehicle-infor-content walaa-medium-500">
              {trackNewData?.caseReferenceNo ??
                trackNewData?.subClaimNo ??
                trackClaimInfo?.not_applicable}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column">
            <div className="vehicle-infor-title walaa-regular-400">
              {trackClaimInfo?.owner_id_label}
            </div>
            <div className="vehicle-infor-content walaa-medium-500">
              {trackNewData?.ownerID ?? trackClaimInfo?.not_applicable}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimVehicleInfo;
