import React from "react";
import ClaimVehicleInfo from "../RightContainer/ClaimVehicleInfo/ClaimVehicleInfo";
import DownloadDocLink from "./DownloadDocLink/DownloadDocLink";
import ContactCard from "./ContactCard/ContactCard";

import styles from "./RightContainer.module.scss";

interface RightContainerProps {
  languageData: { [key: string]: string };
}
const RightContainer: React.FC<RightContainerProps> = ({ languageData }) => {
  return (
    <div className={styles.rightContainer}>
      <ClaimVehicleInfo />
      <DownloadDocLink languageData={ languageData }/>
      <ContactCard />
    </div>
  );
};

export default RightContainer;
