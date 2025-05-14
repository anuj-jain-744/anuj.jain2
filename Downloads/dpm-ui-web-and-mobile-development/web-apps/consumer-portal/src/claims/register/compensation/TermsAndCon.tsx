import React,{ useMemo, useState } from "react";
import ThemeRadioCheckbox from "../../components/ThemeRadioCheckbox";
import TermsAndConditionDialog from "./TermsAndConditionDialog";
import { LanguageData } from "types/languageData";
import { MOTOR, motorCoverageTypes, TRAVEL } from "constant";
 
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
    else if (productcode === MOTOR) {
      if (coverageName === motorCoverageTypes?.comp)
        url = languageData?.terms_doc_url_motor_comprehensive;
      else if (coverageName === motorCoverageTypes.tp)
        url = languageData?.terms_doc_url_motor_third_party;
    }
    return url ?? "";
  }, []);
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    setShowDialog(true);
  }

  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!termsURL) event.preventDefault();
  };

  return (
    <div onChange={onChangehandler}>
      {showDialog && (
        <TermsAndConditionDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          languageData={{
            title_for_terms_conditions: languageData?.terms_conditions.toString() ?? "",
            content_terms_conditions: languageData?.content_terms_conditions.toString() ?? "",
            ok: languageData?.ok ? languageData?.ok.toString() : "OK",
          }}
        />
      )}
      <ThemeRadioCheckbox
        label=""
        type="checkbox"
        defaultChecked={isChecked}
        onChangehandler={() => setIsChecked && setIsChecked(!isChecked)}
        classes="register-compensate-radio radio-check-cust walaa-regular-400"
      />
      <span>{languageData?.i_agree}{" "}</span>
      {termsURL ? (
        <a
          className="terms-condition-click"
          href={termsURL}
          target="_blank"
          onClick={onLinkClick}
        >
          {languageData?.terms_conditions}
        </a>
      ) : (
        <a className="terms-condition-click" onClick={handleClick}>
          {languageData?.terms_conditions}
        </a>
      )}
      <span className="red-required">{" "}*</span>

    </div>
  );
}

export default TermsAndCon;
