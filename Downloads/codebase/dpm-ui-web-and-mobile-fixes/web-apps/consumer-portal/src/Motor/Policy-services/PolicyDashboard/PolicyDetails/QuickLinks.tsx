import React, { useMemo, useState } from "react";
import styles from "./PolicyDetails.module.scss";
import Download from "assets/PolicyDetails/Download.svg";
import History from "assets/PolicyDetails/History.svg";
import tokenAdd from "assets/PolicyDetails/tokenAdd.svg";
import Contract_Delete from "assets/PolicyDetails/Contract_Delete.svg";
import Addon_disable from "assets/Dashboard/Contextual Token Add_disabled.svg";
import VerifiedUser from "assets/Dashboard/Verified User.svg";
import {
  TRAVEL,
  MOTOR,
  endorseTypes,
  dateFormats,
  travelMultiTripDurationDays,
} from "constant";
import { LanguageData } from "types/languageData";
import Warning from "assets/Dashboard/Warning Fill.svg";
import Warning_large from "assets/Dashboard/Warning Fill_Large.svg";
import ErrorDialogBox from "components/ErrorDialogBox/ErrorDialogBox";
import { isPastDateTime } from "utils/formatDate";
import { getTravelDuration, isTravelClaimDisabled } from "utils/quoteAndBuy";
import { sanitizeHtml } from "@dpm/shared-module";
import { PolicyDetails } from "types/policyDetails";

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

const QuickLink: React.FC<QuickLinkProps> = ({
  icon,
  text,
  onClick,
  className,
  disabled,
  claimNumber,
  languageData,
}) => (
  <div
    className={`${styles.linkFrame} ${className} ${
      disabled ? styles.disabledLink : ""
    }`}
    onClick={!disabled ? onClick : undefined}
  >
    <img src={icon} alt={text} />
    <div className={styles.linkText}>{text}</div>
    {claimNumber && text === languageData?.cancel_policy && (
      <img src={Warning} />
    )}
  </div>
);

interface QuickLinksProps {
  navigateTo?: (url: string, data?: unknown) => void;
  highlightCancelPolicy?: boolean;
  policyInfo: {
    policyNo: string;
    endorsementNo: string;
    productCode: string;
    nationalID: string;
    mobileNo: string;
    endorsementType?: string;
    travelEndDate?: string;
    travelStartDate?: string;
  };
  claimNumber?: string;
  languageData?: LanguageData;
  policyData?: PolicyDetails | undefined | null;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({
  navigateTo,
  highlightCancelPolicy,
  policyInfo,
  languageData,
  claimNumber,
  policyData,
}) => {
  const { productCode, policyNo, endorsementType } = policyInfo;
  const [isModalVisible, setModalVisible] = useState(false);
  const travelClaimDisabled = useMemo(() => {
    let result = endorsementType === endorseTypes.cancel;
    if (productCode === TRAVEL && result == false) {
      result =
        isPastDateTime(
          policyData?.policyDetails?.effectiveDate,
          dateFormats.apiDate
        ) === true
          ? result
          : true;
      if (result === false) result = isTravelClaimDisabled(policyInfo);
    }
    return result;
  }, [policyInfo]);

  const claimData = {
    policies: policyInfo,
    ownerId: policyInfo?.nationalID,
    mobileNumber: policyInfo?.mobileNo,
    productIDs: policyInfo?.productCode?.toLowerCase(),
    isPolicyCardSelected: true,
  };

  const isTravelMultiTrip =
    getTravelDuration(
      policyData?.policyDetails?.expiryDate,
      policyData?.policyDetails?.effectiveDate
    ) > travelMultiTripDurationDays;

  const getModalBodyContent = () =>
    claimNumber ? (
      <div>
        <p
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(
              languageData?.cancelModalContent
                .replace(
                  /<<claimNo>>/i,
                  `<strong>${claimNumber || ""}</strong>`
                )
                .replace(/<<policyNo>>/i, `<strong>${policyNo || ""}</strong>`)
            ),
          }}
        ></p>
      </div>
    ) : (
      <p>{languageData?.policyCancelErrMsg}</p>
    );

  const handleLinkClick = (url: string, text?: string) => {
    if (
      text === languageData?.cancel_policy &&
      (claimNumber ||
        (productCode === TRAVEL &&
          isPastDateTime(
            policyData?.policyDetails?.effectiveDate,
            dateFormats.apiDate
          ) && !isTravelMultiTrip))
    ) {
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
      url: "/PolicyService/Endorsement",
      className: highlightCancelPolicy ? styles.disabledLinkText : "",
      disabled: highlightCancelPolicy || productCode === TRAVEL,
    },
    {
      icon: VerifiedUser,
      text: languageData?.register_a_claim,
      url:
        productCode === TRAVEL
          ? "/Travel/Claim/RegisterClaim"
          : "/Register-claim",
      className: highlightCancelPolicy ? styles.disabledLinkText : "",
      disabled:
        highlightCancelPolicy || productCode === MOTOR || travelClaimDisabled,
    },
    {
      icon: Download,
      text: languageData?.documents,
      url: "/PolicyService/Documents",
      className: "",
      disabled: false,
    },
    {
      icon: History,
      text: languageData?.policy_history,
      url: "/PolicyService/History",
      className: "",
      disabled: false,
    },
    {
      icon: Contract_Delete,
      text: languageData?.cancel_policy,
      url:
        productCode === TRAVEL
          ? "/travel/claim/policy-cancellation"
          : productCode === MOTOR ? "/motor/claim/policy-cancellation" 
          : "/home/claim/policy-cancellation",
      className: highlightCancelPolicy ? styles.disabledLinkText : "",
      disabled: highlightCancelPolicy,
    },
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
      {isModalVisible &&
        (claimNumber ||
          (policyData?.policyDetails?.prodCode === TRAVEL &&
            isPastDateTime(
              policyData?.policyDetails?.effectiveDate,
              dateFormats.apiDate
            ) &&
            !isTravelMultiTrip)) && (
          <ErrorDialogBox
            imgSrc={Warning_large}
            onClose={() => setModalVisible(false)}
            buttonName={languageData?.ok}
            headingContent={languageData?.cancelModalHeader}
            bodyContent={getModalBodyContent()}
            isCentered={true}
          />
        )}
    </div>
  );
};
