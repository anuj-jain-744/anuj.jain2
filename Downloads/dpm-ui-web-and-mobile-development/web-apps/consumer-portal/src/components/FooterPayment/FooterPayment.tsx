import React from "react";
import ThemeButton from "../../Motor/Endorsement/sharedComponent/ThemeButton";
import "./FooterPayment.scss";

interface FooterProps {
  handlePayment: () => void;
  isAnyBenefitSelected: boolean;
  isEnable: boolean;
  navigateTo?: (path: string) => void;
}

const FooterPayment: React.FC<FooterProps> = ({
  navigateTo,
  handlePayment,
  isAnyBenefitSelected,
  isEnable,
}) => {
  const handleBackBtn = () => {
     if (navigateTo !== undefined) {
      navigateTo("/dashboard");
    }
  };

  return (
    <div className="main-footer">
      <div className="footer-btns walaa-medium-500">
        <div>
          <ThemeButton
            classes={"back-btn"}
            isDisabled={false}
            title="Back"
            variant="link"
            iconLeft={true}
            onClickhandler={handleBackBtn}
            iconName="ChevronLeftIcon"
          />
        </div>
        <div>
          {isAnyBenefitSelected && (
            <div>
              <ThemeButton
                classes={"payment-btn"}
                isDisabled={!isEnable}
                title="Proceed for Payment"
                variant="link"
                iconLeft={false}
                iconRight={true}
                iconName="ChevronRightIcon"
                onClickhandler={handlePayment}
                dataTestId="make-payment-btn"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterPayment;
