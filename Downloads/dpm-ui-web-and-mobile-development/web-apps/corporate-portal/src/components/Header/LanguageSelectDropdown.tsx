import React from "react";
import { Dropdown } from "react-bootstrap";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useCommonContext } from "@dpm/shared-module";

interface Language {
  label: string;
  key: string;
  subLabel: string;
  image: string;
}

interface LanguageSelectDropdownProps {
  languageContent: Language[];
}

const LanguageSelectDropdown: React.FC<LanguageSelectDropdownProps> = ({ languageContent }) => {
  const {currentLanguage, changeLanguage} = useCommonContext();

  return (
    <div className="language-option-wrapper walaa-medium-500">
      {languageContent.map((language, idx) => (
        <Dropdown.Item
          key={idx}
          onClick={() => changeLanguage(language.key)}
          className={currentLanguage === language.key ? "active" : ""}
        >
          {language.label}
          <CheckCircleIcon />
          <div className="language-select-option">
            <img src={language.image} alt="language" /> {language.subLabel}
          </div>
        </Dropdown.Item>
      ))}
    </div>
  );
};

export default LanguageSelectDropdown;