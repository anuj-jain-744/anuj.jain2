import React from "react";
import "./BackFooter.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LanguageData } from "types/languageData";

interface BackFooterProps {
  isBackBtnDisabled?: boolean;
  isQuoteAndBuy?: boolean;
  handleSelectCoverage?: () => void;
  languageData?: LanguageData | undefined | null;
  isQuoteLoading?: boolean;
  disableLinkButton?: boolean;
  handleBackClick?: (path: string) => void;
  handleLinkClick?: () => void;
  stepValue?: number;
  classes?: string;
}

const BackFooter: React.FC<BackFooterProps> = ({ classes, isBackBtnDisabled,disableLinkButton, isQuoteAndBuy, handleSelectCoverage, languageData, isQuoteLoading, handleBackClick, handleLinkClick, stepValue}) => {
  const handleBackBtn = () => {
    if (handleBackClick !== undefined) {
      handleBackClick('/dashboard');
    }
  };

  return (
    <div className={`main-footer ${classes}`}>
      <div className="footer-btns walaa-medium-500">
        <div className="btn-container">
          {!isBackBtnDisabled && <ThemeButton
            classes={"back-btn back-button"}
            isDisabled={false}
            title={languageData?.back ?? "Back"}
            variant="linked"
            icon={true}
            onClickhandler={handleBackBtn}
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