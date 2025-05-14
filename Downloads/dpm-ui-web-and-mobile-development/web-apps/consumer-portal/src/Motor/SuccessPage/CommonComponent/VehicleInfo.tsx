import { CURRENCY } from "constant";
import React from "react";
import { LanguageData } from "types/languageData";
import { SuccessPagePolicyData } from "types/quoteAndBuy";
import { getModelIcon } from "utils/getModelIcon";

const ThirdParty = "ThirdParty";
interface VehicleInfoProps {
    policyData: SuccessPagePolicyData | undefined;
    languageData: LanguageData;
    plateNumber: string | undefined;
    repairCondition: string | number | undefined;
    makeModelResponse?: {image: string, model: string}[];
}

interface VehicleHeaderProps {
    makeText: string;
    modelText: string;
    plateNumber: string;
    vehicleMake: string;
    makeModelResponse?: {image: string, model: string}[];
}

interface VehicleInfoItemProps {
    label: string;
    value: string;
    className: string;
  }

const VehicleInfo:React.FC<VehicleInfoProps> = ({ policyData, languageData, plateNumber, repairCondition, makeModelResponse }) => (
    <div className="vehicle-info">
      <div className="vehicle-details">
        <VehicleHeader 
          makeText={policyData?.vehicleMakeText ?? ""}
          modelText={policyData?.vehicleModelText ?? ""}
          plateNumber={plateNumber ?? ""}
          vehicleMake={policyData?.vehicleMake ?? ""}
          makeModelResponse={makeModelResponse ?? []}
        />
        <hr />
        <VehicleInfoItem 
          label={languageData?.repair_type}
          value={policyData?.coverageName !== ThirdParty ? `${repairCondition} ${languageData?.repair}`: languageData?.not_applicable}
          className="repair-info"
        />
        <hr />
        <VehicleInfoItem 
          label={languageData?.sum_insured}
          value={`${CURRENCY} ${policyData?.sumInsured}`}
          className="sum-insured-info"
        />
      </div>
    </div>
  );

  const VehicleHeader:React.FC<VehicleHeaderProps> = ({ makeText, modelText, plateNumber, vehicleMake, makeModelResponse  }) => (
    <div className="vehicle-header">
      <div className="vehicle-logo">
        <img width={"48px"} height={"48px"} src={getModelIcon(vehicleMake, makeModelResponse || [])} alt="car icon" />
      </div>
      <div className="vehicle-details-text">
        <div className="vehicle-model walaa-regular-400">
          {`${makeText} ${modelText}`}
        </div>
        <div className="vehicle-number-plate walaa-medium-500">
          {plateNumber}
        </div>
      </div>
    </div>
  );

  const VehicleInfoItem: React.FC<VehicleInfoItemProps> = ({ label, value, className }) => (
    <div className={className}>
      <div className="repair-label walaa-regular-400">
        {label}
      </div>
      <div className="repair-value walaa-medium-500">
        {value}
      </div>
    </div>
  );

  export default VehicleInfo;