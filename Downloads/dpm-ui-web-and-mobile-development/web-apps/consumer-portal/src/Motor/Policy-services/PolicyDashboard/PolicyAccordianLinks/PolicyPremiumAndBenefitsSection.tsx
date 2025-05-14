import React from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import { PremiumAndBenefitTitle } from "types/policyDetails";

interface Props {
  sumInsured: string | number;
  premiumAmount: string | number;
  languageData: LanguageData | undefined;
}

// TODO: need to update the value when api is ready
const treatmentCost = {
  description: "Treatment costs of physical damages caused to a Third Party inside or outside the vehicle for ministry of health claims.",
  value: `SAR 10,000.00`,
};

const materialCost = {
  description: "Material damages inflicted on a Third Party outside the Vehicle.",
  value: `SAR 10,000.00`,
};

const expenses = {
  description: "Expenses",
  value: `SAR 10,000.00`,
};

const BenefitItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="policyacc-benefits-fromelement">
    <div className="policyacc-benefits-lebal">{label}</div>
    <div className="policyacc-benefits-text walaa-medium-500">{value}</div>
  </div>
);

const BenefitRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="policyacc-benefits-partTwo-element">
    <div className="policyacc-benefits-partTwo-label">
      <div className="policyacc-benefits-partTwo-label-inner">{label}</div>
    </div>
    <div className="policyacc-benefits-partTwo-text walaa-medium-500">{value}</div>
  </div>
);

const BenefitSection: React.FC<{ items: { label: string; value: string }[] }> = ({ items }) => (
  <div className="policyacc-benefits-frameBottom">
    {items.map((item, index) => (
      <BenefitRow key={index} label={item.label} value={item.value} />
    ))}
  </div>
);

export default function Component({ sumInsured, premiumAmount, languageData }: Props = {
  sumInsured: "0",
  premiumAmount: "0",
  languageData: undefined
}) {
  const premiumAndBenefitTitle: PremiumAndBenefitTitle = {
    sum_insured : `SAR ${sumInsured}`,
    premium_amount : `SAR ${premiumAmount}`,
  };

  return (
    <Accordion.Item
      className="policyacc-accordion-item walaa-regular-400"
      eventKey="3"
    >
      <Accordion.Header className="policyacc-accordion-header policyacc-collapse-font">
        {languageData?.policy_premium_benifits}
      </Accordion.Header>
      <Accordion.Body className="policyacc-benefits-container">
        <div className="policyacc-benefits-partOne">
          <div className="policyacc-benefits-frame">
            <BenefitItem label={languageData?.sum_insured ?? ""} value={premiumAndBenefitTitle?.sum_insured} />
            <BenefitItem label={languageData?.premium_amount ?? ""} value={premiumAndBenefitTitle?.premium_amount} />
          </div>
        </div>
        <div className="policyacc-benefits-partTwo">
          <BenefitSection
            items={[
              { label: languageData?.treatment_non_ministry ?? "", value: treatmentCost.value },
              { label: languageData?.treatment_non_ministry ?? "", value: treatmentCost.value },
            ]}
          />
          <hr className="regular-line" />
          <BenefitSection
            items={[
              { label: languageData?.treatment_costs_of_physica ?? "", value: materialCost.value },
              { label: languageData?.expenses ?? "", value: expenses.value },
            ]}
          />
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
}