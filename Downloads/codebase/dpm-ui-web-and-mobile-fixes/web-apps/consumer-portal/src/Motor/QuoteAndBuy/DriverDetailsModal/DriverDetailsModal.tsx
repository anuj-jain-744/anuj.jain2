import React, { useState, useEffect } from "react";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import style from "./DriverDetailsModal.module.scss";
import { Modal } from "react-bootstrap";
import ThemeButton from "components/ThemeButton/ThemeButton";
import Card from "./Card";
import CardDetails from "./CardDetails";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { driverEducationMappingValue, driverMaritalMappingValue, driverRelationMappingValue, getDriverEducation, getMaritalStatus, geteDriverRelation } from "utils/quoteAndBuy";

interface Props {
  show: boolean;
  onHide: () => void;
  languageData: LanguageData | undefined | null;
  driverID?: string;
}

interface FormDataState {
  maritalStatusCd: string;
  childrenBelow16: number;
  driverRelationship: string;
  educationLevel: string;
  licenseCountry: string;
  trafficViolations: string;
  healthConditions: string;
}

const DriverDetailsModal: React.FC<Props> = ({
  show,
  onHide,
  languageData,
  driverID,
}) => {
  const { driverDetailsResponseData, setDriverDetailsResponseData } = useQuoteAndBuyContext();
  
  const [formData, setFormData] = useState<FormDataState>({
    maritalStatusCd: "",
    childrenBelow16: 0,
    driverRelationship: "",
    educationLevel: "",
    licenseCountry: "",
    trafficViolations: "",
    healthConditions: "",
  });

  // Predefined options
  const maritalStatus = ["Other", "Married", "Single", "Divorced", "Widowed"];
  const driverRelation = ["Family member", "Friend", "Private driver", "None"];
  const driverEducation = [
    "Primary",
    "Elemantary",
    "Secondary",
    "Diploma",
    "Bachelor",
    "Master",
    "PhD",
    "Others",
  ];
  const licenseCountry = ["Saudi Arabia", "India", "Other"];
  const trafficeVoilations = [
    "Speed Ticket",
    "Override Traffic Light",
    "Driving Opposite Direction",
    "Drifting",
    "Parking Violations",
  ];
  const healthCondition = [
    "Automatic Vehicle",
    "Prostheses Part",
    "Lenses for Eyesight",
    "Daytime Only",
    "Earpiece",
    "Vehicle for disabled",
    "No Restriction",
    "Driving Inside KSA Only",
    "For Private Use With No Payment",
  ];

  const currentDriverData = driverDetailsResponseData.find(
    (driver) => driver.driverID === driverID
  );

  // Populate form data when modal opens or driver changes
  
  useEffect(() => {

    if (currentDriverData && show) {
      setFormData({
        maritalStatusCd: currentDriverData.additionalDriverDetails?.maritalStatusCd ?
         getMaritalStatus(currentDriverData.additionalDriverDetails?.maritalStatusCd) : "",
        childrenBelow16: currentDriverData.additionalDriverDetails?.childrenBelow16 || 0,
        driverRelationship: currentDriverData?.additionalDriverDetails?.driverRelationship ?
         geteDriverRelation(parseInt(currentDriverData?.additionalDriverDetails?.driverRelationship)) : "",
        educationLevel: currentDriverData.additionalDriverDetails?.educationLevel ?
          getDriverEducation(currentDriverData.additionalDriverDetails?.educationLevel) : "",
        licenseCountry: currentDriverData.additionalDriverDetails?.licenseCountry || "",
        trafficViolations: currentDriverData.trafficViolations || "",
        healthConditions: currentDriverData.healthConditions || "",
      });
    }
  }, [currentDriverData, show]);
  
 const handleUpdateDriverDetails = () => {
  const updatedDriverDetails = driverDetailsResponseData.map((driver) =>
    driver.driverID === driverID
      ? {
          ...driver,
          healthConditions: formData.healthConditions,
          trafficViolations: formData.trafficViolations,
          additionalDriverDetails: {
            ...driver.additionalDriverDetails,
            maritalStatusCd: driverMaritalMappingValue(formData.maritalStatusCd),
            childrenBelow16: formData.childrenBelow16,
            driverRelationship: String(driverRelationMappingValue(formData.driverRelationship)),
            educationLevel: driverEducationMappingValue(formData.educationLevel),
            licenseCountry: formData.licenseCountry,
          }
        }
      : driver
  );

  setDriverDetailsResponseData(updatedDriverDetails);

  onHide();
};

  const handleFormDataChange = (
    field: keyof FormDataState,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal show={show} onHide={onHide} className={style.mainContainer}>
      <div className={style.modalContainer}>
        <div className={style.frame}>
          <div className={style.heading}>{languageData?.driver_details}</div>
        </div>
        <div className={style.body}>
          <Card languageData={languageData} driverData={currentDriverData} />
          <CardDetails
            languageData={languageData}
            maritalStatus={maritalStatus}
            driverRelation={driverRelation}
            driverEducation={driverEducation}
            licenseCountry={licenseCountry}
            trafficeVoilations={trafficeVoilations}
            healthCondition={healthCondition}
            selectedMaritalStatus={formData.maritalStatusCd}
            selectedNoOfChildren={formData.childrenBelow16}
            selectedDriverRelation={formData.driverRelationship}
            selectedDriverEducation={formData.educationLevel}
            selectedLicenseCountry={formData.licenseCountry}
            selectedTrafficViolation={formData.trafficViolations}
            selectedHealthCondition={formData.healthConditions}
            onMaritalStatusChange={(value) =>
              handleFormDataChange("maritalStatusCd", value)
            }
            onNoOfChildrenChange={(value) =>
              handleFormDataChange("childrenBelow16", value)
            }
            onDriverRelationChange={(value) =>
              handleFormDataChange("driverRelationship", value)
            }
            onDriverEducationChange={(value) =>
              handleFormDataChange("educationLevel", value)
            }
            onLicenseCountryChange={(value) =>
              handleFormDataChange("licenseCountry", value)
            }
            onTrafficViolationChange={(value) =>
              handleFormDataChange("trafficViolations", value)
            }
            onHealthConditionChange={(value) =>
              handleFormDataChange("healthConditions", value)
            }
            driverID={driverID}
          />
        </div>
        <div className={style.frameBottom}>
          <ThemeButton
            icon={false}
            variant="outline"
            isDisabled={false}
            title={languageData?.cancel}
            classes="walaa-medium-500"
            onClickhandler={onHide}
          />
          <ThemeButton
            icon={false}
            variant="trackClaim"
            isDisabled={false}
            title={languageData?.update}
            classes="walaa-medium-500"
            onClickhandler={handleUpdateDriverDetails}
          />
        </div>
        <img
          src={closeIcon}
          alt="close icon"
          className={style.modalCloseIcon}
          onClick={onHide}
        />
      </div>
    </Modal>
  );
};

export default DriverDetailsModal;