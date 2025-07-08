import { CURRENCY } from "constant";
import React from "react";
import { LanguageData } from "types/languageData";
import { SuccessPagePolicyData } from "types/quoteAndBuy";
import { getModelIcon } from "utils/getModelIcon";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { capitalizeNameFirstLetter } from "@dpm/shared-module";

const ThirdParty = "ThirdParty";
interface VehicleInfoProps {
    policyData: SuccessPagePolicyData | undefined;
    languageData: LanguageData;
    plateNumber: string | undefined;
    repairCondition: string | number | undefined;
    vehicleMakeId?: string | number;
    makeModelResponse?: {image: string, model: string, id: string}[];
    vehicleMakeTextEn?: string | number;
}

interface VehicleHeaderProps {
    makeText: string;
    modelText: string;
    plateNumber: string;
    vehicleMake: string;
    vehicleMakeId?: string | number;
    makeModelResponse?: {image: string, model: string, id: string}[];
    vehicleMakeTextEn?: string | number;
}

interface VehicleInfoItemProps {
    label: string;
    value: string;
    className: string;
    isAmount?: boolean;
  }

const VehicleInfo:React.FC<VehicleInfoProps> = ({ policyData, languageData, plateNumber, repairCondition, makeModelResponse, vehicleMakeTextEn, vehicleMakeId }) => (
    <div className="vehicle-info">
      <div className="vehicle-details">
        <VehicleHeader 
          makeText={policyData?.vehicleMakeText ?? ""}
          modelText={policyData?.vehicleModelText ?? ""}
          plateNumber={plateNumber ?? ""}
          vehicleMake={policyData?.vehicleMake ?? ""}
          makeModelResponse={makeModelResponse ?? []}
          vehicleMakeTextEn = {vehicleMakeTextEn ?? ""}
          vehicleMakeId = {vehicleMakeId ?? ""}
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
          isAmount={true}
        />
      </div>
    </div>
  );

  const VehicleHeader:React.FC<VehicleHeaderProps> = ({ makeText, modelText, plateNumber, makeModelResponse, vehicleMakeTextEn, vehicleMakeId   }) => (
    <div className="vehicle-header">
      <div className="vehicle-logo">
        <img src={getModelIcon(vehicleMakeTextEn, vehicleMakeId , makeModelResponse || [])} alt="car icon" />
      </div>
      <div className="vehicle-details-text">
        <div className="vehicle-model walaa-regular-400">
        {capitalizeNameFirstLetter(`${makeText} ${modelText}`)}
        </div>
        <div className="vehicle-number-plate walaa-medium-500">
          {plateNumber}
        </div>
      </div>
    </div>
  );

  const VehicleInfoItem: React.FC<VehicleInfoItemProps> = ({ label, value, className, isAmount= false }) => (
    <div className={className}>
      <div className="repair-label walaa-regular-400">
        {label}
      </div>
      <div className="repair-value walaa-medium-500">
        {isAmount ? getAmountWithIcon(value) : value}
      </div>
    </div>
  );

  export default VehicleInfo;