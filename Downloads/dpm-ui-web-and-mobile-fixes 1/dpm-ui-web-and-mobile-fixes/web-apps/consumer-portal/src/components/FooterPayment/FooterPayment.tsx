import React from "react";
import ThemeButton from "../../Motor/Endorsement/sharedComponent/ThemeButton";
import "./FooterPayment.scss";

interface FooterProps {
  handlePayment: () => void;
  isAnyBenefitSelected: boolean;
  isEnable: boolean;
  selectedPolicyNumber: string | undefined;
  setSelectedPolicyNumber: (policyNumber: string | undefined) => void;
  navigateTo?: (path: string) => void;
}

const FooterPayment: React.FC<FooterProps> = ({
  selectedPolicyNumber,
  setSelectedPolicyNumber,
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
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterPayment;
