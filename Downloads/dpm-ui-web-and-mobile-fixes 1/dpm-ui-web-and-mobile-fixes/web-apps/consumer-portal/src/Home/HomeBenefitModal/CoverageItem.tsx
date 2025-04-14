import React from "react";
import "./styles.scss";
import Approve from "assets/QuoteAndBuy/Approve.svg";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { commonKeywords } from 'constant';

interface CoverageItemProps {
  items: any;
  triggerViewBenefit: () => void;
}

const CoverageItem: React.FC<CoverageItemProps> = ({ items, triggerViewBenefit }) => {
  const { type, child, type1, type2, classname } = items
  const { yes } = commonKeywords;

  const expandAccordion = (key: string, child: string) => () => {
    if (child) {
      triggerViewBenefit(key)
    }
  }

  return <div className={`coverage-item ${classname}`}>
    <div className={`${child ? 'type' : ''} type-new walaa-regular-400`}
      onClick={expandAccordion(type, child)}
    >
      <div className="text-value">{type}</div>
      {child && (
        <div className="rows">
          <ExpandLessIcon />
        </div>
      )}
    </div>
    <div className="value1">
      {type1 === yes ? <img src={Approve} alt={type1} /> : type1}
    </div>
    <div className="value2">
      {type2 === yes ? <img src={Approve} alt={type2} /> : type2}
    </div>
  </div>
};


export default CoverageItem;