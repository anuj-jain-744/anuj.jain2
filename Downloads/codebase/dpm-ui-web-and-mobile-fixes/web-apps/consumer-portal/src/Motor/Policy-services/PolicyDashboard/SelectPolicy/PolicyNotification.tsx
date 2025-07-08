import React from 'react';
import style from './PolicyNotification.module.scss';
import { LanguageData } from 'types/languageData';

interface Props {   
    languageData: LanguageData | undefined | null;
}

const PolicyNotification: React.FC<Props> = ({ languageData }) => {
    const expiryDate = '31/10/2024'; // TODO: Sample data
    
    return (
        <div className={style.container}>
            <div className={style.notificationText}>
                {`${languageData?.policy_expiring_on} ${expiryDate}`}
            </div>
        </div>
    );
}

export default PolicyNotification;