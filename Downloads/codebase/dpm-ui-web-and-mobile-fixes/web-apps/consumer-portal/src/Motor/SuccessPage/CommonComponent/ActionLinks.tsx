import React from "react";
import Download from "assets/SuccessPage/Download.svg";
import Share from "assets/SuccessPage/Share.svg";
import { LanguageData } from "types/languageData";

interface ActionLinkProps {
    handleDownloadPolicy?: () => void;
    languageData: LanguageData;
    handleDownloadInvoice?: () => void;
}

interface ActionLinkItemProps {
    icon: string;
    text: string;
    onClick?: () => void;
}

const ActionLinks:React.FC<ActionLinkProps> = ({ languageData, handleDownloadPolicy, handleDownloadInvoice }) => (
    <div className="links-container">
      <ActionLink 
        icon={Download}
        text={languageData?.download_policy}
        onClick={handleDownloadPolicy}
      />
      <ActionLink 
        icon={Download}
        text={languageData?.download_payment_receipt}
        onClick={handleDownloadInvoice}
      />
      <ActionLink 
        icon={Share}
        text={languageData?.share}
      />
    </div>
  );

  const ActionLink: React.FC<ActionLinkItemProps> = ({
    icon,
    text,
    onClick,
  }) => (
    <div
      className="link-item"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div>
        <img src={icon} alt={text} />
      </div>
      <div className="btn-links walaa-regular-400">{text}</div>
    </div>
  );

  export default ActionLinks;