import React from "react";
import data from "./RepairType.json";
import ThemeRadioCheckbox from "components/ThemeRadioCheckbox/ThemeRadioCheckbox";
import { getAmountText } from "@dpm/shared-module";

const RepairOption = ({
  price,
  name,
  index,
  onViewBenefitsClick,
  onChangehandler,
  isRepairTypeSelected,
  languageData,
  totalOptions,
}) => {
  const mostPopular = Array.isArray(languageData?.motor_coverage_plans);
  let isPopular = 0;
  if (mostPopular) {
    // Most Popular plan  items 
    const mostPurchased = languageData?.motor_coverage_plans?.findIndex((value: { is_popular: number, name: string }) => value?.is_popular && value?.name === name)
    if (mostPurchased !== -1) {
      isPopular = 1;
    }
  }
  return (
    <div
      className={`repair-option-container ${totalOptions <= 2 ? 'twooptions ' : ''}option-${index + 1}`}
      onClick={() => onChangehandler(name)}
    >
      {isPopular ? <div className="most-popular">{languageData?.most_popular}</div> : ''}
      <div className="inner-one">
        <div className="repair-radio">
          <ThemeRadioCheckbox
            label={""}
            type="radio"
            classes="repair-radio-btn"
            checked={isRepairTypeSelected}
            name="repairType"
            onChangehandler={onChangehandler}
          />
        </div>
        <div>
          <div className="repair walaa-medium-500">{name}</div>
          <div className="price walaa-regular-400">
            {languageData?.sar}{" "}
            <span className="amount walaa-medium-500">{getAmountText(price)}</span>
          </div>
          <div
            className="pop-up-link walaa-regular-400"
            onClick={() => onViewBenefitsClick(name)}
          >
            {data.viewBenefits}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairOption;