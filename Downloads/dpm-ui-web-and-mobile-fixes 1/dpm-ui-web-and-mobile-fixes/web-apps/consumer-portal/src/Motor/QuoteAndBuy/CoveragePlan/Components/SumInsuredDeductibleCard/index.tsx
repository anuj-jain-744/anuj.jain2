import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import "./style.scss";
import { useEffect } from "react";
import data from "./../../../SumInsuredAndDeductibles/SumInsuredAndDeductibles.json"
import { getAmountText } from "@dpm/shared-module";

const SumInsuredDeductibleCard = () => {
  const { sliderValueDeductibles, sliderValueSumInsured } =
    useQuoteAndBuyContext();

  useEffect(() => {}, [sliderValueDeductibles, sliderValueSumInsured]);

  return (
    <div className="sum-insured-deductible-card">
      <div className="left">
        <div className="card-head walaa-regular-400">{data.sum_insured}</div>
        <div className="card-value walaa-medium-500">
          {data.sar} {getAmountText(sliderValueSumInsured)}
        </div>
      </div>
      <div className="horizontal-line">
        <hr />
      </div>
      <div className="right">
        <div className="card-head walaa-regular-400">{data.deductible}</div>
        <div className="card-value walaa-medium-500">
          {data.sar} {getAmountText(sliderValueDeductibles)}
        </div>
      </div>
    </div>
  );
};

export default SumInsuredDeductibleCard;
