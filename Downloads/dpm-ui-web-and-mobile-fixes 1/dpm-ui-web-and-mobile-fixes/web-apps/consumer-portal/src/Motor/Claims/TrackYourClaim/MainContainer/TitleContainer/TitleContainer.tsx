import React, { useEffect } from 'react';
import style from './TitleContainer.module.scss';

import { useClaimContext } from 'Motor/ClaimHooks/useClaimContext';
interface Props {
  title: string,
  status?: string,
  trackClaimInfo?: { [key: string]: string };
}



const TitleContainer: React.FC<Props> = ({ title, status }) => {

  const { trackClaimInfo } = useClaimContext();

  const [isRed, setIsRed] = React.useState(false);

  const REPOERT_AWAITED = "Reports Awaited";

  useEffect(() => {

    if (status === REPOERT_AWAITED) {
      setIsRed(true);
   }

  }, [status]);



  return (
    <div className={style.tycTitleContainer}>
      <div className={style.tycTitleFrame}>
        <div className={style.tycTitleFrameBox}>
          <div className={style.tycTitleFrameText}>
            {title}
          </div>
          <div className={`${isRed ? style.tycTitleFrameStatusRed : style.tycTitleFrameStatusGreen}`}>

            {trackClaimInfo?.current_status + " : "} {status}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TitleContainer