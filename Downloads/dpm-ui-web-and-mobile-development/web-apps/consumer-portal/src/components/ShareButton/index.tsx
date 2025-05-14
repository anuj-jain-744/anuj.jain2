import React from "react";
import "./index.scss";
import Share from "assets/Share/Share.svg";
import ShareIcon from "assets/Share/ShareIcon.svg";
import { LanguageData } from "types/languageData";
interface ShareButtonProps {
  paymentLanguageData: LanguageData;
  showIcon?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({ paymentLanguageData, showIcon = false}) => {
  return (
    <div className="share-container">
      <a id="myLink" data-testid="link" className="share-content walaa-medium-500">
        {showIcon ? (
          <div className="share-label">
            <div><img src={ShareIcon} alt="Share" /></div>
            <div>{paymentLanguageData?.field_share || "Share" }</div>
          </div>
        ) : (
          <>
            {paymentLanguageData?.field_share}
            <img src={Share} alt="Share"  />
          </>
  )}
      </a>
    </div>
  );
};

export default ShareButton;