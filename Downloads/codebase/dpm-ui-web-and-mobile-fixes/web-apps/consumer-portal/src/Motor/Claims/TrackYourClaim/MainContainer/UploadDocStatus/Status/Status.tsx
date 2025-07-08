import React from 'react';
import style from './Status.module.scss';
import claimRegister from 'assets/TrackYourClaim/claimRegister.svg';
import warning from 'assets/TrackYourClaim/warning.svg';
import { useClaimContext } from 'Motor/ClaimHooks/useClaimContext';


interface StatusProps {
  claimNumber: string;
  status?: string;
  currentStatus: string;
  trackClaimInfo?: { [key: string]: string };
}

type ProductClaimMap<T extends string> = {
  [key in T]: {
    claimNumber: string;
  };
};

const TitleSection: React.FC<{ claimNumber: string }> = ({ claimNumber }) => {
  const { trackClaimInfo } = useClaimContext();
  const {productName} = useClaimContext();

  const productObj:ProductClaimMap<string> = {
    Motor: {
      claimNumber: trackClaimInfo?.motor_claim_no ?? ''
    },
    Home: {
      claimNumber: trackClaimInfo?.home_claim_no ?? ''
    },
    Travel: {
      claimNumber: trackClaimInfo?.travel_claim_no ?? ''
    },
  };
  return (
    <div className={style.tycTitle}>
      <div className='style.tycTitleIconWrap'>
      <img src={claimRegister} alt="claimRegister icon" className={style.tycTitleIcon} />
      </div>

      <div className={style.tycTitleValue}>
      <div className={style.tycTitleLabel}>{productObj[productName] ? productObj[productName]?.claimNumber: trackClaimInfo?.label_claim_no}</div>
        <div className={style.tycTitleLabelValue}>{claimNumber}</div>
        <div className={style.tycTitleLabelValue}>{trackClaimInfo?.status}</div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <div className={style.tycTitleStatus}>{status}</div>
);

const CurrentStatusSection: React.FC<{ currentStatus: string }> = ({ currentStatus }) => {
  const { trackNewData={}, trackClaimInfo={} } = useClaimContext();
  return (
    <div className={style.tycFrameTwo}>
      <div className={style.tycLabelValue}>
        <img src={warning} alt="warning icon" />
        <div className={style.tycLabelContent}>
        <span className={style.tycLabelHeader}>{trackNewData.currentStatus}</span>
        {': '}
        {currentStatus ? currentStatus : trackClaimInfo?.not_applicable}
        </div>
      </div>
    </div>
  );
};

const Status: React.FC<StatusProps> = ({ claimNumber, currentStatus }) => {
  return (
    <div className={style.tycMainContainer}>
      <div className={style.tycFrameContainer}>
        <div className={style.tycFrameOne}>
          <TitleSection claimNumber={claimNumber} />
        </div>
        <CurrentStatusSection currentStatus={currentStatus} />
      </div>
    </div>
  );
};

export default Status;