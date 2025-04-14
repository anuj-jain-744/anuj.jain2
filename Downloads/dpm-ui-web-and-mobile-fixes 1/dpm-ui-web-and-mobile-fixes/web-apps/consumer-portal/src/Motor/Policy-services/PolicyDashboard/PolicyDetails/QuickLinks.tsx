import React from 'react';
import styles from './PolicyDetails.module.scss';
import Download from 'assets/PolicyDetails/Download.svg';
import History from 'assets/PolicyDetails/History.svg';
import tokenAdd from 'assets/PolicyDetails/tokenAdd.svg';
import Contract_Delete from 'assets/PolicyDetails/Contract_Delete.svg';
import Addon_disable from "assets/Dashboard/Contextual Token Add_disabled.svg"; 

interface QuickLinkProps {
  icon: string;
  text: string;
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
}

export const QuickLinks: React.FC<QuickLinksProps> = ({ navigateTo, highlightCancelPolicy, policyInfo }) => {
  const { productCode } = policyInfo;
  const links = [
    {
      icon: policyInfo?.productCode === "TRVL" ? Addon_disable : tokenAdd,
      text: 'Endorsements',
      url: '/Motor/Claim/Endorsement',
      className: highlightCancelPolicy ? styles.disabledLinkText : '',
      disabled: highlightCancelPolicy || productCode === 'TRVL'
    },
    {
      icon: Contract_Delete,
      text: 'Cancel Policy',
      url: productCode === 'TRVL' ? '/Travel/Claim/Policy-Cancellation' : '/Motor/Claim/Policy-Cancellation',
      className: highlightCancelPolicy ? styles.disabledLinkText : '',
      disabled: highlightCancelPolicy
    },
    {
      icon: History,
      text: 'Policy History',
      url: '/Motor/Claim/PolicyHistory',
      className: '',
      disabled: false
    },
    {
      icon: Download,
      text: 'Policy Documents',
      url: '/Motor/Claim/Policy-Dcouments',
      className: '',
      disabled: false
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