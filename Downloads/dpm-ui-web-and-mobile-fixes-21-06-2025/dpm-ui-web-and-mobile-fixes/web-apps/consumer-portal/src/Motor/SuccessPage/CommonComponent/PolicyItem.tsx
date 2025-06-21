import React from "react";

interface PolicyItemProps {
  label: string;
  value: string | undefined | React.ReactNode;
  isPremium?: boolean;
  isEndosementPolicy?:boolean;
  imgSrc?:string;
}

const PolicyItem: React.FC<PolicyItemProps> = ({
  label,
  value,
  isPremium = false,
  isEndosementPolicy = false,
  imgSrc = ""
}) => (
  <div className= {`policy-item ${isEndosementPolicy ? 
      "endorsementPolicy" : ""
    }`}>
    {
      isEndosementPolicy &&
      <div className="make-Img">
        <img src={imgSrc} />
      </div>
    }
    <div className= {isEndosementPolicy ? 
      "endorsementPolicyLabel" : ""
    }>
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
    
  </div>
);

export default PolicyItem;
