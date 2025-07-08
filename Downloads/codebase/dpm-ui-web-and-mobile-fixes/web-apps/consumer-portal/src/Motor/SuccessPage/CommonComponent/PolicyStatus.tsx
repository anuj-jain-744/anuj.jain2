import React from "react";

interface PolicyStatusProps {
    confirmed: string;
  }

const PolicyStatus:React.FC<PolicyStatusProps> = ({ confirmed }) => (
    <div className="policy-status">
      <div className="policy-status-text">
        <div className="walaa-medium-500 policy-status-text-label">
          {confirmed ?? 'Confirmed'}
        </div>
      </div>
    </div>
  );

export default PolicyStatus;