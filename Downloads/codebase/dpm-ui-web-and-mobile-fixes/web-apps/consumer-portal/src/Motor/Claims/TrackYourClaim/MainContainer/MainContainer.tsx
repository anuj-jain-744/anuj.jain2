import React from "react";
import style from "./MainContainer.module.scss";
import TitleContainer from "./TitleContainer/TitleContainer";
import UploadDocStatus from "./UploadDocStatus/UploadDocStatus";
import StatusTree from "./StatusTree/StatusTree";
import ClaimBottom from "./StatusTree/ClaimBottom";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";

interface CMainContainerProps {
  trackClaimInfo?: { [key: string]: string };
}

  const MainContainer: React.FC<CMainContainerProps> = () => {
  const { trackClaimInfo, trackNewData } = useClaimContext();

  return (
    <div className={style.tycMainContainer}>
      <TitleContainer
        title={trackClaimInfo?.track_your_claim}
        status={trackNewData.currentStatus}
      />
      <UploadDocStatus />
      <StatusTree />
      <ClaimBottom />
    </div>
  );
};

export default MainContainer;
