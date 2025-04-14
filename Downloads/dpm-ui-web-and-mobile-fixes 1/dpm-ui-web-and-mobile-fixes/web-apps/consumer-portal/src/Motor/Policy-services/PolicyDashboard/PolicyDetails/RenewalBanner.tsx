import React from 'react';
import styles from './PolicyDetails.module.scss';
import ThemeButton from 'components/ThemeButton/ThemeButton';
import report from 'assets/PolicyDetails/Report.svg';
import { LanguageData } from 'types/languageData';

interface RenewalBannerProps {
  message: string;
  languageData: LanguageData | undefined | null;
}

const RenewalBanner: React.FC<RenewalBannerProps> = ({
  message,
  languageData,
}) => (
  <div className={styles.renew}>
    <div className={styles.renewFrame}>
      <div className={styles.renewTitle}>
        <img src={report} alt="report icon" />
        <div className={styles.renewText}>{message}</div>
      </div>
      <ThemeButton
        icon={true}
        iconName="Change"
        variant="renewOutline"
        isDisabled={false}
        title={languageData?.renew}
        classes="walaa-medium-500"
      />
    </div>
  </div>
);

export default RenewalBanner;