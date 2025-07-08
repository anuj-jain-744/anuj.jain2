import React, { useMemo } from "react";
import { productIDs, MOTOR_COMP, MOTOR, TRAVEL } from "constant";
import { LanguageData } from "types/languageData";

interface ITermsandcon {
  languageData?: LanguageData | undefined | null;
  productCode?: string;
  coverageName?: string;
}

const TermsAndConditionLink = ({ languageData, productCode, coverageName }: Readonly<ITermsandcon>) => {

  const normalizedProductName = useMemo(() => {
    if (productCode === "RMCOM" || productCode === "RMTPL") {
      return productIDs.motor;
    }
    return productCode;
  }, [productCode]);

  const termsURL = useMemo(() => {
    let url: string | undefined = "";
    if (normalizedProductName === productIDs.motor) {
      if (productCode === MOTOR_COMP) {
        url = languageData?.endorsements_add_benefits_comprehensive;
      }
      else if (productCode === MOTOR) {
        url = languageData?.endorsements_add_benefits_third_party;
      }
    } else if (productCode === TRAVEL) {
      url = languageData?.terms_doc_url_travel;
    }
    return url ?? "";
  }, [languageData, normalizedProductName, productCode]);

  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!termsURL) event.preventDefault();
  };

  return (
    <div className="terms-and-conditions-container">
      <a className="terms-condition-click only-text"
        href={termsURL}
        target="_blank"
        onClick={onLinkClick}
      >
        {languageData?.terms_conditions}
      </a>

    </div>
  );
};

export default TermsAndConditionLink;