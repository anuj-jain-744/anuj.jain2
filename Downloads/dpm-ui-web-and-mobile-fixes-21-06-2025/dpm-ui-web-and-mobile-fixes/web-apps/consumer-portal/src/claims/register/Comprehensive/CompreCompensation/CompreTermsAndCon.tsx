import React from "react";
import ThemeRadioCheckbox from "../../../components/ThemeRadioCheckbox";

interface ITermsandcon {
  onChangehandler?: (e: React.FormEvent<HTMLDivElement>) => void;
  isChecked: boolean;
}

function CompreTermsAndCon({ onChangehandler, isChecked }: ITermsandcon) {
  return (
    <div onChange={onChangehandler}>
      <ThemeRadioCheckbox
        type="checkbox"
        defaultChecked={isChecked}
        label="I agree to the terms and conditions."
        classes="register-compensate-radio radio-check-cust walaa-regular-400"
      />
    </div>
  );
}

export default CompreTermsAndCon;
