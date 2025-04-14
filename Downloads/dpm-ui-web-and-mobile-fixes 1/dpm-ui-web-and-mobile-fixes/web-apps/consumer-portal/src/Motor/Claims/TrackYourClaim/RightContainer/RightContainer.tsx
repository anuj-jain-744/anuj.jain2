import React from "react";
import ClaimVehicleInfo from "../RightContainer/ClaimVehicleInfo/ClaimVehicleInfo";
import DownloadDocLink from "./DownloadDocLink/DownloadDocLink";
import ContactCard from "./ContactCard/ContactCard";


const RightContainer: React.FC = () => {
  return (
    <div className="right-main-container">
      <ClaimVehicleInfo />
      <DownloadDocLink />
      <ContactCard />
    </div>
  );
};

export default RightContainer;
