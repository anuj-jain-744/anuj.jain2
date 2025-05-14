import React from "react";
import { Accordion } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import VehicleDetails from "./VehicleDetails";

interface Props {
  languageData: LanguageData | undefined;
  vehicleValue?: any | null;
}

interface VehicleData {
  carModel: string;
  registrationPlateNo: string;
  registrationPlateText: string;
  vehicleMakeText: string;
  vehicleSequenceNo: string;
  chassisNo: string;
  typeOfChassis: string;
  yearOfManufacture: string;
  serialNo: string;
  vehicleColor: string;
  transmission: string;
}

const VehicleDetailsSection: React.FC<Props> = ({
  languageData,
  vehicleValue,
}) => {

  // TODO: get carModel from api current value is hardcoded because api value not matching
  const carModel = 'Nissan Accent';
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
              carModel={carModel}
              registrationPlateNo={vehicle.registrationPlateNo}
              registrationPlateText={vehicle.registrationPlateText}
              vehicleMakeText={vehicle.vehicleMakeText}
              vehicleSequenceNo={vehicle.vehicleSequenceNo}
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
