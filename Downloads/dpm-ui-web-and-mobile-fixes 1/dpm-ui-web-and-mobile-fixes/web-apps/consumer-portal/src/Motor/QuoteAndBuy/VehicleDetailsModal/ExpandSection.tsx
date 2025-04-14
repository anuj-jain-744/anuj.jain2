import  React from "react";
import vector from "assets/QuoteAndBuy/vectorLine.svg";

import style from "./ExpandSection.module.scss";
import { LanguageData } from "types/languageData";

interface ExpandSectionProps {
    languageData: LanguageData | undefined | null;
};

const ExpandSection: React.FC<ExpandSectionProps> = ({languageData}) => (
    <div className={style.container}>
        <img src={vector} alt="vector line" />
        <div className={style.expandText}>{languageData?.show_more}</div>
        <img src={vector} alt="vector line" />
    </div>
);

export default ExpandSection;