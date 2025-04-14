
import React from "react";
import "./StatusTree.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import { useNavigate } from "react-router-dom";
import {  navigateTo } from "../../../../../../../app-shell/src/utils";
interface Props {}

const ClaimBottom: React.FC<Props> = () => {

  const navigate = useNavigate();

  const handleNavigate = (url: string) => {
    navigateTo(url, navigate);
  };

  const { trackClaimInfo } = useClaimContext();

    return (
      <div className="bottomMain">
        <ThemeButton
          icon={false}
          variant="outline"
          isDisabled={false}
          title={trackClaimInfo?.track_another_claim}
          classes={"walaa-medium-500"}
          onClickhandler={() => handleNavigate("/track-claim")}

        />
      </div>

    );
  }

  export default ClaimBottom;