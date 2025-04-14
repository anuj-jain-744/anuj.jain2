import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import "./style.scss";
import Logo from "assets/QuoteAndBuy/Logo.svg";
import DriverInformation from "./DriverInformation";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getModelIcon } from "utils/getModelIcon";
import { getPlateNumber } from "utils/getPlateNumber";
 
interface IVehicleInformation {
  languageData: LanguageData | undefined | null;
}
 
const VehicleInformation: React.FC<IVehicleInformation> = ({
  languageData,
}) => {
  const { vehicleDetails, vehicleDetailsResponseData, makeModelResponse } =
    useQuoteAndBuyContext();
 
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(true);
 
  useEffect(() => {
    setIsAccordionOpen(true);
  }, []);
 
  return (
    <React.Fragment>
      <Accordion
        defaultActiveKey="0"
        className={`${
          isAccordionOpen ? "accor-open" : "accor-close"
        } w-100 coverage-vehicleinfo`}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <div className="logo-container">
                <img
                  width={"48px"}
                  height={"48px"}
                  src={getModelIcon(vehicleDetailsResponseData?.make, makeModelResponse || []) ?? Logo}
                  alt="logo"
                />
              </div>
              <div className="px-2 d-flex flex-column">
                <div className="vehicle-title walaa-regular-400">
                  {vehicleDetailsResponseData?.make ?? " "}
                </div>
                <div className="vehicle-content walaa-medium-500">
                  {vehicleDetailsResponseData
                    ? getPlateNumber(vehicleDetailsResponseData)
                    : ""}
                </div>
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body
            onEntered={() => setIsAccordionOpen(true)}
            onExiting={() => setIsAccordionOpen(false)}
            className="p-2"
          >
            {/* row 1 */}
            <div className="row">
              <div className="col">
                <div className="d-flex flex-column">
                  <div className="vehicle-infor-title walaa-regular-400">
                    {languageData?.no_plate}
                  </div>
                  <div className="vehicle-infor-content walaa-medium-500">
                    {vehicleDetailsResponseData
                      ? getPlateNumber(vehicleDetailsResponseData)
                      : ""}
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="d-flex flex-column">
                  <div className="vehicle-infor-title walaa-regular-400">
                    {languageData?.registration_year_label}
                  </div>
                  <div className="vehicle-infor-content walaa-medium-500">
                    {vehicleDetailsResponseData?.manufactureYear ?? "N/A"}
                  </div>
                </div>
              </div>
            </div>
 
            {/* row 2 */}
            <div className="row pt-3">
              <div className="col">
                <div className="d-flex flex-column">
                  <div className="vehicle-infor-title walaa-regular-400">
                    {vehicleDetails?.vehicleCustomID
                      ? languageData?.custom_card_no
                      : languageData?.vehicle_sequence}
                  </div>
                  <div className="vehicle-infor-content walaa-medium-500">
                    {vehicleDetails?.vehicleCustomID ??
                      vehicleDetails?.vehicleSequenceNo ??
                      languageData?.not_applicable}
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="d-flex flex-column">
                  <div className="vehicle-infor-title walaa-regular-400">
                    {languageData?.chasis_no}
                  </div>
                  <div className="vehicle-infor-content walaa-medium-500">
                    {vehicleDetailsResponseData?.chassisNumber ?? " "}
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
 
      {/* Always render DriverInformation */}
      <DriverInformation languageData={languageData} />
    </React.Fragment>
  );
};
 
export default VehicleInformation;