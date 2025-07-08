import  React from 'react';
import walaaLogo from 'assets/Dashboard/Walaa_logo_video.mp4';
import style from './ZeroState.module.scss';

import { LanguageData } from 'types/languageData';

interface ZeroStateProps {
    languageData?: LanguageData;
    showOnlyVideo?: boolean;
}


const ZeroState: React.FC<ZeroStateProps> = ({ languageData ,showOnlyVideo = false}) => {
    return (
        <div className={style.zeroStateContainer}>
            <div className={style.contentContainer}>
                <video data-testid="zero-state-video" className={style.happyLogoVideo} autoPlay loop muted>
                    <source src={walaaLogo} type="video/mp4" />
                </video>
                {!showOnlyVideo && <div className={style.textContainer}>
                    {languageData?.noRequestFound ?? 'No request found'}
                </div>}
            </div>
        </div>
    );
}

export default ZeroState;