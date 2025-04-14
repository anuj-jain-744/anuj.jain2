import React, { useEffect } from "react";
import { third_party_vat, IComprehensive, IThirdParty } from "../../ConstantValue/ConstantValue";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import CoveragePlanFooter from "./CoveragePlanFooter"
import ThirdpartyFooter from "./ThirdpartyFooter"
import { calculatePremium } from "Motor/QuoteAndBuy/utils/calculatePremium";
import { getAmountText } from "@dpm/shared-module";
 
interface ICoverageTypeSelect {
  languageData: LanguageData | undefined | null;
}
 
interface IRadioCardFooter {
  label: string;
  languageData: LanguageData;
}
 
const ComprehensiveFooter = ({ languageData }: ICoverageTypeSelect) => {
  const {
    compWorkShop,
    compAgency,
    compMath,
    comprehensiveCardPrice,
    sliderValueDeductibles,
    setSliderValueDeductibles,
    setComprehensiveCardPrice,
  } = useQuoteAndBuyContext();
 
  const minDeductibleReferenceNoWorkShop = compWorkShop?.pricingOptions.reduce(
    (minOption, currentOption) => {
      return currentOption.deductibleReferenceNo <
        minOption.deductibleReferenceNo
        ? currentOption
        : minOption;
    }
  ).deductibleReferenceNo;
 
  const minimunDeductible = (minDeductibleReferenceNoWorkShop * 500).toString();
 
  useEffect(() => {
    if (
      compWorkShop &&
      compAgency &&
      compMath &&
      comprehensiveCardPrice === null
    ) {
      setSliderValueDeductibles(minimunDeductible)
      const priceData = calculatePremium(compWorkShop, compAgency, compMath);
      setComprehensiveCardPrice(priceData?.minFinalPrice);
    }
  }, [
    compWorkShop,
    compAgency,
    compMath,
    sliderValueDeductibles,
    setComprehensiveCardPrice,
    comprehensiveCardPrice,
  ]);
 
  return (
    <React.Fragment>
      <div className="walaa-medium-500">{languageData?.starting_from}</div>
      <div className="d-flex align-items-center">
        <div>
          <span className="footer-denomination">{languageData?.sar}&nbsp;</span>
          <span className="walaa-medium-500 footer-amount">
            {getAmountText(comprehensiveCardPrice)}&nbsp;
          </span>
        </div>
        <div className="walaa-regular-400 footer-vat">
          + {third_party_vat}% {languageData?.vat}
        </div>
      </div>
    </React.Fragment>
  );
};
 
function displayFooters(label:string, languageData:LanguageData) {
  return label === IThirdParty ? (
    <ThirdpartyFooter languageData={languageData} />
  ) : (
    <CoveragePlanFooter languageData={languageData} label={label} />
  )
}
 
const RadioCardFooter: React.FC<IRadioCardFooter> = ({
  label,
  languageData,
}) => {
  return (
    <React.Fragment>
      {label === IComprehensive ? (
        <ComprehensiveFooter languageData={languageData} />
      ) : (displayFooters(label, languageData))}
    </React.Fragment>
  );
};
 
export default RadioCardFooter;
 