import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import { useLocation } from "react-router-dom";
import { LanguageData } from "types/languageData";
import { capitalizeNameFirstLetter, isValidSubscribeEmail } from "@dpm/shared-module";
import { toCamelCase } from "utils/quoteAndBuyTravel";

interface SubscribeEmailProps {
  languageData?: LanguageData | null | undefined;
  email: string | null;
  setEmail: (val: string) => void;
}

interface Texts {
  important: string;
  label: string;
  placeholder: string;
  required: string;
  invalid: string;
}

const SubscribeEmail: React.FC<SubscribeEmailProps> = ({
  languageData,
  email,
  setEmail
}) => {
  const [error, setError] = useState<string | null>("");
  const location = useLocation();
  const propsData = location?.state?.data;
  const ownerFullNameEnglishCapitalized = capitalizeNameFirstLetter(propsData?.ownerDetail?.ownerFullNameEnglish);

  const texts: Texts = useMemo(() => ({
    important: languageData?.your_email_id_is_important ?? "",
    label: languageData?.email_id_label ?? "",
    placeholder: languageData?.placeholder_enter_email_id ?? "",
    required: languageData?.value_is_required ?? "",
    invalid: languageData?.email_is_invalid ?? ""
  }), [languageData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    if (value === "") setError(texts.required);
    else if (isValidSubscribeEmail(value) === false) setError(texts.invalid);
    else setError("");
    setEmail(value);
  };

 
  return (
    <div className="card-section background-color-white">
      <div className="email-wrap">
        <p>
          {toCamelCase(propsData?.ownerDetail?.ownerFullNameEnglish || propsData?.ownerFullNameEnglish)}, 
          &nbsp;{texts.important }
        </p>
        <label>
          {texts.label}
          <span className="red-required">*</span>
        </label>
        <input
          type="email"
          autoFocus
          name="email"
          id=""
          placeholder={texts.placeholder}
          value={email ?? ""}
          onChange={handleChange}
          onKeyUp={handleChange}
        />
        <span className="error-input">{error}</span>
      </div>
    </div>
  );
};

export default SubscribeEmail;
