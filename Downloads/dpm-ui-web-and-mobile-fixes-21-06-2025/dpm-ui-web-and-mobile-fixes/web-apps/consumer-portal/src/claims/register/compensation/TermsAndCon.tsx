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
}

function TermsAndCon({
  languageData,
  onChangehandler,
  isChecked,
  setIsChecked,
  productcode,
  coverageName,
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
    <div onChange={onChangehandler}>
      <ThemeRadioCheckbox
        label=""
        type="checkbox"
        defaultChecked={isChecked}
        onChangehandler={() => setIsChecked && setIsChecked(!isChecked)}
        classes="register-compensate-radio radio-check-cust walaa-regular-400"
      />
      <span>{languageData?.i_agree} </span>
      <a
        className="terms-condition-click"
        href={termsURL}
        target="_blank"
        onClick={onLinkClick}
      >
        {languageData?.terms_conditions}
      </a>
      <span className="red-required"> *</span>
    </div>
  );
}

export default TermsAndCon;
