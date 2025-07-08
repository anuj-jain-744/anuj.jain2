import React from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import VehicleDetails from "./VehicleDetails";

interface Props {
  languageData: LanguageData | undefined;
  vehicleValue?: any | null;
  details?: unknown;
}

interface VehicleData {
  carModel: string;
  registrationPlateNo: string;
  registrationPlateText: string;
  vehicleMakeTextEn: string;
  vehicleModelTextEn: string;
  vehicleSequenceNo: string;
  vehicleCustomID: string;
  chassisNo: string;
  typeOfChassis: string;
  yearOfManufacture: string;
  serialNo: string;
  vehicleColor: string;
  transmission: string;
  registrationPlateText1?: string;
  registrationPlateText2?: string;
  registrationPlateText3?: string;
  vehicleModelText: string;
}

const VehicleDetailsSection: React.FC<Props> = ({
  languageData,
  vehicleValue,
  details,
}) => {

  return (
    <Accordion.Item
      className="policyacc-accordion-item walaa-regular-400"
      eventKey="2"
    >
      <Accordion.Header className="policyacc-accordion-header policyacc-collapse-font">
        {languageData?.vehicle_details}
      </Accordion.Header>
      <Accordion.Body className="policyacc-vehicle-container">
        {Array.isArray(vehicleValue) &&
          vehicleValue.map((vehicle: VehicleData, index: number) => (
            <VehicleDetails
              key={index}
              details={details}
              languageData={languageData}
              carModel={vehicle.vehicleModelText}
              registrationPlateNo={vehicle.registrationPlateNo}
              registrationPlateText1={vehicle.registrationPlateText1}
              registrationPlateText2={vehicle.registrationPlateText2}
              registrationPlateText3={vehicle.registrationPlateText3}
              vehicleMakeText={vehicle.vehicleMakeTextEn}
              vehicleModelText={vehicle.vehicleModelTextEn}
              vehicleSequenceNo={vehicle.vehicleSequenceNo}
              vehicleCustomID={vehicle.vehicleCustomID}
              chassisNo={vehicle.chassisNo}
              typeOfChassis={vehicle.typeOfChassis}
              yearOfManufacture={vehicle.yearOfManufacture}
              serialNo={vehicle.serialNo}
              vehicleColor={vehicle.vehicleColor}
              transmission={vehicle.transmission}
            />
          ))}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default VehicleDetailsSection;
