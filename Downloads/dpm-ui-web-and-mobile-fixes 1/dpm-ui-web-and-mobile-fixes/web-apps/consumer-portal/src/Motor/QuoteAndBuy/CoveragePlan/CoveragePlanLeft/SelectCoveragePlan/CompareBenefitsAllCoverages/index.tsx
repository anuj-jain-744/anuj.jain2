import ThemeButton from "components/ThemeComponents/ThemeButton";
import CompareBenefits from "Motor/QuoteAndBuy/CompareBenefits";
import HomeBenefitModal from "Home/HomeBenefitModal";
import React, { useState } from "react";
import { LanguageData } from "types/languageData";
import "./style.scss";

interface ICompareBenefitsAllCoveragesProps {
  languageData: LanguageData | undefined | null;
  coveragePlanSelected: string;
}

const CompareBenefitsAllCoverages: React.FC<
  ICompareBenefitsAllCoveragesProps
> = ({ languageData, coveragePlanSelected }) => {
  const [showCompareBenefits, setShowCompareBenefits] = useState(false);
  const handleCompareBenefitsAllCoverages = () => {
    setShowCompareBenefits(true);
  };

  const handleCloseModal = () => {
    setShowCompareBenefits(false);
  };

  return (
    <div className="CompareBenefitsAllCoverages-container">
      <ThemeButton
        classes="register-claim-link-no-button link-offset-3 p-0 ps-2 select-coverage-plan-link"
        isDisabled={false}
        title={
          languageData?.compare_benefits
            ? languageData?.compare_benefits
            : (languageData?.compare_benefits_for_all as string)
        }
        iconRight={true}
        iconName="ArrowRightAltIcon"
        variant="link"
        onClickhandler={handleCompareBenefitsAllCoverages}
      />

      {showCompareBenefits &&
        (languageData?.compare_benefits ? (
          <HomeBenefitModal
            showCompareBenefits={showCompareBenefits}
            languageData={languageData}
            coveragePlanSelected={coveragePlanSelected}
            onClose={handleCloseModal}
          />
        ) : (
          <CompareBenefits
            showCompareBenefits={showCompareBenefits}
            onClose={handleCloseModal}
          />
        ))}
    </div>
  );
};

export default CompareBenefitsAllCoverages;
