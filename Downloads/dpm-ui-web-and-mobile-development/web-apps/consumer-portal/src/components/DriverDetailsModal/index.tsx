import React, { useState, useEffect } from "react";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import style from "./DriverDetailsModal.module.scss";
import { Modal } from "react-bootstrap";
import ThemeButton from "components/ThemeButton/ThemeButton";
import Card from "./Card";
import CardDetails from "./CardDetails";
import { useMasterData } from "./hook/useMasterData";
import { DriverProps } from "types/driver";
import { DriverDetailsData } from "types/quoteAndBuy";

interface Props {
  show: boolean;
  showDriverDetails: boolean;
  languageData: {[key:string] : string};
  driverDetails: DriverProps;
  setDriverDetails: (driverDetails: DriverProps) => void;
  newDriverRelation: number;
  setNewDriverRelation: (newDriverRelation: number) => void;
  handleDriverUpdate:(driverDetails: DriverProps) => void;
  onHide: () => void;
}

const DriverDetailsModal: React.FC<Props> = ({
  showDriverDetails, 
  languageData, 
  driverDetails,
  setDriverDetails,
  handleDriverUpdate,
  onHide
}) => {
  const [formData, setFormData] = useState<Partial<DriverDetailsData>>({
    maritalStatus: "",
    noOfChildren: 0,
    driverRelationship: "",
    driverEducation: "",
    licenseCountry: "",
    trafficViolation: "",
    healthCondition: "",
  });

  //Block to fetch Relation Master data
  const { makeMasterApiCall, relationData: driverRelation } = useMasterData("getRelations");
  useEffect(() => {
    makeMasterApiCall();
  }, []);

  //Block to fetch Marital Status Master data
  const { 
    makeMasterApiCall: makeMaritalStatusApiCall,
    relationData: maritalStatus
  } = useMasterData("getMaritalStatus");
  useEffect(() => {
    const fetchData = async () => {
        await makeMaritalStatusApiCall();
    };
    fetchData();
  }, [makeMaritalStatusApiCall]);

  //Block to fetch License Country Master data
  const { 
    makeMasterApiCall: makeCountryCodesApiCall,
    relationData: licenseCountry

  } = useMasterData("getCountryCodes");
  useEffect(() => {
    const fetchData = async () => {
        await makeCountryCodesApiCall();
    };
    fetchData();
  }, [makeCountryCodesApiCall]);

  //Block to fetch Health Condition Master data
  const { 
    makeMasterApiCall: makeHealthConditionsApiCall,
    relationData: healthCondition
  } = useMasterData("getHealthConditions");

  useEffect(() => {
    const fetchData = async () => {
        await makeHealthConditionsApiCall();
    };
    fetchData();
  }, [makeHealthConditionsApiCall]);

  //Block to fetch Traffic Violation Master data
  const { 
    makeMasterApiCall: makeTrafficViolationsApiCall,
    relationData: trafficeVoilations
  } = useMasterData("getTrafficViolations");
  useEffect(() => {
    const fetchData = async () => {
        await makeTrafficViolationsApiCall();
    };
    fetchData();
  }, [makeTrafficViolationsApiCall]);

  //Block to fetch Driver Education Master data
  const { 
    makeMasterApiCall: makeDriverEducationApiCall,
    relationData: driverEducation
  } = useMasterData("getEducationLevels");

  useEffect(() => {
    const fetchData = async () => {
        await makeDriverEducationApiCall();
    };
    fetchData();
  }, [makeDriverEducationApiCall]);

  const currentDriverData = driverDetails;
  const driverID=driverDetails?.driverID;

  // Populate form data when modal opens or driver changes
  useEffect(() => {
    if (currentDriverData && showDriverDetails) {
      setFormData({
        maritalStatus: currentDriverData.maritalStatusCd ?? "",
        noOfChildren: currentDriverData.childrenBelow16 ?? 0,
        driverRelationship: currentDriverData.relation ?? "",
        driverEducation: currentDriverData.educationLevel ?? "",
        licenseCountry: currentDriverData.licenseType ?? "",
        trafficViolation: currentDriverData.trafficViolations ?? "",
        healthCondition: currentDriverData.healthConditions ?? "",
      });
    }
  }, [currentDriverData, showDriverDetails]);

  const handleUpdateDriverDetails = () => {
    const modifiedData = {...currentDriverData,
      maritalStatusCd: formData.maritalStatus,
      childrenBelow16: formData.noOfChildren,
      educationLevel: formData.driverEducation,
      licenseType: formData.licenseCountry,
      trafficViolations: formData.trafficViolation,
      healthConditions: formData.healthCondition
    };
    setDriverDetails(modifiedData);
    handleDriverUpdate(modifiedData);
  };

  const handleFormDataChange = (
    field: keyof DriverDetailsData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal show={showDriverDetails} onHide={onHide} className={style.mainContainer}>
      <div className={style.modalContainer}>
        <div className={style.frame}>
          <div className={style.heading}>{languageData?.driver_details}</div>
        </div>
        <div className={style.body}>
          <Card languageData={languageData} driverData={currentDriverData} driverRelation={driverRelation} />
          <CardDetails
            languageData={languageData}
            maritalStatus={maritalStatus?.model?.content}
            driverEducation={driverEducation?.model?.content}
            licenseCountry={licenseCountry?.model?.content}
            trafficeVoilations={trafficeVoilations?.model?.content}
            healthCondition={healthCondition?.model?.content}
            selectedMaritalStatus={formData.maritalStatus}
            selectedNoOfChildren={formData.noOfChildren}
            selectedDriverEducation={formData.driverEducation}
            selectedLicenseCountry={formData.licenseCountry}
            selectedTrafficViolation={formData.trafficViolation}
            selectedHealthCondition={formData.healthCondition}
            onMaritalStatusChange={(value) =>
              handleFormDataChange("maritalStatus", value)
            }
            onNoOfChildrenChange={(value) =>
              handleFormDataChange("noOfChildren", value)
            }
            onDriverRelationChange={(value) =>
              handleFormDataChange("driverRelationship", value)
            }
            onDriverEducationChange={(value) =>
              handleFormDataChange("driverEducation", value)
            }
            onLicenseCountryChange={(value) =>
              handleFormDataChange("licenseCountry", value)
            }
            onTrafficViolationChange={(value) =>
              handleFormDataChange("trafficViolation", value)
            }
            onHealthConditionChange={(value) =>
              handleFormDataChange("healthCondition", value)
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
            dataTestId="update-driver-detail"
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
