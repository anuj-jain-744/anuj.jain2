import React from "react";

interface PolicyItemProps {
  label: string;
  value: string | undefined | React.ReactNode;
  isPremium?: boolean;
}

const PolicyItem: React.FC<PolicyItemProps> = ({
  label,
  value,
  isPremium = false,
}) => (
  <div className="policy-item">
    <div
      className={`${
        isPremium ? "premium-label" : "policy-label"
      } walaa-regular-400`}
    >
      {label}
    </div>
    <div
      className={`${
        isPremium ? "premium-value" : "policy-value"
      } walaa-medium-500`}
    >
      {value}
    </div>
  </div>
);

export default PolicyItem;
