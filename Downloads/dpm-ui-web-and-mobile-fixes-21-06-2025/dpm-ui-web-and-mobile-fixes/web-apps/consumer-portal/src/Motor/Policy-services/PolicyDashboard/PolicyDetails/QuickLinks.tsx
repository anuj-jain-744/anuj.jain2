import React, { useState } from 'react';
import styles from './PolicyDetails.module.scss';
import Download from 'assets/PolicyDetails/Download.svg';
import History from 'assets/PolicyDetails/History.svg';
import tokenAdd from 'assets/PolicyDetails/tokenAdd.svg';
import Contract_Delete from 'assets/PolicyDetails/Contract_Delete.svg';
import Addon_disable from "assets/Dashboard/Contextual Token Add_disabled.svg";
import VerifiedUser from "assets/Dashboard/Verified User.svg";
import { TRAVEL, MOTOR, endorseTypes } from "constant";
import { LanguageData } from 'types/languageData';
import Warning from "assets/Dashboard/Warning Fill.svg";
import Warning_large from "assets/Dashboard/Warning Fill_Large.svg";
import ErrorDialogBox from 'components/ErrorDialogBox/ErrorDialogBox';
import { sanitizeHtml } from "@dpm/shared-module";

interface QuickLinkProps {
  icon: string;
  text: string | undefined;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  claimNumber?: string;
  policyNumber?: string;
  languageData?: LanguageData;
}

const QuickLink: React.FC<QuickLinkProps> = ({ icon, text, onClick, className, disabled, claimNumber, languageData }) => (
  <div
    className={`${styles.linkFrame} ${className} ${disabled ? styles.disabledLink : ''}`}
    onClick={!disabled ? onClick : undefined}
  >
    <img src={icon} alt={text} />
    <div className={styles.linkText}>{text}</div>
    {claimNumber && text === languageData?.cancel_policy && <img src={Warning} />}
  </div>
);

interface QuickLinksProps {
  navigateTo?: (url: string, data?: unknown) => void;
  highlightCancelPolicy?: boolean;
  policyInfo: {
    policyNo: string,
    endorsementNo: string,
    productCode: string,
    nationalID: string,
    mobileNo: string,
    endorsementType?: string,
    travelEndDate?: string,
    travelStartDate?: string
  };
  claimNumber?: string;
  languageData?: LanguageData;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({ navigateTo, highlightCancelPolicy, policyInfo, languageData, claimNumber }) => {
  const { productCode, policyNo, endorsementType, travelEndDate, travelStartDate } = policyInfo;
  const [isModalVisible, setModalVisible] = useState(false);
  const claimData = {
    policies: policyInfo,
    ownerId: policyInfo?.nationalID,
    mobileNumber: policyInfo?.mobileNo,
    productIDs: policyInfo?.productCode?.toLowerCase(),
    isPolicyCardSelected: true,
  }

  const today = new Date();
  const addDays = 28 * 24 * 60 * 60 * 1000;
  const disableRegisterClaim = () => {
    if (productCode === TRAVEL) {
      if (travelEndDate === "" || travelStartDate === "" || endorsementType === endorseTypes.cancel) {
        return true;
      } else {
        const startDate = new Date(travelStartDate);
        const expiryDate = new Date(travelEndDate);
        const expiryPlus28Days = new Date(expiryDate.getTime() + addDays);
        return !(today >= startDate && today <= expiryPlus28Days);
      }
    }
    return false;
  };


  const handleLinkClick = (url: string, text?: string) => {
    if (text === languageData?.cancel_policy && claimNumber) {
      setModalVisible(true); // Show modal if there is any active claim corresponding to policy exists
    } else if (navigateTo) {
      switch (text) {
        case languageData?.register_a_claim:
          navigateTo(url, { data: claimData });
          break;
        default:
          navigateTo(url, { data: policyInfo });
          break;
      }
      
    }
  };

  const links = [
    {
      icon: policyInfo?.productCode === TRAVEL ? Addon_disable : tokenAdd,
      text: languageData?.additional_benefits,
      url: '/PolicyService/Endorsement',
      className: highlightCancelPolicy ? styles.disabledLinkText : '',
      disabled: highlightCancelPolicy || productCode === TRAVEL 
    },
    {
      icon: VerifiedUser,
      text: languageData?.register_a_claim,
      url: productCode === TRAVEL ? "/Travel/Claim/RegisterClaim" : "/Register-claim",
      className: highlightCancelPolicy ? styles.disabledLinkText : '',
      disabled: highlightCancelPolicy || productCode === MOTOR || disableRegisterClaim
    },
    {
      icon: Download,
      text: languageData?.documents,
      url: '/PolicyService/Documents',
      className: '',
      disabled: false
    },
    {
      icon: History,
      text: languageData?.policy_history,
      url: '/PolicyService/History',
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
          onClick={() => handleLinkClick(link.url, link.text)}
          policyNumber={policyNo}
          claimNumber={claimNumber}
          languageData={languageData}
          className={link.className}
          disabled={link.disabled}
        />
      ))}
      {isModalVisible && claimNumber && (
        <ErrorDialogBox imgSrc={Warning_large} onClose={() => setModalVisible(false)} buttonName={languageData?.ok} headingContent={languageData?.cancelModalHeader} bodyContent={
          <div>
            <p
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(languageData?.cancelModalContent
                    .replace(
                      /<<claimNo>>/i,
                      `<strong>${claimNumber || ""}</strong>`
                    )
                    .replace(
                      /<<policyNo>>/i,
                      `<strong>${policyNo || ""}</strong>`
                    ),
                )}}
              ></p>
          </div>
        }
        isCentered={true}
        />
      )}
    </div>
  );
};