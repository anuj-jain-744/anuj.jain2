import React from "react";
import style from "./Features.module.scss";
import ToggleButton from "../ToggleButton/ToggleButton";
import { LanguageData } from "types/languageData";

interface FeaturesProps {
  languageData: LanguageData | undefined | null;
  isAdaptiveCruise: boolean;
  setIsAdaptiveCruise: (value: boolean) => void;
  isCruiseControl: boolean;
  setIsCruiseControl: (value: boolean) => void;
  isModified: boolean;
  setIsModified: (value: boolean) => void;
}

const Features: React.FC<FeaturesProps> = ({
  languageData, 
  isAdaptiveCruise,
  setIsAdaptiveCruise,
  isCruiseControl,
  setIsCruiseControl,
  isModified,
  setIsModified
}) => {
  return (
    <div className={style.container}>
      <div className={style.heading}>{languageData?.features}</div>
      <div className={style.row}>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.adaptive_cruise_control}</div>
          </div>
          <ToggleButton
            isActive={isAdaptiveCruise}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setIsAdaptiveCruise}
          />
        </div>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.cruise_control}</div>
          </div>
          <ToggleButton
            isActive={isCruiseControl}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setIsCruiseControl}
          />
        </div>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.modifications}</div>
          </div>
          <ToggleButton
            isActive={isModified}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setIsModified}
          />
        </div>
      </div>
    </div>
  );
};

export default Features;