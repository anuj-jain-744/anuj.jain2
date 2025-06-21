import React from "react";
import "./index.scss";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LanguageData  } from "types/languageData";

interface BuyProductFooterProps {
  isBackButtonHide: boolean;
  handleOnClickHandler?: () => void; 
  languageData: LanguageData | null;
  isDisabledButton?: boolean;
  buttonTitle?: string;
  handleBackBtn?: () => void;
  classNames?: string;
}

const BuyProductFooter: React.FC<BuyProductFooterProps> = ({
  isBackButtonHide, 
  handleOnClickHandler, 
  languageData,  
  isDisabledButton,
  buttonTitle,
  handleBackBtn,
  classNames,
}: BuyProductFooterProps) => {
  
  return (
    <div className="main-footer-journey">
      <div className="footer-btns walaa-medium-500">
        <div className="btn-container-footer">
          {!isBackButtonHide && <ThemeButton
            classes={"back-btn"}
            isDisabled={false}
            title={languageData?.back.toString()}
            variant="linked"
            icon={true}
            onClickhandler={handleBackBtn}
            iconName="ChevronLeft"
          />
        }
          {buttonTitle && <ThemeButton
            classes={`margin-left-auto ${classNames ?? ""}`}
            isDisabled={isDisabledButton}
            title={buttonTitle}
            variant="linked"
            icon={true}
            onClickhandler={handleOnClickHandler}
            iconName={isDisabledButton ? "RightArrowDark" : "ChevronRight"}
            iconPosition="right"
          />}
        </div>
      </div>
    </div>
  );
};

export default BuyProductFooter;