import React from "react";
import Cancel from "assets/QuoteAndBuy/Cancel.svg";
import Approve from "assets/QuoteAndBuy/Approve.svg";
import "./styles.scss";
import data from "./ViewBenefitModal.json";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getCurrencySymbol } from "@app-shell/utils/common";

interface CoverageItemProps {
  items: any;
  accordians: string;
  openAccordion: string;
  triggerViewBenefit: () => void;
  isHome: string;
}

const CoverageItem: React.FC<CoverageItemProps> = ({ items, accordians = '', triggerViewBenefit, openAccordion = [], isHome }) => {
  const { type, child, value, isApproved, classname } = items

  const expandAccordion = (key: string) => () => {
    if (key) {
      triggerViewBenefit(key)
    }
  }
  return(<div className={`coverage-item-new ${classname}`}>
    <div className={`${child ? 'coverage-item-sub' : ''} type-new walaa-regular-400`}
      onClick={expandAccordion(type)}
    >
      <div className="text-value">{getCurrencySymbol(type)}</div>
      {child && (
        <div className="rows">
          <ExpandLessIcon />
        </div>
      )}
    </div>
    {(isApproved || isApproved === false) && <div className="value-new">
      {isApproved === "-" ? (
        <span>-</span>
      ) : (
        <img
          src={isApproved ? Approve : Cancel}
          alt={isApproved ? data.approved : data.notApproved}
        />
      )}
    </div>}
    {value && <div className="value-new">{value === 'Yes' ? <img src={Approve} alt={value} /> : getCurrencySymbol(value)}</div>}
  </div>)
};

export default CoverageItem;
