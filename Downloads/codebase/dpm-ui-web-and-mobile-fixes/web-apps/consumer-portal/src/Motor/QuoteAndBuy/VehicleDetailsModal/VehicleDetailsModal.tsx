import React, { useState, useEffect } from "react";
import closeIcon from "assets/QuoteAndBuy/closeIcon.svg";
import style from "./VehicleDetailsModal.module.scss";
import { Modal } from "react-bootstrap";
import ThemeButton from "components/ThemeButton/ThemeButton";
import Card from "./Card";
import Specifications from "./Specifications";
import Features from "./SpecificationDetails/Features";
import CameraAndSensor from "./SpecificationDetails/CameraAndSensor";
import Safety from "./SpecificationDetails/Safety";
import CommercialVehicle from "./SpecificationDetails/CommercialVehicle";
import ExpandSection from "./ExpandSection";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

interface Props {
  show: boolean;
  onHide: () => void;
  languageData: LanguageData  | undefined | null;
}

const VehicleDetailsModal: React.FC<Props> = ({ show, onHide, languageData }) => {
  const { vehicleDetails, setVehicleDetails } = useQuoteAndBuyContext();
  const [showModal, setShowModal] = useState(show);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // State for features
  const [isAdaptiveCruise, setIsAdaptiveCruise] = useState<boolean>(
    vehicleDetails?.features?.adaptiveCruiseControl ?? false
  );
  const [isCruiseControl, setIsCruiseControl] = useState<boolean>(
    vehicleDetails?.features?.cruiseControl ?? false
  );
  const [isModified, setIsModified] = useState<boolean>(
    vehicleDetails?.features?.modification ?? false
  );

  // state for camera
  const [rearParkingSensor, setRearParkingSensor] = useState<boolean>(vehicleDetails?.camera?.rearCamera ?? false);
  const [frontSensor, setFrontSensor] = useState<boolean>(vehicleDetails?.camera?.frontSensor ?? false);
  const [frontCamera, setFrontCamera] = useState<boolean>(vehicleDetails?.camera?.frontCamera ?? false);
  const [rearCamera, setRearCamera] = useState<boolean>(vehicleDetails?.camera?.rearCamera ?? false);
  const [degreeCamera, setDegreeCamera] = useState<boolean>(vehicleDetails?.camera?.degreeCamera ?? false);

  // State for safety
  const [parkingValue, setParkingValue] = useState<string>(
    vehicleDetails?.safety?.parking ?? ""
  );
  const [antiTheftAlarmValue, setAntiTheftAlarmValue] = useState<string>(
    vehicleDetails?.safety?.antiTheftAlarm ?? ""
  );
  const [antiLockBrakingSystemValue, setAntiLockBrakingSystemValue] = useState<number | string>(
    vehicleDetails?.safety?.antiLockBrakingSystem ?? ""
  );
  const [isAutomaticBrakingSystem, setIsAutomaticBrakingSystem] = useState<boolean>(
    vehicleDetails?.safety?.automaticBrakingSystem ?? false
  );

  // State for commercial vehicle
  const [vehicleAxleWeight, setVehicleAxleWeight] = useState<number>(
    vehicleDetails?.commercialVehicle?.vehicleAxleWeight ?? 0
  );
  const [fireExtinguisher, setFireExtinguisher] = useState<boolean>(
    vehicleDetails?.commercialVehicle?.fireExtinguisher ?? false
  );

  useEffect(() => {
    setShowModal(show);
  }, [show]);

const handleSubmitFiles = async () => {
  const vehicleSequenceNo = vehicleDetails?.vehicleSequenceNo ?? "";
  const plateNumber = vehicleDetails?.plateNumber ?? "";
  const registrationYear = vehicleDetails?.registrationYear ?? 0;
  const chassisNo = vehicleDetails?.chassisNo ?? "";
  const majorColor = vehicleDetails?.majorColor ?? "";
  const engineSize = vehicleDetails?.engineSize ?? "";
  const transmission = vehicleDetails?.transmission ?? "";

  const updatedVehicleDetails = {
    ...vehicleDetails,
    vehicleSequenceNo,
    plateNumber,
    registrationYear,
    chassisNo,
    majorColor,
    engineSize,
    transmission,
    features: {
      adaptiveCruiseControl: isAdaptiveCruise,
      cruiseControl: isCruiseControl,
      modification: isModified
    },
    safety: {
      parking: parkingValue,
      antiTheftAlarm: antiTheftAlarmValue,
      antiLockBrakingSystem: antiLockBrakingSystemValue,
      automaticBrakingSystem: isAutomaticBrakingSystem
    },
    camera: {
      rearParkingSensor,
      frontSensor,
      frontCamera,
      rearCamera,
      degreeCamera
    },
    commercialVehicle: {
      vehicleAxleWeight,
      fireExtinguisher
    }
  };

  setVehicleDetails(updatedVehicleDetails);
  handleClose();
};

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setShowModal(false);
    onHide();
  };

  return (
    <Modal show={showModal} onHide={handleClose} className={style.mainContainer} centered>
      <div className={style.modalContainer}>
        <div className={style.frame}>
          <div className={style.heading}>{languageData?.vehicle_details}</div>
          <img
            src={closeIcon}
            alt="close icon"
            className={style.modalCloseIcon}
            onClick={handleClose}
          />
        </div>

        <div className={style.body}>
          <div className={style.fixedContent}>
            <Card languageData={languageData}/>
          </div>

          <div className={style.scrollableContent}>
            {!isExpanded ? (
              <>
                <Specifications languageData={languageData} />
                <ExpandSection languageData={languageData} handleExpand={handleExpand} />
              </>
            ) : (
              <>
                <Specifications languageData={languageData} />
                <Features 
                  languageData={languageData}
                  isAdaptiveCruise={isAdaptiveCruise}
                  setIsAdaptiveCruise={setIsAdaptiveCruise}
                  isCruiseControl={isCruiseControl}
                  setIsCruiseControl={setIsCruiseControl}
                  isModified={isModified}
                  setIsModified={setIsModified}
                />
                <CameraAndSensor 
                  languageData={languageData}
                  rearParkingSensor={rearParkingSensor}
                  setRearParkingSensor={setRearParkingSensor}
                  frontSensor = {frontSensor}
                  setFrontSensor={setFrontSensor}
                  frontCamera = {frontCamera}
                  setFrontCamera={setFrontCamera}
                  rearCamera = {rearCamera}
                  setRearCamera={setRearCamera}
                  degreeCamera = {degreeCamera}
                  setDegreeCamera={setDegreeCamera}
                />
                <Safety 
                  languageData={languageData}
                  parkingValue={parkingValue}
                  setParkingValue={setParkingValue}
                  antiTheftAlarmValue={antiTheftAlarmValue}
                  setAntiTheftAlarmValue={setAntiTheftAlarmValue}
                  antiLockBrakingSystemValue={antiLockBrakingSystemValue}
                  setAntiLockBrakingSystemValue={setAntiLockBrakingSystemValue}
                  isAutomaticBrakingSystem={isAutomaticBrakingSystem}
                  setIsAutomaticBrakingSystem={setIsAutomaticBrakingSystem}
                />
                <CommercialVehicle
                 languageData={languageData}
                 vehicleAxleWeight = {vehicleAxleWeight}
                 setVehicleAxleWeight = {setVehicleAxleWeight}
                 isFireExtinguisher  = {fireExtinguisher}
                 setIsFireExtinguisher = {setFireExtinguisher} 
                />
              </>
            )}
          </div>
        </div>

        <div className={style.frameBottom}>
          <ThemeButton
            icon={false}
            variant="outline"
            isDisabled={false}
            title={languageData?.cancel}
            classes="walaa-medium-500"
            onClickhandler={handleClose}
          />
          <ThemeButton
            icon={false}
            variant="trackClaim"
            isDisabled={false}
            title={languageData?.update}
            classes="walaa-medium-500"
            onClickhandler={handleSubmitFiles}
          />
        </div>
      </div>
    </Modal>
  );
};

export default VehicleDetailsModal;