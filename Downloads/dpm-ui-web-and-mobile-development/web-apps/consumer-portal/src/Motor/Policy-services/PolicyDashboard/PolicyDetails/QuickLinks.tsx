import React from 'react';
import styles from './PolicyDetails.module.scss';
import Download from 'assets/PolicyDetails/Download.svg';
import History from 'assets/PolicyDetails/History.svg';
import tokenAdd from 'assets/PolicyDetails/tokenAdd.svg';
import Contract_Delete from 'assets/PolicyDetails/Contract_Delete.svg';
import Addon_disable from "assets/Dashboard/Contextual Token Add_disabled.svg";
import VerifiedUser from "assets/Dashboard/Verified User.svg";
import { TRAVEL, MOTOR } from "constant";
import { LanguageData } from 'types/languageData';

interface QuickLinkProps {
  icon: string;
  text: string | undefined;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const QuickLink: React.FC<QuickLinkProps> = ({ icon, text, onClick, className, disabled }) => (
  <div
    className={`${styles.linkFrame} ${className} ${disabled ? styles.disabledLink : ''}`}
    onClick={!disabled ? onClick : undefined}
  >
    <img src={icon} alt={text} />
    <div className={styles.linkText}>{text}</div>
  </div>
);

interface QuickLinksProps {
  navigateTo?: (url: string, data?: unknown) => void;
  highlightCancelPolicy?: boolean;
  policyInfo: { policyNo: string, endorsementNo: string, productCode: string };
  languageData?: LanguageData;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({ navigateTo, highlightCancelPolicy, policyInfo, languageData }) => {
  const { productCode } = policyInfo;
  const links = [
    {
      icon: policyInfo?.productCode === TRAVEL ? Addon_disable : tokenAdd,
      text: languageData?.additional_benefits,
      url: '/Motor/Claim/Endorsement',
      className: highlightCancelPolicy ? styles.disabledLinkText : '',
      disabled: highlightCancelPolicy || productCode === TRAVEL 
    },
    {
      icon: VerifiedUser,
      text: languageData?.register_a_claim,
      url: productCode === TRAVEL ? "/Travel/Claim/RegisterClaim" : "/Register-claim",
      className: highlightCancelPolicy ? styles.disabledLinkText : '',
      disabled: highlightCancelPolicy || productCode === MOTOR
    },
    {
      icon: Download,
      text: languageData?.documents,
      url: '/Motor/Claim/Policy-Dcouments',
      className: '',
      disabled: false
    },
    {
      icon: History,
      text: languageData?.policy_history,
      url: '/Motor/Claim/PolicyHistory',
      className: '',
      disabled: false
    },
    {
      icon: Contract_Delete,
      text: languageData?.cancel_policy,
      url: productCode === TRAVEL ? '/Travel/Claim/Policy-Cancellation' : '/Motor/Claim/Policy-Cancellation',
      className: highlightCancelPolicy ? styles.disabledLinkText : '',
      disabled: highlightCancelPolicy
    }
  ];

  return (
    <div className={styles.linkContent}>
      {links.map((link) => (
        <QuickLink
          key={link.text}
          icon={link.icon}
          text={link.text}
          onClick={() => navigateTo && navigateTo(link.url, { data: policyInfo })}
          className={link.className}
          disabled={link.disabled}
        />
      ))}
    </div>
  );
};