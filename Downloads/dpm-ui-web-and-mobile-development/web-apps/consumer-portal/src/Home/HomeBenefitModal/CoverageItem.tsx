import React from "react";
import "./styles.scss";
import Approve from "assets/QuoteAndBuy/Approve.svg";
import Cancel from "assets/QuoteAndBuy/Cancel.svg";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { commonKeywords } from 'constant';
import { getCurrencySymbol } from "@app-shell/utils/common";

interface CoverageItemProps {
  items: any;
  triggerViewBenefit: () => void;
}

const CoverageItem: React.FC<CoverageItemProps> = ({ items, triggerViewBenefit }) => {
  const { type, child, type1, type2, classname } = items
  const { Yes, No } = commonKeywords;

  const expandAccordion = (key: string, child: string) => () => {
    if (child) {
      triggerViewBenefit(key)
    }
  }

  return <div className={`coverage-item ${classname}`}>
    <div className={`${child ? 'type' : ''} type-new walaa-regular-400`}
      onClick={expandAccordion(type, child)}
    >
      <div className="text-value">{getCurrencySymbol(type)}</div>
      {child && (
        <div className="rows">
          <ExpandLessIcon />
        </div>
      )}
    </div>
    <div className="value1">
      {type1 === Yes ? <img src={Approve} alt={type1} /> : type1 === No ? <img src={Cancel} alt={type1} /> : getCurrencySymbol(type1)}
    </div>
    <div className="value2">
      {type2 === Yes ? <img src={Approve} alt={type2} /> : type2 === No ? <img src={Cancel} alt={type2} /> : getCurrencySymbol(type2)}
    </div>
  </div>
};


export default CoverageItem;