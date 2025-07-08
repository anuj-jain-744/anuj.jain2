import React, { useMemo } from "react";
import ThemeRadioCheckbox from "../../components/ThemeRadioCheckbox";
import { LanguageData } from "types/languageData";
import { MOTOR, motorCoverageTypes, productIDs, TRAVEL, HOME } from "constant";
interface ITermsandcon {
  languageData: LanguageData | undefined | null;
  onChangehandler?: (e: React.FormEvent<HTMLDivElement>) => void;
  isChecked: boolean;
  setIsChecked?: (val: boolean) => void;
  productcode?: string;
  coverageName?: string;
  isDisabled?: boolean;
}

function TermsAndCon({
  languageData,
  onChangehandler,
  isChecked,
  setIsChecked,
  productcode,
  coverageName,
  isDisabled,
}: Readonly<ITermsandcon>) {
  const termsURL = useMemo(() => {
    let url: string | undefined = "";
    if (productcode === TRAVEL) url = languageData?.terms_doc_url_travel;
    else if (productcode === MOTOR || productcode === productIDs.motor) {
      if (
        coverageName?.toLowerCase() === motorCoverageTypes?.comp?.toLowerCase()
      )
        url = languageData?.terms_doc_url_motor_comprehensive;
      else if (
        coverageName?.toLowerCase() === motorCoverageTypes.tp?.toLowerCase()
      )
        url = languageData?.terms_doc_url_motor_third_party;
    }
    else if (productcode?.toLowerCase() === HOME?.toLowerCase()) {
      url = languageData?.terms_doc_url_home;
    }
    return url ?? "";
  }, []);

  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!termsURL) event.preventDefault();
  };

  return (
    <div
    className={`terms-container ${isDisabled ? "terms-disabled" : ""}`}
    onChange={onChangehandler}>
      <div className="checkbox-wrapper">
        <ThemeRadioCheckbox
          label=""
          type="checkbox"
          defaultChecked={isChecked}
          onChangehandler={() => setIsChecked && setIsChecked(!isChecked)}
          classes="register-compensate-radio radio-check-cust walaa-regular-400"
          isDisabled={isDisabled}

        />
      </div>
      <span className="terms-text">
        {languageData?.i_agree}{" "}
        <a
          className="terms-condition-click"
          href={termsURL}
          target="_blank"
          onClick={onLinkClick}
          rel="noopener noreferrer"
        >
          {languageData?.terms_conditions}
        </a>
        <span className="and-word-text"> {languageData?.and} </span>

        <a
          className="terms-condition-click only-text"
          href={languageData?.privacy_notice_link}
          target="_blank"
          onClick={onLinkClick}
        >
        {languageData?.privacy_notice}
        </a>
        <span className="red-required"> *</span>
      </span>
    </div>
  );
}

export default TermsAndCon;
