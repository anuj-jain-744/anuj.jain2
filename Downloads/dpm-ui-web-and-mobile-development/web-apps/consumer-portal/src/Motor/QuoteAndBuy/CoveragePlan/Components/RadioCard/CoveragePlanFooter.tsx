import React, { useEffect, useState } from "react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import { compensationTypeCardFinalVAT } from "../../CommonFunction/CommonFunction";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { getAmountWithIcon } from "@app-shell/utils/common";

 interface IRadioCardFooter {
  label: string;
  languageData: LanguageData;
}

interface CPResponse {
  [key: string]: any;
};

const CoveragePlanFooter = ({ languageData, label }: IRadioCardFooter) => { // Coverage plans for home insurance
  const { homePremiumResponse } = useQuoteAndBuyContext();

  const [cardDetails, setCardDetails] = useState<Record<string,number | null>>({});
  const headers = languageData[`${label}_headers`]; // gets coverge types of coverage plan from cms content
  const premiumData:Record<string,CPResponse> = {};
  headers?.forEach?.((data) => {
    const value = data.replace(/\s+/g, '').toLowerCase() // coverage type label should be lowercase and not any space in between
    if (homePremiumResponse[value]) {
      premiumData[value] = homePremiumResponse[value];
    }
  });

  useEffect(() => {
    if (!cardDetails?.cardPrice) {
      const priceData: { [key: string]: number | null; } = calculatePremium(premiumData); // display coverage plan SAR price and vat price compared with minimum value of coverage types
      setCardDetails({cardPrice: priceData?.minFinalPrice, vatPrice: priceData?.vatPrice});
    }
  }, [
    setCardDetails,
    cardDetails,
  ]);

  return (
    <React.Fragment>
      <div className="walaa-medium-500">{languageData?.starting_from}</div>
      <div className="d-flex align-items-center">
        <div>
          <span className="walaa-medium-500 footer-amount">
            {getAmountWithIcon(cardDetails.cardPrice)}&nbsp;
          </span>
        </div>
        <div className="walaa-regular-400 footer-vat">
          + {compensationTypeCardFinalVAT(cardDetails.vatPrice as number)}% {languageData?.vat}
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoveragePlanFooter;
