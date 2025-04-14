import React from "react";
import "./BackFooter.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LanguageData } from "types/languageData";

interface BackFooterProps {
  selectedPolicyNumber?: string | undefined;
  setSelectedPolicyNumber?: (policyNumber: string | undefined) => void;
  navigateTo?: (path: string) => void;
  isBackBtnDisabled?: boolean;
  isQuoteAndBuy?: boolean;
  handleSelectCoverage?: () => void;
  languageData?: LanguageData | undefined | null;
  isQuoteLoading?: boolean;
  disableLinkButton?: boolean;
  handleBackClick?: () => void;
  handleLinkClick?: () => void;
  stepValue: number;
}

const BackFooter: React.FC<BackFooterProps> = ({ selectedPolicyNumber, setSelectedPolicyNumber,
   navigateTo, isBackBtnDisabled,disableLinkButton, isQuoteAndBuy, handleSelectCoverage, languageData, isQuoteLoading, handleBackClick, handleLinkClick, stepValue}) => {
  const handleBackBtn = () => {
    if (navigateTo !== undefined) {
      navigateTo('/dashboard');
    }
  };

  return (
    <div className="main-footer">
      <div className="footer-btns walaa-medium-500">
        <div className="btn-container">
          {!isBackBtnDisabled && <ThemeButton
            classes={"back-btn back-button"}
            isDisabled={false}
            title={languageData?.back ?? "Back"}
            variant="linked"
            icon={true}
            onClickhandler={handleBackClick || handleBackBtn}
            iconName="ChevronLeft"
          />
        }
          {isQuoteAndBuy && <ThemeButton
            classes={"submit-btn button-link"}
            isDisabled={disableLinkButton || false}
            title={isQuoteLoading ? 'Loading...' :languageData[`step${stepValue}`]}
            variant="linked"
            icon={true}
            onClickhandler={handleLinkClick || handleSelectCoverage}
            iconName="RightArrow"
            iconPosition="right"
          />}
        </div>
      </div>
    </div>
  );
};

export default BackFooter;