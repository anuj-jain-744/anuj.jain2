import { FC } from "react";
import { LanguageData } from "types/languageData";
import { HOME_COVERAGE_PLANS_NAMES, HOME_COVERAGE_PLANS_TYPES } from "constant";
import { compensationTypeCardFinalVAT } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { ViewPolicy } from "types/endorsement";
import { getAmountText } from "@dpm/shared-module";
import { getAmountWithIcon } from "@app-shell/utils/common";

interface PolicyCardProps {
  languageData: LanguageData;
  orderSummary: { policyBenefits: [], subtotal: number; vatAmount: number; netPremium: number };
  viewPolicy: ViewPolicy;
}

const OrderSummary: FC<PolicyCardProps> = ({ orderSummary, languageData, viewPolicy }) => {
  const { policyBenefits, adminFeeAmount, subtotal, vatAmount, netPremium } = orderSummary;
  const coverageType = viewPolicy?.policyLob[0].planCode;
  const coverageValue = coverageType?.replace(/\s+/g, '').toLowerCase() || null;
  const coveragePlan = HOME_COVERAGE_PLANS_NAMES[HOME_COVERAGE_PLANS_TYPES[coverageValue]] || null;
  const coveragePrice = viewPolicy?.policyBasic?.premiumInfo?.finalPremium;
  const percentage = viewPolicy?.policyBasic?.premiumInfo?.taxFeeBreakdowns[0]?.percentage;

  return (
    <div className="policy-claim-container order-summary-container">
      <div className="select-policy-header walaa-medium-500">
        {languageData?.order_summary}
      </div>
      <hr className="horizontal-line" />
      <div className="order-summary-list">
        <div className="order-summary-title">
          {languageData?.endorsement}
        </div>
        <div className="row pt-3">
          <div className="col">
            <div className="d-flex flex-column">
              <div className="order-summary-label">
                {coveragePlan} {coverageType}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="d-flex flex-column">
              <div className="order-summary-label-right">
                {getAmountWithIcon(coveragePrice)}
              </div>
            </div>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col">
            <div className="d-flex flex-column">
              <div className="order-summary-label">
                {languageData?.adminfees}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="d-flex flex-column">
              <div className="order-summary-label-right">
                {getAmountWithIcon(Number(adminFeeAmount))}
              </div>
            </div>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col">
            <div className="d-flex flex-column">
              <div className="order-summary-label walaa-medium-500">
                {languageData?.additional_benefits}
              </div>
            </div>
          </div>
        </div>
        {policyBenefits.map((item: ViewPolicy, index) => {
          const label = languageData?.coverage_beneits?.filter(value => (value?.coverageCode === item?.coverageCode));
          const price = item?.premiumInfo?.finalPremium;
          return (<div key={index} className="row pt-3">
            <div className="col">
              <div className="d-flex flex-column">
                <div className="order-summary-label">
                  {label[0]?.coverageName}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-flex flex-column">
                <div className="order-summary-label-right" data-testid="ageOfBuilding">
                  {getAmountWithIcon(price)}
                </div>
              </div>
            </div>
          </div>)
        })}
        <div className="row pt-3">
          <div className="col">
            <div className="d-flex flex-column">
              <div className="order-summary-label order-summary-total">
                {languageData?.subtotal}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="d-flex flex-column">
              <div className="order-summary-label-right order-summary-total">
                {getAmountWithIcon(subtotal)}
              </div>
            </div>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col">
            <div className="d-flex flex-column">
              <div className="order-summary-label">
                {languageData?.vat_amount} ({compensationTypeCardFinalVAT(percentage)}%)
              </div>
            </div>
          </div>
          <div className="col">
            <div className="d-flex flex-column">
              <div className="order-summary-label-right">
                {getAmountWithIcon(vatAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" order-summary-footer">
        <div className="col">
          <div className="d-flex flex-column">
            <div className="left">
              {languageData?.total_amount}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex flex-column">
            <div className="right">
              {getAmountWithIcon(netPremium)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;