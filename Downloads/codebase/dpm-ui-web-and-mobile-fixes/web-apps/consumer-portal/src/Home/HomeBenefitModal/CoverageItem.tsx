import React from "react";
import "./styles.scss";
import Approve from "assets/QuoteAndBuy/Approve.svg";
import Cancel from "assets/QuoteAndBuy/Cancel.svg";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getCurrencySymbol } from "@app-shell/utils/common";
import { commonKeywords } from "constant";

interface CoverageItemProps {
  items: any;
  triggerViewBenefit: (key: string) => void;
  openAccordion: [];
}

const CoverageItem: React.FC<CoverageItemProps> = ({
  items,
  triggerViewBenefit,
  openAccordion,
}) => {
  const { type, child, type1, type2, classname } = items;
  const { Yes, No } = commonKeywords;

  const expandAccordion = (key: string, child: string) => () => {
    if (child) {
      triggerViewBenefit(key);
    }
  };

  // Function to render the columns based on the type
  function renderColumns(
    type: string,
    Yes: string,
    No: string,
    classname?: string
  ) {
    return (
      <div className={classname}>
        {type === Yes ? (
          <img src={Approve} alt={type} />
        ) : type === No ? (
          <img src={Cancel} alt={type} />
        ) : (
          getCurrencySymbol(type)
        )}
      </div>
    );
  }

  return (
    <div className={`coverage-item ${classname}`}>
      <div
        className={`${child ? "type" : ""} type-new walaa-regular-400`}
        onClick={expandAccordion(type, child)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            expandAccordion(type, child);
          }
        }}
      >
        <div className="text-value">{getCurrencySymbol(type)}</div>
        {child && (
          <div className="rows">
            {openAccordion.indexOf(type) !== -1 ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </div>
        )}
      </div>
      {renderColumns(type1, Yes, No, "value1")}
      {renderColumns(type2, Yes, No, "value2")}
    </div>
  );
};
export default CoverageItem;
