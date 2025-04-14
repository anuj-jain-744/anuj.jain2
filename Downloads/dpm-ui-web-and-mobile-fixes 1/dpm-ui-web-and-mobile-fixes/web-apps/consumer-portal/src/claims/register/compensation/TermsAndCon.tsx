import React,{ useState } from "react";
import ThemeRadioCheckbox from "../../components/ThemeRadioCheckbox";
import TermsAndConditionDialog from "./TermsAndConditionDialog";
import { LanguageData } from "types/languageData";
 
interface ITermsandcon {
  languageData: LanguageData | undefined | null; 
  onChangehandler?: (e: React.FormEvent<HTMLDivElement>) => void;
  isChecked: boolean;
  setIsChecked?: (val: boolean) => void;        
}

function TermsAndCon({
  languageData, 
  onChangehandler,
  isChecked,
  setIsChecked
}: Readonly<ITermsandcon>) {
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    setShowDialog(true);
  }

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
      <a className="terms-condition-click" onClick={handleClick}>{languageData?.terms_conditions}</a>
      <span className="red-required">{" "}*</span>

    </div>
  );
}

export default TermsAndCon;
