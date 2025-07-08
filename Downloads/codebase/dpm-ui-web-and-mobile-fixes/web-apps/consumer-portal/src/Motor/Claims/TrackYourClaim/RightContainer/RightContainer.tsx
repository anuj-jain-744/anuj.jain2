import React from "react";
import ClaimVehicleInfo from "../RightContainer/ClaimVehicleInfo/ClaimVehicleInfo";
import DownloadDocLink from "./DownloadDocLink/DownloadDocLink";
import ContactCard from "./ContactCard/ContactCard";
import ClaimDetailCard from "components/Claim/ClaimDetailCard"
import styles from "./RightContainer.module.scss";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import MortorLogo from "assets/TrackYourClaim/Logo.svg"
import HomeLogo from "assets/Home/home-logo.svg";
interface RightContainerProps {
  languageData: { [key: string]: string };
}
const RightContainer: React.FC<RightContainerProps> = ({ languageData }) => {
  const { productName, trackClaimInfo, trackNewData } = useClaimContext();

  const isMotor = productName === trackClaimInfo?.motor;
  const isHome = productName === trackClaimInfo?.home;
   
  const filteredTrackClaimInfo = (isMotor || isHome) ? {
    ...(isMotor && { Logo: MortorLogo }),
    ...(isHome && { Logo: HomeLogo }),
  case_reference_no: trackClaimInfo?.case_reference_no,
  not_applicable: trackClaimInfo?.not_applicable,
  owner_id_label: trackClaimInfo?.owner_id_label,
  ...(isHome && { policy_No_Label: trackClaimInfo?.policy_No_Label,case_reference_no :trackClaimInfo?.claimant_id }),
  } : null;
   
  const filteredTrackNewData = (isMotor || isHome) ? {
    vehicleMake: trackNewData?.vehicleMake,
    plateNo: trackNewData?.plateNo,
    caseReferenceNo: trackNewData?.caseReferenceNo,
    ownerID: trackNewData?.ownerID,
    ...(isHome && { plateNo: trackNewData?.policyNo, vehicleMake:trackClaimInfo?.policy_No_Label, caseReferenceNo: trackNewData?.claimNo }),
  } : null;
  
   
  return (
    <div className={styles.rightContainer}>
      {filteredTrackClaimInfo ? (
        <ClaimDetailCard
          trackNewData={filteredTrackNewData}
          trackClaimInfo={filteredTrackClaimInfo}
        />
      ) : (
        <ClaimVehicleInfo />
      )}
      <DownloadDocLink languageData={ languageData }/>
      <ContactCard />
    </div>
  );
};

export default RightContainer;
