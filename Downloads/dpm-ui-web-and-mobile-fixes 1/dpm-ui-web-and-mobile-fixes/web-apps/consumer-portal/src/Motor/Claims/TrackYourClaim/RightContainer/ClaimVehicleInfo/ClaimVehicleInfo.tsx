import React from "react";
import "./style.scss";
import Logo from "assets/QuoteAndBuy/Logo.svg";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import HomeLogo from  "assets/Home/home-logo.svg";


interface ClaimVehicleInfoProps {
  trackClaimInfo?: { [key: string]: string };

}
type ProductClaimMap<T extends string> = {
  [key in T]: {
    imageSrc: string;
    caseNumber:string;
  };
};
type ProductType = string;

const ClaimVehicleInfo: React.FC<ClaimVehicleInfoProps> = () => {

  const { trackClaimInfo } = useClaimContext();
  const { trackNewData } = useClaimContext();
  const {productName} = useClaimContext();
  const vehiData = {
    vehiName: "Nissan Magnite XE",
    vehiContent: "7403-RUA"
  }
  const homeData = {
    policyNoLabel:"Policy No.",
    policyNo:"WLA-HM-2024-00123",
  }
  const productObj:ProductClaimMap<ProductType> = {
    Motor: {
      imageSrc: Logo ?? '',
      caseNumber: trackClaimInfo?.case_reference_no ?? ''
    },
    Home: {
      imageSrc: HomeLogo ?? '',
      caseNumber: trackClaimInfo?.claimant_id ?? ''
    }
  };

  return (

    <div className="claim-vehicleinfo">
      <div className="d-flex align-items-center vehicle-name-wrap">
        <div className="logo-container">
          <img src={productObj[productName]?.imageSrc} alt="logo" />
        </div>
        <div className="px-2 d-flex flex-column">
            {productName === trackClaimInfo?.motor && (
              <>
              <div className="vehicle-title walaa-regular-400">{vehiData.vehiName}</div>
              <div className="vehicle-content walaa-medium-500">{vehiData.vehiContent}</div>
              </>
            )}
            {productName === trackClaimInfo?.home && (
              <>
              <div className="vehicle-title walaa-regular-400">{homeData.policyNoLabel}</div>
              <div className="vehicle-content walaa-medium-500">{homeData.policyNo}</div>
              </>
            )}
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="vehicle-infor-title walaa-regular-400">{productObj[productName]?.caseNumber}</div>
            <div className="vehicle-infor-content walaa-medium-500">
              {trackNewData?.referenceNo}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column">
            <div className="vehicle-infor-title walaa-regular-400">
              {trackClaimInfo?.owner_id_label}
            </div>
            <div className="vehicle-infor-content walaa-medium-500">
              {trackNewData?.ownerID}
              </div>
          </div>
        </div>
      </div>


    </div>
  );


};

export default ClaimVehicleInfo;
