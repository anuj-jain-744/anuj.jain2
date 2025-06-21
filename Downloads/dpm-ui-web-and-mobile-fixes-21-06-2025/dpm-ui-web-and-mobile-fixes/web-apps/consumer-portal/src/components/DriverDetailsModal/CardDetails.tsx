import React from "react";
import style from "./DriverDetailsModal.module.scss";
import CardDetailsFrame from "./CardDetailsFrame";
import { LanguageData } from "types/languageData";

interface Props {
  languageData: LanguageData | undefined | null;
  maritalStatus: string[];
  driverRelation: string[];
  driverEducation: string[];
  licenseCountry: string[];
  trafficeVoilations: string[];
  healthCondition: string[];
  
  // Selected values
  selectedMaritalStatus?: string | number;
  selectedNoOfChildren?: number;
  selectedDriverRelation?: string | number;
  selectedDriverEducation?: string | number;
  selectedLicenseCountry?: string | number;
  selectedTrafficViolation?: string;
  selectedHealthCondition?: string;
  
  // Change handlers
  onMaritalStatusChange: (value: string) => void;
  onNoOfChildrenChange: (value: number) => void;
  onDriverRelationChange: (value: string) => void;
  onDriverEducationChange: (value: string) => void;
  onLicenseCountryChange: (value: string) => void;
  onTrafficViolationChange: (value: string) => void;
  onHealthConditionChange: (value: string) => void;

  driverID?: string;
}

const CardDetails: React.FC<Props> = ({
  maritalStatus,
  driverRelation,
  driverEducation,
  licenseCountry,
  trafficeVoilations,
  healthCondition,
  languageData,
  
  // Selected values
  selectedMaritalStatus,
  selectedNoOfChildren,
  selectedDriverRelation,
  selectedDriverEducation,
  selectedLicenseCountry,
  selectedTrafficViolation,
  selectedHealthCondition,
  
  // Change handlers
  onMaritalStatusChange,
  onNoOfChildrenChange,
  onDriverRelationChange,
  onDriverEducationChange,
  onLicenseCountryChange,
  onTrafficViolationChange,
  onHealthConditionChange,

}) =>  {

  
  return (
    <div className={style.cardDetails}>
      <div className={style.cardDetailsLabel}>{languageData?.driver_s_personal_details}</div>
      <div className={style.cardDetailsFrameContainer}>
        <CardDetailsFrame
          frameValues={[
              {
                  label: languageData?.marital_status,
                  type: "dropdown",
                  value: maritalStatus,
                  selectedValue: selectedMaritalStatus,
                  onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
                    onMaritalStatusChange(event.target.value),
              },
              {
                  label: languageData?.no_of_children_under_16,
                  type: "textbox",
                  value: selectedNoOfChildren?.toString() || '0',
                  onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
                    onNoOfChildrenChange(parseInt(event.target.value)),
              },
          ]}
        />
      </div>
      <div className={style.cardDetailsFrameContainer}>
        <CardDetailsFrame
          frameValues={[
            {
              label: languageData?.driver_relation,
              type: "dropdown",
              value: driverRelation,
              selectedValue: selectedDriverRelation,
              onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
                onDriverRelationChange(event.target.value),
            },
            {
              label: languageData?.driver_education,
              type: "dropdown",
              value: driverEducation,
              selectedValue: selectedDriverEducation,
              onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
                onDriverEducationChange(event.target.value),
            }
          ]}
        />
      </div>
      <div className={style.cardDetailsFrameContainer}>
        <CardDetailsFrame
          frameValues={[
            {
              label: languageData?.license_country,
              type: "dropdown",
              value: licenseCountry,
              selectedValue: selectedLicenseCountry,
              onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
                onLicenseCountryChange(event.target.value),
            },
            {
              label: languageData?.traffic_violation,
              type: "dropdown",
              value: trafficeVoilations,
              selectedValue: selectedTrafficViolation,
              onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
                onTrafficViolationChange(event.target.value),
            }
          ]}
        />
      </div>
      <div className={`${style.cardDetailsFrameContainer} ${style.containerWidth}`}>
        <CardDetailsFrame
          frameValues={[
            {
              label: languageData?.health_condition,
              type: "dropdown",
              value: healthCondition,
              selectedValue: selectedHealthCondition,
              onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
                onHealthConditionChange(event.target.value),
            }
          ]}
        />
      </div>
    </div>
  );
}
  

export default CardDetails;