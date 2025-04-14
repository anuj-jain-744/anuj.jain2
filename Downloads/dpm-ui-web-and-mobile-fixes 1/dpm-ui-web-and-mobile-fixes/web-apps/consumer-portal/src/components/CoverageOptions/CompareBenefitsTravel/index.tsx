import ThemeButton from "components/ThemeComponents/ThemeButton";
import React from "react";
import { TravelData } from "types/languageData";

interface ICompareBenefitsTravelProps {
  TravelData: TravelData | undefined | null;
}

const CompareBenefitsTravel: React.FC<
  ICompareBenefitsTravelProps
> = ({ TravelData }) => {
  return (
    <ThemeButton
      classes="register-claim-link-no-button text-decoration-underline link-offset-3 p-0 ps-2"
      isDisabled={false}
      title={TravelData?.compare_benefits as string}
      iconRight={true}
      iconName="ArrowForwardIcon"
      variant="link"
    />
  );
};

export default CompareBenefitsTravel;
