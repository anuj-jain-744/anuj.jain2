import React from "react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import { compensationTypeCardFinalVAT } from "../../CommonFunction/CommonFunction";
import { getAmountWithIcon } from "@app-shell/utils/common";
 
interface ICoverageTypeSelect {
  languageData: LanguageData | undefined | null;
}
 
const ThirdpartyFooter = ({ languageData }: ICoverageTypeSelect) => {
  const { comp3rdParty } = useQuoteAndBuyContext();
  return (
    <div className="d-flex align-items-center">
      <div>
        <span className="walaa-medium-500 footer-amount">
          {getAmountWithIcon(comp3rdParty?.pricingOptions[0]?.finalAmount)}&nbsp;
        </span>
      </div>
      <div className="walaa-regular-400 footer-vat">
        +
        {compensationTypeCardFinalVAT(
          comp3rdParty?.pricingOptions[0]?.taxFeeBreakdowns[0]
            ?.percentage as number
        )}
        % {languageData?.vat}
      </div>
    </div>
  );
};
 
export default ThirdpartyFooter;
 