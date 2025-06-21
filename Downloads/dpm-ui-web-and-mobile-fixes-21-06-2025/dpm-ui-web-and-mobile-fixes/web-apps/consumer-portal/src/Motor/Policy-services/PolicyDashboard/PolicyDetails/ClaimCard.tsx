import React from 'react';
import styles from "./PolicyDetails.module.scss";
import MotorSmallLogo from "assets/Dashboard/MOTOR_MyRequest.svg";
import TravelSmallLogo from "assets/Dashboard/Travel_MyRequest.svg";
import HomeSmallLogo from "assets/Dashboard/Home_MyRequest.svg";
import ArrowRight from "assets/Dashboard/Arrow_Right.svg";
import { TRAVEL, HOME} from "constant";
import { LanguageData } from 'types/languageData';
import { ClaimDetails } from 'types/Dashboard';
import { getlineOfBusiness } from 'utils/fileUtil';

interface ClaimCardProps {
  claimNumber: string;
  claimStatus: string;
  policyInfo: { policyNo: string; endorsementNo: string; productCode: string };
  languageData?: LanguageData | null;
  claimInfo?: ClaimDetails;
  navigateTo?: (url: string, data?: unknown) => void;
}

const ClaimCard: React.FC<ClaimCardProps> = ({
  claimNumber,
  claimStatus,
  policyInfo,
  claimInfo,
  languageData,
  navigateTo,
}) => {

  const lineOfBusiness = getlineOfBusiness(claimInfo?.productName ?? "");

  return (
    <div className={styles.claimContainer}>
      <div className={styles.claimCard}>
        <div className={styles.leftCard}>
          <div className={styles.prodLogo}>
            <img
              src={
                policyInfo?.productCode === TRAVEL
                  ? TravelSmallLogo
                  : policyInfo?.productCode === HOME
                  ? HomeSmallLogo
                  : MotorSmallLogo
              }
            />
          </div>
          <div className={styles.claimNumberContainer}>
            <div className={styles.claimNumberLabel}>
              {policyInfo?.productCode === HOME
                ? languageData?.home_claim_no
                : policyInfo?.productCode === TRAVEL
                ? languageData?.travel_claim_no
                : languageData?.motor_claim_no}
            </div>
            <div className={styles.claimNumber}>{claimNumber}</div>
          </div>
        </div>
        <div
          className={styles.rightCard}
          onClick={() =>
            navigateTo && navigateTo("/track-claim", { data: {claimNo:claimNumber, lineOfBusiness:lineOfBusiness} })
          }
        >
          <div className={styles.checkStatus}>{languageData?.check_status}</div>
          <div>
            <img src={ArrowRight} />
          </div>
        </div>
        <div className={styles.claimStatus}>{claimStatus}</div>
      </div>
    </div>
  );
};

export default ClaimCard;