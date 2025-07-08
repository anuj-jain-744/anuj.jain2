import  React from "react";

import style from "./ExpandSection.module.scss";
import { LanguageData } from "types/languageData";

interface ExpandSectionProps {
    languageData: LanguageData | undefined | null;
    handleExpand?: () => void;
}

const ExpandSection: React.FC<ExpandSectionProps> = ({
  languageData,
  handleExpand,
}) => (
  <div
    className={style.container}
    onClick={handleExpand}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleExpand();
      }
    }}
  >
    {/* <img src={vector} alt="vector line" /> */}
    <hr className={style.horizontalLine} />
    <div className={style.expandText}>{languageData?.show_more}</div>
    <hr className={style.horizontalLine} />
    {/* <img src={vector} alt="vector line" /> */}
  </div>
);

export default ExpandSection;